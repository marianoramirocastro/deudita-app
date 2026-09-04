import { describe,expect,it } from 'vitest'
import type { Debt } from '../types/models'
import { applyDebtPayment } from './payments'
import { calculatePortfolioProgress } from './portfolio-progress'
import { projectDebts } from './debt-simulation'

const make=(id:string,balance:number,initialBalance=balance):Debt=>({id,name:id,type:'other',balance,initialBalance,minimumPayment:0,personalUrgency:3,priorityReasons:[],manualOrder:0,createdAt:'2026-01-01',currency:'ARS',status:'active',annualRate:0})
const random=(()=>{let seed=74291;return()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296)})()
describe('invariantes reproducibles',()=>{
  it('pagos positivos nunca aumentan saldo ni lo vuelven negativo',()=>{for(let index=0;index<200;index++){const balance=1+random()*100_000_000,payment=random()*200_000_000,next=applyDebtPayment(make(String(index),balance),payment,'2026-09-01').debt;expect(next.balance).toBeGreaterThanOrEqual(0);expect(next.balance).toBeLessThanOrEqual(balance)}})
  it('pagar capital no reduce el progreso y siempre queda entre 0 y 1',()=>{const debts=Array.from({length:10},(_,index)=>make(String(index),1+random()*100_000_000));let previous=0;for(const current of debts){const result=applyDebtPayment(current,current.balance*random(),'2026-09-01');Object.assign(current,result.debt);const progress=calculatePortfolioProgress(debts);expect(progress.progressRatio).toBeGreaterThanOrEqual(previous);expect(progress.progressRatio).toBeGreaterThanOrEqual(0);expect(progress.progressRatio).toBeLessThanOrEqual(1);previous=progress.progressRatio}})
  it('deuda positiva sin pago no tiene payoff finito',()=>expect(projectDebts([make('a',100)],0,'snowball').status).toBe('no_capacity'))
  it('sin interés los meses nunca son menores que deuda sobre pago',()=>{for(let index=0;index<30;index++){const balance=1+Math.floor(random()*1_000_000),payment=1+Math.floor(random()*100_000),value=projectDebts([make('a',balance)],payment,'snowball');expect(value.months).toBeGreaterThanOrEqual(Math.ceil(balance/payment))}})
})
