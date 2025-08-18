
/**
 * @deprecated Use domain types from src/domains instead
 * This file is kept for backward compatibility during migration
 */

// Re-export from new domain structure for compatibility
export type { ConsolidatedFinancialData as FinancialData } from './domains/financial/consolidated'

// Legacy compatibility type
export interface ConsolidatedProfile {
  userId: string
  name: string
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  currentSavings: number
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  savingsCapacity: number
  financialGoals: string[]
  debts: Array<{
    id: string
    creditor: string
    current_balance: number
    monthly_payment: number
    annual_interest_rate: number
  }>
  dataCompleteness: number
}
