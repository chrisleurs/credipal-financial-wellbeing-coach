
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useIncomes } from '@/domains/income/hooks/useIncomes'
import { useExpenses } from '@/domains/expenses/hooks/useExpenses'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { useGoals } from '@/domains/savings/hooks/useGoals'

export interface ConsolidatedFinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  currentSavings: number
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  savingsCapacity: number
  hasRealData: boolean
}

export const useConsolidatedFinancialData = () => {
  const { user } = useAuth()
  const { incomes, totalMonthlyIncome } = useIncomes()
  const { expenses, totalExpenses } = useExpenses()
  const { debts, totalDebt, totalMonthlyPayments } = useDebts()
  const { goals } = useGoals()

  const consolidatedData = useQuery({
    queryKey: ['consolidated-financial-data', user?.id],
    queryFn: async (): Promise<ConsolidatedFinancialData> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Calculate monthly balance
      const monthlyBalance = totalMonthlyIncome - totalExpenses

      // Calculate savings capacity
      const savingsCapacity = Math.max(0, monthlyBalance - totalMonthlyPayments)

      // Check if we have real data (not just onboarding estimates)
      const hasRealData = incomes.length > 0 || expenses.length > 0 || debts.length > 0

      return {
        monthlyIncome: totalMonthlyIncome,
        extraIncome: 0, // Not tracked separately
        monthlyExpenses: totalExpenses,
        monthlyBalance,
        currentSavings: goals.reduce((sum, goal) => sum + goal.current_amount, 0),
        totalDebtBalance: totalDebt,
        totalMonthlyDebtPayments: totalMonthlyPayments,
        savingsCapacity,
        hasRealData
      }
    },
    enabled: !!user?.id,
  })

  return {
    consolidatedData: consolidatedData.data,
    isLoading: consolidatedData.isLoading,
    error: consolidatedData.error
  }
}
