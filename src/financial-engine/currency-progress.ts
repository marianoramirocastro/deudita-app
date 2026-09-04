import type { Currency,Debt } from '../types/models'

export interface CurrencyProgress{
  currency:Currency
  initialTotal:number
  currentOutstanding:number
  amountPaid:number
  progressRatio:number
  progressPercent:number
  activeDebtCount:number
}
export type ProgressByCurrency=Partial<Record<Currency,CurrencyProgress>>
const positive=(value:number)=>Number.isFinite(value)?Math.max(0,value):0

export function calculateCurrencyProgress(debts:Debt[],currency:Currency):CurrencyProgress{
  const relevant=debts.filter(debt=>debt.currency===currency&&positive(debt.initialBalance)>0)
  const initialTotal=relevant.reduce((sum,debt)=>sum+positive(debt.initialBalance),0)
  const currentOutstanding=relevant.reduce((sum,debt)=>sum+positive(debt.balance),0)
  const amountPaid=Math.max(0,initialTotal-currentOutstanding)
  const progressRatio=initialTotal===0?0:currentOutstanding===0?1:Math.min(1,amountPaid/initialTotal)
  return{currency,initialTotal,currentOutstanding,amountPaid,progressRatio,progressPercent:progressRatio*100,activeDebtCount:relevant.filter(debt=>debt.status==='active'&&positive(debt.balance)>0).length}
}

export function calculateProgressByCurrency(debts:Debt[]):ProgressByCurrency{
  const result:ProgressByCurrency={}
  for(const currency of ['ARS','USD'] as const)if(debts.some(debt=>debt.currency===currency&&positive(debt.initialBalance)>0))result[currency]=calculateCurrencyProgress(debts,currency)
  return result
}
