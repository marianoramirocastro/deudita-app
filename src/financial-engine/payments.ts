import type { Debt, DebtPayment } from '../types/models'

export interface AppliedPayment { debt:Debt; paymentAmount:number; completed:boolean }
export function applyDebtPayment(debt:Debt,requestedAmount:number,paidAt:string):AppliedPayment {const safe=Number.isFinite(requestedAmount)?Math.max(0,requestedAmount):0,paymentAmount=Math.min(safe,Math.max(0,debt.balance)),balance=Math.max(0,Math.round((debt.balance-paymentAmount)*100)/100),completed=balance===0;return {paymentAmount,completed,debt:{...debt,balance,status:completed?'paid':'active',paidAt:completed?paidAt:undefined}}}
export const createPaymentRecord=(debt:Debt,amount:number,date:string,id:string,conversionRate?:number):DebtPayment=>({id,debtId:debt.id,amount,date,currency:debt.currency,conversionRate:debt.currency==='USD'?conversionRate:undefined,amountARS:debt.currency==='USD'&&conversionRate?amount*conversionRate:undefined})
