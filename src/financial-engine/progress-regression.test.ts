import { describe,expect,it } from 'vitest'
import type { Debt,DebtPayment,ExperienceMode,Settings } from '../types/models'
import { defaultSettings } from '../storage/db'
import { changeExperienceMode } from '../services/experience-mode'
import { applyDebtPayment,createPaymentRecord } from './payments'
import { calculateCurrencyProgress } from './currency-progress'

const make=(id:string,amount:number):Debt=>({id,name:id,type:'other',balance:amount,initialBalance:amount,minimumPayment:0,personalUrgency:3,priorityReasons:[],manualOrder:0,createdAt:'2026-01-01',currency:'ARS',status:'active'})
describe('regresión real del progreso por moneda',()=>{
 it('actualiza A, B, C, vuelve a A, cierra B y termina exactamente en 100%',()=>{const debts=[make('A',500),make('B',300),make('C',200)],payments:DebtPayment[]=[];let settings:Settings={...defaultSettings,experienceMode:'simple'};const pay=(id:string,amount:number,mode:ExperienceMode,expected:number)=>{settings=changeExperienceMode(settings,mode);const index=debts.findIndex(debt=>debt.id===id),before=debts[index],result=applyDebtPayment(before,amount,'2026-09-01');debts[index]=result.debt;payments.push(createPaymentRecord(before,result.paymentAmount,'2026-09-01',`${id}-${payments.length}`));expect(calculateCurrencyProgress(debts,'ARS').progressPercent).toBeCloseTo(expected,10)};pay('A',100,'full',10);pay('B',150,'simple',25);pay('C',50,'full',30);pay('A',100,'simple',40);pay('B',150,'full',55);pay('A',300,'simple',85);pay('C',150,'full',100);expect(calculateCurrencyProgress(debts,'ARS').progressRatio).toBe(1)})
 it('mantiene centavos USD exactos visibles',()=>{const result=applyDebtPayment({...make('USD',49.99),currency:'USD'},9.99,'2026-09-01');expect(result.debt.balance).toBe(40);expect(calculateCurrencyProgress([result.debt],'USD').progressPercent).toBeCloseTo(19.984,3)})
})
