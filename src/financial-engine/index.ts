import type { Debt, Expense, Income, StrategyKind } from '../types/models'

export interface BudgetSummary { income:number; essential:number; adjustable:number; mandatoryDebt:number; afterEssentials:number; availableExtra:number; deficit:number }
export interface ProjectionMonth { month:number; date:string; payments:Record<string,number>; balances:Record<string,number>; interest:number }
export interface Projection { strategy:StrategyKind; months:number|null; totalPaid:number; estimatedInterest:number|null; completionDate:string|null; firstCompletedDebtId?:string; schedule:ProjectionMonth[]; approximate:boolean; stalled:boolean }

const finite = (n:number) => Number.isFinite(n) ? n : 0
export const sumAmounts = (items: Array<{amount:number}>) => finite(items.reduce((sum,item) => sum + finite(Math.max(0,item.amount)), 0))
export const mandatoryPayment = (debt:Debt) => Math.min(Math.max(0,debt.balance), Math.max(0,debt.minimumPayment,debt.agreedPayment ?? 0))
export function calculateBudget(incomes:Income[], expenses:Expense[], debts:Debt[]):BudgetSummary {
  const income=sumAmounts(incomes), essential=sumAmounts(expenses.filter(e=>e.kind==='essential')), adjustable=sumAmounts(expenses.filter(e=>e.kind==='adjustable')), mandatoryDebt=debts.reduce((s,d)=>s+mandatoryPayment(d),0)
  const afterEssentials=income-essential, remainder=afterEssentials-mandatoryDebt
  return { income,essential,adjustable,mandatoryDebt,afterEssentials,availableExtra:Math.max(0,remainder),deficit:Math.max(0,-remainder) }
}
export function orderDebts(debts:Debt[], strategy:StrategyKind):Debt[] {
  const active=debts.filter(d=>d.balance>0)
  return [...active].sort((a,b)=> {
    if(strategy==='avalanche') return (b.annualRate ?? -1)-(a.annualRate ?? -1) || a.balance-b.balance
    if(strategy==='snowball') return a.balance-b.balance
    if(strategy==='personal') return b.personalUrgency-a.personalUrgency || a.balance-b.balance
    return a.manualOrder-b.manualOrder
  })
}
const addMonths=(start:Date,n:number)=>{const d=new Date(start);d.setUTCMonth(d.getUTCMonth()+n);return d.toISOString().slice(0,10)}
export function projectDebts(debts:Debt[], monthlyExtra:number, strategy:StrategyKind, startDate=new Date(), maxMonths=600):Projection {
  const active=debts.filter(d=>d.balance>0).map(d=>({...d}))
  if(!active.length) return {strategy,months:0,totalPaid:0,estimatedInterest:0,completionDate:startDate.toISOString().slice(0,10),schedule:[],approximate:false,stalled:false}
  const unknownRates=active.some(d=>d.annualRate===undefined)
  const balances=new Map(active.map(d=>[d.id,d.balance])); let totalPaid=0,totalInterest=0,firstCompletedDebtId:string|undefined
  const schedule:ProjectionMonth[]=[]
  for(let month=1;month<=maxMonths;month++) {
    let extra=Math.max(0,finite(monthlyExtra)), monthInterest=0; const payments:Record<string,number>={}
    for(const debt of active) { const balance=balances.get(debt.id) ?? 0; if(balance<=0)continue; const interest=balance*Math.max(0,debt.annualRate??0)/100/12; balances.set(debt.id,balance+interest); monthInterest+=interest; totalInterest+=interest }
    for(const debt of active) { const balance=balances.get(debt.id)??0; if(balance<=0)continue; const paid=Math.min(balance,mandatoryPayment({...debt,balance})); balances.set(debt.id,balance-paid);payments[debt.id]=(payments[debt.id]??0)+paid;totalPaid+=paid }
    for(const debt of orderDebts(active.map(d=>({...d,balance:balances.get(d.id)??0})),strategy)) { if(extra<=0)break; const balance=balances.get(debt.id)??0;if(balance<=0)continue;const paid=Math.min(balance,extra);balances.set(debt.id,balance-paid);payments[debt.id]=(payments[debt.id]??0)+paid;totalPaid+=paid;extra-=paid }
    const monthBalances=Object.fromEntries(active.map(d=>[d.id,Math.max(0,balances.get(d.id)??0)]));
    for(const debt of orderDebts(active, strategy)) if(!firstCompletedDebtId && (balances.get(debt.id)??0)<=0) firstCompletedDebtId=debt.id
    schedule.push({month,date:addMonths(startDate,month),payments,balances:monthBalances,interest:monthInterest})
    if([...balances.values()].every(v=>v<=0.005)) return {strategy,months:month,totalPaid,estimatedInterest:unknownRates?null:totalInterest,completionDate:addMonths(startDate,month),firstCompletedDebtId,schedule,approximate:unknownRates,stalled:false}
    if(monthInterest===0 && Object.values(payments).every(v=>v===0)) break
  }
  return {strategy,months:null,totalPaid,estimatedInterest:unknownRates?null:totalInterest,completionDate:null,firstCompletedDebtId,schedule,approximate:unknownRates,stalled:true}
}
export const calculateProgress=(debts:Debt[])=>{const initial=debts.reduce((s,d)=>s+Math.max(d.initialBalance,d.balance),0), remaining=debts.reduce((s,d)=>s+Math.max(0,d.balance),0), paid=Math.max(0,initial-remaining);return{initial,remaining,paid,percent:initial>0?Math.min(100,paid/initial*100):0}}
export function impulseImpact(amount:number,debts:Debt[],extra:number,strategy:StrategyKind){const base=projectDebts(debts,extra,strategy), boosted=projectDebts(debts,extra+Math.max(0,amount),strategy);return{debtPercent:calculateProgress(debts).remaining>0?amount/calculateProgress(debts).remaining*100:0,daysAdvanced:base.months!==null&&boosted.months!==null?Math.max(0,(base.months-boosted.months)*30):null}}
export function reductionImpact(monthlySaving:number,debts:Debt[],extra:number,strategy:StrategyKind){const base=projectDebts(debts,extra,strategy),changed=projectDebts(debts,extra+Math.max(0,monthlySaving),strategy);return{base,changed,daysAdvanced:base.months!==null&&changed.months!==null?Math.max(0,(base.months-changed.months)*30):null}}
