import { describe,expect,it } from 'vitest'
import type { Debt } from '../types/models'
import { calculateBudget,projectDebts } from '.'

const debt=(changes:Partial<Debt>={}):Debt=>({id:'d',name:'Deuda',type:'other',balance:200_000,initialBalance:200_000,minimumPayment:0,personalUrgency:3,priorityReasons:[],manualOrder:0,createdAt:'2026-01-01',currency:'ARS',status:'active',annualRate:0,...changes})
const project=(debts:Debt[],extra:number,options:Parameters<typeof projectDebts>[5]={})=>projectDebts(debts,extra,'snowball',new Date('2026-09-01T12:00:00Z'),1200,options)

describe('escenarios financieros de principio a fin',()=>{
  it('cancela 200.000 con 300.000 disponibles en un mes',()=>expect(project([debt()],300_000)).toMatchObject({status:'projected',months:1,remainingBalance:0}))
  it('no convierte una deuda de 1.000.000 con 200.000 mensuales en un mes',()=>expect(project([debt({balance:1_000_000,initialBalance:1_000_000})],200_000)).toMatchObject({status:'projected',months:5}))
  it('representa un millón de meses sin construir una fecha inválida',()=>{const value=project([debt({balance:100_000_000,initialBalance:100_000_000})],100);expect(value.status).toBe('extreme_duration');expect(value.months).toBeGreaterThanOrEqual(999_999);expect(value.payoffDate).toBeUndefined();expect(Number.isFinite(value.remainingBalance)).toBe(true)})
  it('un déficit no financia mínimos ficticios',()=>{const debts=[debt({balance:1_000_000,initialBalance:1_000_000,minimumPayment:100_000})],budget=calculateBudget([{id:'i',label:'Ingreso',amount:500_000,kind:'salary'}],[{id:'e',label:'Esenciales',amount:450_000,kind:'essential'}],debts),value=project(debts,budget.availableExtra,{mandatoryAffordable:budget.deficit===0});expect(budget).toMatchObject({availableExtra:0,deficit:50_000});expect(value.status).toBe('no_capacity');expect(value.months).toBeUndefined()})
  it('capacidad extra cero no divide por cero y permite cronograma contractual',()=>expect(project([debt({balance:500_000,initialBalance:500_000,minimumPayment:100_000})],0)).toMatchObject({status:'projected',months:5}))
  it('redistribuye el excedente cuando termina una deuda',()=>{const value=project([debt({id:'visa',balance:1_000_000,initialBalance:1_000_000,minimumPayment:50_000}),debt({id:'master',balance:300_000,initialBalance:300_000,minimumPayment:20_000,manualOrder:1}),debt({id:'amigo',type:'friend',balance:200_000,initialBalance:200_000,manualOrder:2})],180_000);expect(value.status).toBe('projected');expect(value.months).toBeGreaterThan(1);expect(value.schedule.at(-1)?.balances).toMatchObject({visa:0,master:0,amigo:0})})
  it('transfiere el mínimo liberado a la deuda siguiente',()=>expect(project([debt({id:'chica',balance:100,initialBalance:100,minimumPayment:50}),debt({id:'grande',balance:1_000,initialBalance:1_000,minimumPayment:50})],0).months).toBe(11))
  it('bola de nieve cierra primero el saldo menor',()=>expect(project([debt({id:'grande',balance:500,initialBalance:500}),debt({id:'chica',balance:100,initialBalance:100})],100).firstCompletedDebtId).toBe('chica'))
  it('avalancha prioriza la tasa conocida más alta',()=>{const value=projectDebts([debt({id:'barata',balance:100,initialBalance:100,annualRate:10}),debt({id:'cara',balance:500,initialBalance:500,annualRate:80})],100,'avalanche',new Date('2026-09-01T12:00:00Z'));expect(value.firstCompletedDebtId).toBe('cara')})
  it('no inventa tasas faltantes',()=>expect(project([debt({annualRate:undefined})],100_000)).toMatchObject({status:'projected',approximate:true,estimatedInterest:null}))
  it('respeta doce cuotas y no asume cancelación anticipada',()=>expect(project([debt({type:'personal_loan',balance:960_000,initialBalance:960_000,installmentAmount:80_000,remainingInstallments:12,canPrepay:'no'})],500_000)).toMatchObject({status:'projected',months:12}))
  it('detecta tasa que impide amortizar capital',()=>expect(project([debt({balance:100_000,initialBalance:100_000,minimumPayment:100,annualRate:120})],0).status).toBe('indeterminate'))
  it.each([999_999_999,10_000_000_000])('mantiene finitos valores grandes: %s',balance=>{const value=project([debt({balance,initialBalance:balance})],10_000_000);expect(Number.isFinite(value.remainingBalance)).toBe(true);expect(value.months).not.toBeNaN()})
})
