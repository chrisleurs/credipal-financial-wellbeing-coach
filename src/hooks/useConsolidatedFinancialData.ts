
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
  expenseCategories: Record<string, number>
  financialGoals: string[]
  debts: Array<{
    id: string
    creditor: string
    current_balance: number
    monthly_payment: number
    interest_rate: number
  }>
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

      // Calculate expense categories
      const expenseCategories = expenses.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {})

      // Map debts to required format
      const mappedDebts = debts.map(debt => ({
        id: debt.id,
        creditor: debt.creditor,
        current_balance: debt.current_balance,
        monthly_payment: debt.monthly_payment,
        interest_rate: debt.interest_rate
      }))

      return {
        monthlyIncome: totalMonthlyIncome,
        extraIncome: 0, // Not tracked separately
        monthlyExpenses: totalExpenses,
        monthlyBalance,
        currentSavings: goals.reduce((sum, goal) => sum + goal.current_amount, 0),
        totalDebtBalance: totalDebt,
        totalMonthlyDebtPayments: totalMonthlyPayments,
        savingsCapacity,
        hasRealData,
        expenseCategories,
        financialGoals: goals.map(goal => goal.title),
        debts: mappedDebts
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
