export type ID = string
export type ExpenseKind = 'essential' | 'adjustable'
export type DebtType = 'credit_card' | 'personal_loan' | 'bank_loan' | 'fintech_loan' | 'mortgage' | 'services' | 'taxes' | 'rent' | 'family' | 'friend' | 'other'
export type StrategyKind = 'avalanche' | 'snowball' | 'personal' | 'manual'
export type Currency = 'ARS' | 'USD'
export type DebtStatus = 'active' | 'paid'
export type ExperienceMode = 'simple' | 'full'
export type ExchangeRateType = 'blue' | 'card'
export type ConversionPreference = ExchangeRateType | 'manual'
export type DueWindow = 'early' | 'mid' | 'late'
export type PrepaymentAbility = 'yes' | 'no' | 'unknown'

export interface Income { id: ID; label: string; amount: number; kind: 'salary' | 'variable' | 'other' }
export interface Expense { id: ID; label: string; amount: number; kind: ExpenseKind }
export interface Debt {
  id: ID; name: string; type: DebtType; balance: number; initialBalance: number; minimumPayment: number; agreedPayment?: number;
  annualRate?: number; cft?: number; dueDate?: string; dueWindow?: DueWindow; installmentAmount?: number; remainingInstallments?: number; canPrepay?: PrepaymentAbility; creditor?: string; notes?: string;
  personalUrgency: 1 | 2 | 3 | 4 | 5; priorityReasons: string[]; manualOrder: number; createdAt: string;
  currency: Currency; status: DebtStatus; paidAt?: string; usdPaymentMethod?: 'usd' | 'ars' | 'unknown';
  conversionRate?: number; conversionSource?: ConversionPreference; conversionDate?: string; initialConvertedBalanceARS?: number
}
export interface DebtPayment { id: ID; debtId: ID; amount: number; date: string; note?: string; currency: Currency; conversionRate?: number; amountARS?: number }
export interface MonthlySnapshot { id: ID; date: string; incomeTotal: number; essentialTotal: number; adjustableTotal: number; debtTotal: number }
export interface SavingsGoal { id: ID; expenseLabel: string; currentAmount: number; targetAmount: number; createdAt: string }
export type ProgressCharacter = 'runner' | 'woman' | 'walker' | 'car' | 'bike' | 'rocket' | 'mate' | 'dot'
export interface BubblePosition { xRatio: number; yRatio: number }
export interface Settings { strategy: StrategyKind; progressCharacter: ProgressCharacter; hideEncouragement: boolean; reduceMotion: boolean; comfortable: boolean; onboardingComplete: boolean; lastMonthlyReview?: string; experienceMode?: ExperienceMode; showQuickHelp: boolean; quickHelpMinimized: boolean; bubblePosition?: BubblePosition; showReflections: boolean; lastQuoteDate?: string; preferredConversion: ConversionPreference; manualExchangeRate?: number; manualExchangeReason?: string }
export interface AppMeta { id: 'main'; schemaVersion: number; createdAt: string; updatedAt: string }
export interface ExchangeRate { type: ExchangeRateType; buy: number; sell: number; updatedAt: string; fetchedAt: string; provider: 'DolarAPI'; source: 'DolarHoy' | 'Ámbito Financiero' }
export interface BackupData { schemaVersion: 3; exportedAt: string; incomes: Income[]; expenses: Expense[]; debts: Debt[]; payments: DebtPayment[]; snapshots: MonthlySnapshot[]; savingsGoals: SavingsGoal[]; settings: Settings; exchangeRates: ExchangeRate[] }
