import type { Debt,Expense,Income } from '../types/models'
import { mandatoryPayment } from './installments'

export interface BudgetSummary { income:number; essential:number; adjustable:number; mandatoryDebt:number; afterEssentials:number; availableExtra:number; deficit:number; monthlyDeficit:number }
const finite=(value:number)=>Number.isFinite(value)?Math.max(0,value):0
export const sumAmounts=(items:Array<{amount:number}>)=>items.reduce((sum,item)=>sum+finite(item.amount),0)
const arsFactor=(debt:Debt)=>debt.currency==='USD'?(debt.conversionRate??0):1
export function calculateBudget(incomes:Income[],expenses:Expense[],debts:Debt[]):BudgetSummary{const income=sumAmounts(incomes),essential=sumAmounts(expenses.filter(item=>item.kind==='essential')),adjustable=sumAmounts(expenses.filter(item=>item.kind==='adjustable')),mandatoryDebt=debts.reduce((sum,debt)=>sum+mandatoryPayment(debt)*arsFactor(debt),0),afterEssentials=income-essential,calculatedExtra=afterEssentials-mandatoryDebt,monthlyDeficit=Math.max(0,-calculatedExtra);return{income,essential,adjustable,mandatoryDebt,afterEssentials,availableExtra:Math.max(0,calculatedExtra),deficit:monthlyDeficit,monthlyDeficit}}
