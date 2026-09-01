import Dexie, { type EntityTable } from 'dexie'
import type { AppMeta, Debt, DebtPayment, Expense, Income, MonthlySnapshot, SavingsGoal, Settings } from '../types/models'

export const defaultSettings: Settings = { strategy: 'snowball', progressCharacter: 'car', hideEncouragement: false, reduceMotion: false, comfortable: true, onboardingComplete: false }

class SalidaDB extends Dexie {
  incomes!: EntityTable<Income, 'id'>; expenses!: EntityTable<Expense, 'id'>; debts!: EntityTable<Debt, 'id'>; payments!: EntityTable<DebtPayment, 'id'>;
  snapshots!: EntityTable<MonthlySnapshot, 'id'>; savingsGoals!: EntityTable<SavingsGoal, 'id'>; settings!: EntityTable<Settings & { id: 'main' }, 'id'>; meta!: EntityTable<AppMeta, 'id'>
  constructor() {
    super('proyecto-salida')
    this.version(1).stores({ incomes:'id,kind', expenses:'id,kind', debts:'id,type,dueDate,manualOrder', payments:'id,debtId,date', snapshots:'id,date', savingsGoals:'id', settings:'id', meta:'id' })
  }
}
export const db = new SalidaDB()
export async function ensureDB() { const now = new Date().toISOString(); await db.transaction('rw', db.meta, db.settings, async () => { if (!await db.meta.get('main')) await db.meta.put({ id:'main', schemaVersion:1, createdAt:now, updatedAt:now }); if (!await db.settings.get('main')) await db.settings.put({ id:'main', ...defaultSettings }) }) }
export async function touchDB() { const meta = await db.meta.get('main'); if (meta) await db.meta.put({ ...meta, updatedAt:new Date().toISOString() }) }
