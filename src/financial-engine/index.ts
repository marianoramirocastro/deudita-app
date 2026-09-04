import type { Debt,StrategyKind } from '../types/models'
export { calculateCurrencyProgress,calculateProgressByCurrency } from './currency-progress'
export type { CurrencyProgress,ProgressByCurrency } from './currency-progress'
export { calculateBudget,sumAmounts } from './affordability'
export type { BudgetSummary } from './affordability'
export { allowsExtraPayment,debtBehavior,installmentWarning,mandatoryPayment,monthlyObligation } from './installments'
export { orderDebts,projectDebts } from './debt-simulation'
export type { Projection,ProjectionMonth,ProjectionOptions,ProjectionStatus } from './debt-simulation'
import { projectDebts } from './debt-simulation'

export const formatProgressPercent=(percent:number)=>{if(percent===100)return'100%';if(percent<=0)return'0%';const digits=percent<1?1:(Math.abs(percent-Math.round(percent))>=.05?1:0);return`${percent.toLocaleString('es-AR',{minimumFractionDigits:digits,maximumFractionDigits:1})}%`}
export function impulseImpact(amount:number,debts:Debt[],extra:number,strategy:StrategyKind,mandatoryAffordable=true){const options={mandatoryAffordable},base=projectDebts(debts,extra,strategy,new Date(),1200,options),boosted=projectDebts(debts,extra+Math.max(0,amount),strategy,new Date(),1200,options),remaining=debts.filter(debt=>debt.status==='active'&&debt.currency==='ARS').reduce((sum,debt)=>sum+debt.balance,0);return{debtPercent:remaining>0?amount/remaining*100:0,daysAdvanced:base.months!==undefined&&boosted.months!==undefined?Math.max(0,(base.months-boosted.months)*30):null}}
export function reductionImpact(monthlySaving:number,debts:Debt[],extra:number,strategy:StrategyKind,mandatoryAffordable=true){const options={mandatoryAffordable},base=projectDebts(debts,extra,strategy,new Date(),1200,options),changed=projectDebts(debts,extra+Math.max(0,monthlySaving),strategy,new Date(),1200,options);return{base,changed,daysAdvanced:base.months!==undefined&&changed.months!==undefined?Math.max(0,(base.months-changed.months)*30):null}}
