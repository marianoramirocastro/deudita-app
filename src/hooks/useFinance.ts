import { useLiveQuery } from 'dexie-react-hooks'
import { calculateBudget,calculateProgressByCurrency,projectDebts } from '../financial-engine'
import { db, defaultSettings } from '../storage/db'

export function useFinance() {
  const incomes=useLiveQuery(()=>db.incomes.toArray(),[])??[], expenses=useLiveQuery(()=>db.expenses.toArray(),[])??[], debts=useLiveQuery(()=>db.debts.toArray(),[])??[], payments=useLiveQuery(()=>db.payments.toArray(),[])??[], snapshots=useLiveQuery(()=>db.snapshots.orderBy('date').toArray(),[])??[], goals=useLiveQuery(()=>db.savingsGoals.toArray(),[])??[], settingsRow=useLiveQuery(()=>db.settings.get('main'),[])
  const settings=settingsRow??defaultSettings,budget=calculateBudget(incomes,expenses,debts),progressByCurrency=calculateProgressByCurrency(debts),projection=projectDebts(debts,budget.availableExtra,settings.strategy,new Date(),1200,{mandatoryAffordable:budget.deficit===0})
  return {incomes,expenses,debts,payments,snapshots,goals,settings,budget,progressByCurrency,projection,loading:settingsRow===undefined}
}
