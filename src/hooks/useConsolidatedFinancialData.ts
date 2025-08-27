
import { useOptimizedFinancialData } from './useOptimizedFinancialData'

export interface ConsolidatedFinancialData {
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  savingsCapacity: number
  hasRealData: boolean
  expenseCategories: Record<string, number>
  debts: Array<{ creditor: string; balance: number; payment: number }>
  financialGoals: string[]
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
}

export const useConsolidatedFinancialData = () => {
  const { data: optimizedData, isLoading, error } = useOptimizedFinancialData()

  const consolidatedData: ConsolidatedFinancialData | null = optimizedData ? {
    monthlyIncome: optimizedData.monthlyIncome,
    monthlyExpenses: optimizedData.monthlyExpenses,
    currentSavings: optimizedData.currentSavings,
    savingsCapacity: optimizedData.savingsCapacity,
    hasRealData: optimizedData.hasRealData,
    expenseCategories: optimizedData.expenseCategories,
    debts: optimizedData.activeDebts,
    financialGoals: optimizedData.activeGoals.map(goal => goal.title),
    totalDebtBalance: optimizedData.totalDebtBalance,
    totalMonthlyDebtPayments: optimizedData.totalMonthlyDebtPayments
  } : null

  return {
    consolidatedData,
    isLoading,
    error
  }
}
