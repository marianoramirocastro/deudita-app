import { describe,expect,it } from 'vitest'
import { parseBackup } from './backup'
import { db } from './db'

const valid={schemaVersion:1,exportedAt:'2026-09-01T12:00:00.000Z',incomes:[{id:'i',label:'Sueldo',amount:100,kind:'salary'}],expenses:[],debts:[{id:'d',name:'Anterior',type:'other',balance:50,initialBalance:100,minimumPayment:0,personalUrgency:3,priorityReasons:[],manualOrder:0,createdAt:'2026-01-01'}],payments:[{id:'p',debtId:'d',amount:50,date:'2026-02-01'}],snapshots:[],savingsGoals:[],settings:{strategy:'snowball',progressCharacter:'car',hideEncouragement:false,reduceMotion:false,comfortable:true,onboardingComplete:true}}

describe('backups y migraciones',()=>{
 it('migra un backup v1 a schema 3 y ARS',()=>{const parsed=parseBackup(JSON.stringify(valid));expect(parsed.schemaVersion).toBe(3);expect(parsed.debts[0]).toMatchObject({currency:'ARS',status:'active'});expect(parsed.payments[0].currency).toBe('ARS')})
 it('mantiene importación de v2',()=>{const parsed=parseBackup(JSON.stringify({...valid,schemaVersion:2,debts:[{...valid.debts[0],currency:'USD',status:'active'}],exchangeRates:[]}));expect(parsed.debts[0].currency).toBe('USD')})
 it('conserva campos progresivos de v3',()=>{const parsed=parseBackup(JSON.stringify({...valid,schemaVersion:3,debts:[{...valid.debts[0],dueWindow:'mid',installmentAmount:80,remainingInstallments:12,canPrepay:'unknown'}],exchangeRates:[]}));expect(parsed.debts[0]).toMatchObject({dueWindow:'mid',installmentAmount:80,remainingInstallments:12,canPrepay:'unknown'})})
 it('deudas antiguas sin vencimiento aproximado siguen siendo válidas',()=>expect(parseBackup(JSON.stringify(valid)).debts[0].dueWindow).toBeUndefined())
 it('registra la migración local v4 sin cambiar el nombre histórico',()=>{expect(db.name).toBe('proyecto-salida');expect(db.verno).toBe(4)})
 it('migra Carpincho a Punto simple',()=>{const parsed=parseBackup(JSON.stringify({...valid,settings:{...valid.settings,progressCharacter:'capybara'}}));expect(parsed.settings.progressCharacter).toBe('dot')})
 it('rechaza montos negativos sin tocar la base',()=>expect(()=>parseBackup(JSON.stringify({...valid,incomes:[{...valid.incomes[0],amount:-1}]}))).toThrow())
 it('rechaza versiones desconocidas',()=>expect(()=>parseBackup(JSON.stringify({...valid,schemaVersion:99}))).toThrow())
})
