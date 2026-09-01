import { useLiveQuery } from 'dexie-react-hooks'
import { calculateBudget, calculateProgress, projectDebts } from '../financial-engine'
import { db, defaultSettings } from '../storage/db'

export function useFinance() {
  const incomes=useLiveQuery(()=>db.incomes.toArray(),[])??[], expenses=useLiveQuery(()=>db.expenses.toArray(),[])??[], debts=useLiveQuery(()=>db.debts.toArray(),[])??[], payments=useLiveQuery(()=>db.payments.toArray(),[])??[], snapshots=useLiveQuery(()=>db.snapshots.orderBy('date').toArray(),[])??[], goals=useLiveQuery(()=>db.savingsGoals.toArray(),[])??[], settingsRow=useLiveQuery(()=>db.settings.get('main'),[])
  const settings=settingsRow??defaultSettings, budget=calculateBudget(incomes,expenses,debts), progress=calculateProgress(debts), projection=projectDebts(debts,budget.availableExtra,settings.strategy)
  return {incomes,expenses,debts,payments,snapshots,goals,settings,budget,progress,projection,loading:settingsRow===undefined}
}
