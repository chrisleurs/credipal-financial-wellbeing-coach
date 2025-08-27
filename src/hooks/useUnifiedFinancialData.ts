
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { useAuth } from './useAuth'

export interface UnifiedFinancialData {
  userId: string
  hasFinancialData: boolean
  totalMonthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  monthlySavingsCapacity: number
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  debts: Array<{ creditor: string; balance: number; payment: number }>
  financialGoals: string[]
  kueskiLoan?: {
    id: string
    lender: string
    amount: number
    paymentAmount: number
    totalPayments: number
    remainingPayments: number
    nextPaymentDate: string
    status: string
  }
}

export const useUnifiedFinancialData = () => {
  const { user } = useAuth()
  const { data: optimizedData, isLoading, error } = useOptimizedFinancialData()

  const data: UnifiedFinancialData | null = optimizedData && user ? {
    userId: user.id,
    hasFinancialData: optimizedData.hasRealData,
    totalMonthlyIncome: optimizedData.monthlyIncome,
    monthlyExpenses: optimizedData.monthlyExpenses,
    currentSavings: optimizedData.currentSavings,
    monthlySavingsCapacity: optimizedData.savingsCapacity,
    totalDebtBalance: optimizedData.totalDebtBalance,
    totalMonthlyDebtPayments: optimizedData.totalMonthlyDebtPayments,
    debts: optimizedData.activeDebts,
    financialGoals: optimizedData.activeGoals.map(goal => goal.title)
  } : null

  return {
    data,
    isLoading,
    error
  }
}
