import Dexie, { type EntityTable } from 'dexie'
import type { AppMeta, Debt, DebtPayment, ExchangeRate, Expense, Income, MonthlySnapshot, SavingsGoal, Settings } from '../types/models'

export const defaultSettings: Settings = { strategy: 'snowball', progressCharacter: 'car', hideEncouragement: false, reduceMotion: false, comfortable: true, onboardingComplete: false, showQuickHelp:true, quickHelpMinimized:false, showReflections:true, preferredConversion:'card' }

class SalidaDB extends Dexie {
  incomes!: EntityTable<Income, 'id'>; expenses!: EntityTable<Expense, 'id'>; debts!: EntityTable<Debt, 'id'>; payments!: EntityTable<DebtPayment, 'id'>;
  snapshots!: EntityTable<MonthlySnapshot, 'id'>; savingsGoals!: EntityTable<SavingsGoal, 'id'>; settings!: EntityTable<Settings & { id: 'main' }, 'id'>; meta!: EntityTable<AppMeta, 'id'>; exchangeRates!: EntityTable<ExchangeRate, 'type'>
  constructor() {
    super('proyecto-salida')
    this.version(1).stores({ incomes:'id,kind', expenses:'id,kind', debts:'id,type,dueDate,manualOrder', payments:'id,debtId,date', snapshots:'id,date', savingsGoals:'id', settings:'id', meta:'id' })
    this.version(2).stores({ incomes:'id,kind', expenses:'id,kind', debts:'id,type,dueDate,manualOrder,status,currency', payments:'id,debtId,date,currency', snapshots:'id,date', savingsGoals:'id', settings:'id', meta:'id', exchangeRates:'type,updatedAt,fetchedAt' }).upgrade(async tx=>{
      await tx.table('debts').toCollection().modify(debt=>{debt.currency=debt.currency??'ARS';debt.status=debt.balance>0?'active':'paid';if(debt.status==='paid'&&!debt.paidAt)debt.paidAt=new Date().toISOString()})
      await tx.table('payments').toCollection().modify(payment=>{payment.currency=payment.currency??'ARS'})
      await tx.table('settings').toCollection().modify(settings=>Object.assign(settings,{showQuickHelp:settings.showQuickHelp??true,quickHelpMinimized:settings.quickHelpMinimized??false,showReflections:settings.showReflections??true,preferredConversion:settings.preferredConversion??'card'}))
      await tx.table('meta').toCollection().modify(meta=>{meta.schemaVersion=2;meta.updatedAt=new Date().toISOString()})
    })
    this.version(3).stores({ incomes:'id,kind', expenses:'id,kind', debts:'id,type,dueDate,manualOrder,status,currency', payments:'id,debtId,date,currency', snapshots:'id,date', savingsGoals:'id', settings:'id', meta:'id', exchangeRates:'type,updatedAt,fetchedAt' }).upgrade(async tx=>{
      await tx.table('settings').toCollection().modify(settings=>{if(settings.progressCharacter==='capybara')settings.progressCharacter='dot';const position=settings.bubblePosition;if(position&&'x' in position&&'y' in position){delete settings.bubblePosition}})
      await tx.table('meta').toCollection().modify(meta=>{meta.schemaVersion=3;meta.updatedAt=new Date().toISOString()})
    })
  }
}
export const db = new SalidaDB()
export async function ensureDB() { const now = new Date().toISOString(); await db.transaction('rw', db.meta, db.settings, async () => { if (!await db.meta.get('main')) await db.meta.put({ id:'main', schemaVersion:3, createdAt:now, updatedAt:now }); if (!await db.settings.get('main')) await db.settings.put({ id:'main', ...defaultSettings }) }) }
export async function touchDB() { const meta = await db.meta.get('main'); if (meta) await db.meta.put({ ...meta, updatedAt:new Date().toISOString() }) }
