
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useIncomes } from '@/domains/income/hooks/useIncomes'
import { useExpenses } from '@/domains/expenses/hooks/useExpenses'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { useGoals } from '@/domains/savings/hooks/useGoals'

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
  expenseCategories: Record<string, number>
  debts: Array<{
    id: string
    creditor: string
    current_balance: number
    monthly_payment: number
    annual_interest_rate: number
  }>
  dataCompleteness: number
}

export const useConsolidatedProfile = () => {
  const { user } = useAuth()
  const { incomes, totalMonthlyIncome } = useIncomes()
  const { expenses, totalExpenses } = useExpenses()
  const { debts, totalDebt, totalMonthlyPayments } = useDebts()
  const { goals } = useGoals()

  const consolidatedProfile = useQuery({
    queryKey: ['consolidated-profile', user?.id],
    queryFn: async (): Promise<ConsolidatedProfile> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Calculate expense categories
      const expenseCategories: Record<string, number> = {}
      expenses.forEach(expense => {
        expenseCategories[expense.category] = (expenseCategories[expense.category] || 0) + expense.amount
      })

      // Map debts to legacy format
      const legacyDebts = debts.map(debt => ({
        id: debt.id,
        creditor: debt.creditor,
        current_balance: debt.current_balance,
        monthly_payment: debt.monthly_payment,
        annual_interest_rate: debt.interest_rate
      }))

      // Calculate financial goals
      const financialGoals = goals.map(goal => goal.title)

      // Calculate savings capacity
      const savingsCapacity = Math.max(0, totalMonthlyIncome - totalExpenses - totalMonthlyPayments)

      // Calculate data completeness
      let completeness = 0
      if (incomes.length > 0) completeness += 30
      if (expenses.length > 0) completeness += 30
      if (debts.length > 0) completeness += 20
      if (goals.length > 0) completeness += 20

      return {
        userId: user.id,
        name: user.email || 'Usuario',
        monthlyIncome: totalMonthlyIncome,
        extraIncome: 0,
        monthlyExpenses: totalExpenses,
        monthlyBalance: totalMonthlyIncome - totalExpenses,
        currentSavings: 0,
        totalDebtBalance: totalDebt,
        totalMonthlyDebtPayments: totalMonthlyPayments,
        savingsCapacity,
        financialGoals,
        expenseCategories,
        debts: legacyDebts,
        dataCompleteness: completeness
      }
    },
    enabled: !!user?.id,
  })

  return {
    consolidatedProfile: consolidatedProfile.data,
    hasCompleteData: (consolidatedProfile.data?.dataCompleteness || 0) >= 80,
    isLoading: consolidatedProfile.isLoading,
    error: consolidatedProfile.error
  }
}
