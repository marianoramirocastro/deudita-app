export type ID = string
export type ExpenseKind = 'essential' | 'adjustable'
export type DebtType = 'credit_card' | 'personal_loan' | 'bank_loan' | 'fintech_loan' | 'mortgage' | 'services' | 'taxes' | 'rent' | 'family' | 'friend' | 'other'
export type StrategyKind = 'avalanche' | 'snowball' | 'personal' | 'manual'

export interface Income { id: ID; label: string; amount: number; kind: 'salary' | 'variable' | 'other' }
export interface Expense { id: ID; label: string; amount: number; kind: ExpenseKind }
export interface Debt {
  id: ID; name: string; type: DebtType; balance: number; initialBalance: number; minimumPayment: number; agreedPayment?: number;
  annualRate?: number; cft?: number; dueDate?: string; remainingInstallments?: number; creditor?: string; notes?: string;
  personalUrgency: 1 | 2 | 3 | 4 | 5; priorityReasons: string[]; manualOrder: number; createdAt: string
}
export interface DebtPayment { id: ID; debtId: ID; amount: number; date: string; note?: string }
export interface MonthlySnapshot { id: ID; date: string; incomeTotal: number; essentialTotal: number; adjustableTotal: number; debtTotal: number }
export interface SavingsGoal { id: ID; expenseLabel: string; currentAmount: number; targetAmount: number; createdAt: string }
export type ProgressCharacter = 'runner' | 'woman' | 'walker' | 'car' | 'bike' | 'rocket' | 'capybara' | 'mate' | 'dot'
export interface Settings { strategy: StrategyKind; progressCharacter: ProgressCharacter; hideEncouragement: boolean; reduceMotion: boolean; comfortable: boolean; onboardingComplete: boolean; lastMonthlyReview?: string }
export interface AppMeta { id: 'main'; schemaVersion: number; createdAt: string; updatedAt: string }
export interface BackupData { schemaVersion: number; exportedAt: string; incomes: Income[]; expenses: Expense[]; debts: Debt[]; payments: DebtPayment[]; snapshots: MonthlySnapshot[]; savingsGoals: SavingsGoal[]; settings: Settings }
