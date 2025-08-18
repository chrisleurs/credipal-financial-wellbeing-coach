
import { useQuery } from '@tanstack/react-query'
import { useIncomes } from './useIncomes'
import { useExpenses } from './useExpenses'
import { useDebts } from './useDebts'
import { useGoals } from './useGoals'
import { useFinancialSummary } from './useFinancialSummary'
import { useAuth } from './useAuth'
import { ConsolidatedFinancialData } from '@/types/unified'

export const useConsolidatedFinancialData = () => {
  const { user } = useAuth()
  const { incomes, totalMonthlyIncome } = useIncomes()
  const { expenses } = useExpenses()
  const { debts, totalDebt, totalMonthlyPayments } = useDebts()
  const { goals } = useGoals()
  const { financialSummary } = useFinancialSummary()

  return useQuery({
    queryKey: ['consolidated-financial-data', user?.id],
    queryFn: async (): Promise<ConsolidatedFinancialData> => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      // Calculate expense categories
      const expenseCategories: Record<string, number> = {}
      expenses.forEach(expense => {
        expenseCategories[expense.category] = (expenseCategories[expense.category] || 0) + expense.amount
      })

      // Calculate monthly expenses from actual expenses (last 3 months average)
      const now = new Date()
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      
      const recentExpenses = expenses.filter(expense => 
        new Date(expense.date) >= threeMonthsAgo
      )
      
      const monthlyExpenses = recentExpenses.length > 0 
        ? recentExpenses.reduce((sum, expense) => sum + expense.amount, 0) / 3
        : 0

      // Convert debts to onboarding format
      const onboardingDebts = debts.map(debt => ({
        id: debt.id,
        name: debt.creditor,
        amount: debt.currentBalance.amount,
        monthlyPayment: debt.monthlyPayment.amount
      }))

      const result: ConsolidatedFinancialData = {
        monthlyIncome: totalMonthlyIncome,
        extraIncome: 0,
        monthlyExpenses: financialSummary?.total_monthly_expenses || monthlyExpenses,
        currentSavings: financialSummary?.emergency_fund || 0,
        monthlySavingsCapacity: financialSummary?.savings_capacity || (totalMonthlyIncome - monthlyExpenses - totalMonthlyPayments),
        financialGoals: goals.map(goal => goal.title),
        expenseCategories,
        debts: onboardingDebts,
        totalDebts: totalDebt,
        monthlyDebtPayments: totalMonthlyPayments,
        savingsCapacity: financialSummary?.savings_capacity || (totalMonthlyIncome - monthlyExpenses - totalMonthlyPayments),
        hasRealData: incomes.length > 0 || expenses.length > 0 || debts.length > 0 || goals.length > 0
      }

      return result
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
