import type { Currency,Debt,DebtPayment } from '../types/models'

export type PortfolioProgressMethod='native'|'locked_ars'|'equal_debt_average'
export interface PortfolioProgress {
  initialTotal:number
  totalPaidPrincipal:number
  currentOutstanding:number
  progressRatio:number
  progressPercent:number
  method:PortfolioProgressMethod
  currency?:Currency
  /** Alias de compatibilidad de UI; apunta al mismo cálculo canónico. */
  initial:number
  remaining:number
  paid:number
  percent:number
}

const positive=(value:number)=>Number.isFinite(value)?Math.max(0,value):0
const finish=(initialTotal:number,currentOutstanding:number,method:PortfolioProgressMethod,currency?:Currency):PortfolioProgress=>{const initial=positive(initialTotal),outstanding=positive(currentOutstanding),paid=Math.max(0,initial-outstanding),ratio=initial===0?0:outstanding===0?1:Math.min(.99999,paid/initial),percent=ratio*100;return{initialTotal:initial,totalPaidPrincipal:paid,currentOutstanding:outstanding,progressRatio:ratio,progressPercent:percent,method,currency,initial,remaining:outstanding,paid,percent}}

/** Fuente única del progreso de todas las deudas que pertenecen a la cartera. */
export function calculatePortfolioProgress(debts:Debt[],payments:DebtPayment[]=[]):PortfolioProgress {
  // El saldo es la fuente contable. El historial se recibe para mantener una sola
  // interfaz de dominio, pero no se suma: puede estar incompleto o incluir sobrepagos.
  void payments
  const valid=debts.filter(debt=>positive(debt.initialBalance)>0)
  if(!valid.length)return finish(0,0,'native')
  const currencies=new Set(valid.map(debt=>debt.currency))
  if(currencies.size===1){const currency=valid[0].currency,initialTotal=valid.reduce((sum,debt)=>sum+positive(debt.initialBalance),0),currentOutstanding=valid.reduce((sum,debt)=>sum+positive(debt.balance),0);return finish(initialTotal,currentOutstanding,'native',currency)}
  const lockedWeights=valid.map(debt=>debt.currency==='ARS'?positive(debt.initialBalance):positive(debt.initialConvertedBalanceARS??(debt.conversionRate?debt.initialBalance*debt.conversionRate:0)))
  if(lockedWeights.every(weight=>weight>0)){const initialTotal=lockedWeights.reduce((sum,weight)=>sum+weight,0),currentOutstanding=valid.reduce((sum,debt,index)=>sum+lockedWeights[index]*(positive(debt.balance)/positive(debt.initialBalance)),0);return finish(initialTotal,currentOutstanding,'locked_ars','ARS')}
  const initialTotal=valid.length,currentOutstanding=valid.reduce((sum,debt)=>sum+positive(debt.balance)/positive(debt.initialBalance),0)
  return finish(initialTotal,currentOutstanding,'equal_debt_average')
}
