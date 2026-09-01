import { describe, expect, it } from 'vitest'
import { calculateBudget, calculateProgress, mandatoryPayment, orderDebts, projectDebts, reductionImpact } from '.'
import type { Debt } from '../types/models'

const debt=(overrides:Partial<Debt>={}):Debt=>({id:'a',name:'Visa',type:'credit_card',balance:100000,initialBalance:100000,minimumPayment:10000,personalUrgency:3,priorityReasons:[],manualOrder:0,createdAt:'2026-01-01',...overrides})
describe('financial engine',()=>{
  it('reserva esenciales y obligaciones antes del extra',()=>{expect(calculateBudget([{id:'i',label:'Sueldo',amount:800000,kind:'salary'}],[{id:'e',label:'Casa',amount:480000,kind:'essential'}],[debt({minimumPayment:190000,balance:500000})])).toMatchObject({availableExtra:130000,deficit:0})})
  it('detecta déficit sin sugerir extra',()=>{expect(calculateBudget([{id:'i',label:'Sueldo',amount:100,kind:'salary'}],[{id:'e',label:'Casa',amount:80,kind:'essential'}],[debt({balance:50,minimumPayment:30})])).toMatchObject({availableExtra:0,deficit:10})})
  it('limita el mínimo al saldo y contempla cuota pactada',()=>{expect(mandatoryPayment(debt({balance:5000,minimumPayment:10000}))).toBe(5000);expect(mandatoryPayment(debt({minimumPayment:1000,agreedPayment:3000}))).toBe(3000)})
  it('ordena avalancha, nieve, personal y manual',()=>{const ds=[debt({id:'a',balance:50,annualRate:10,personalUrgency:5,manualOrder:2}),debt({id:'b',balance:20,annualRate:80,personalUrgency:1,manualOrder:1})];expect(orderDebts(ds,'avalanche')[0].id).toBe('b');expect(orderDebts(ds,'snowball')[0].id).toBe('b');expect(orderDebts(ds,'personal')[0].id).toBe('a');expect(orderDebts(ds,'manual')[0].id).toBe('b')})
  it('proyecta interés cero y deuda ya pagada',()=>{expect(projectDebts([debt({balance:100,initialBalance:100,minimumPayment:0,annualRate:0})],100,'snowball').months).toBe(1);expect(projectDebts([debt({balance:0})],100,'snowball').months).toBe(0)})
  it('marca como aproximado si falta tasa y no inventa intereses',()=>{const result=projectDebts([debt()],10000,'snowball');expect(result.approximate).toBe(true);expect(result.estimatedInterest).toBeNull()})
  it('no produce NaN con números grandes',()=>{const result=projectDebts([debt({balance:1e12,initialBalance:1e12,minimumPayment:1e11,annualRate:20})],1e11,'avalanche');expect(Number.isFinite(result.totalPaid)).toBe(true)})
  it('calcula progreso y evita negativos',()=>{expect(calculateProgress([debt({initialBalance:100,balance:60})])).toEqual({initial:100,remaining:60,paid:40,percent:40})})
  it('un recorte nunca alarga el plan',()=>{const result=reductionImpact(10000,[debt({annualRate:0})],10000,'snowball');expect(result.changed.months!).toBeLessThanOrEqual(result.base.months!)})
})
