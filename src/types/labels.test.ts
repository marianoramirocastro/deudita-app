import { describe,expect,it } from 'vitest'
import type { Debt } from './models'
import { debtDueLabel,dueWindowLabels,paymentLabel } from './labels'
import { formatProjectionDuration } from '../utils/format'
const debt={id:'d',name:'d',type:'credit_card',balance:1,initialBalance:1,minimumPayment:0,personalUrgency:3,priorityReasons:[],manualOrder:0,createdAt:'x',currency:'ARS',status:'active'} as Debt
describe('lenguaje financiero',()=>{
 it('diferencia mínimos y cuotas',()=>{expect(paymentLabel('credit_card')).toBe('Pago mínimo');expect(paymentLabel('personal_loan')).toBe('Cuota mensual');expect(paymentLabel('friend')).toBe('Pago mensual acordado')})
 it('muestra ventanas sin inventar fechas',()=>{expect(dueWindowLabels).toEqual({early:'Principio de mes',mid:'Mitad de mes',late:'Fin de mes'});expect(debtDueLabel({...debt,dueWindow:'mid'})).toBe('Mitad de mes')})
 it('humaniza plazos extremos y estados sin capacidad',()=>{expect(formatProjectionDuration('extreme_duration',1_000_000)).toContain('años');expect(formatProjectionDuration('extreme_duration')).toBe('Sin fecha práctica');expect(formatProjectionDuration('no_capacity')).toBe('Sin capacidad suficiente')})
})
