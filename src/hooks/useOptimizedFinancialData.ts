
/**
 * Hook optimizado que centraliza y cachea todos los datos financieros
 * Reemplaza la lógica dispersa de useConsolidatedFinancialData
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export interface OptimizedFinancialData {
  // Core metrics
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  savingsCapacity: number
  
  // Debt info
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  
  // Savings & Goals
  currentSavings: number
  totalGoalsTarget: number
  totalGoalsCurrent: number
  
  // Metadata
  hasRealData: boolean
  lastCalculated: string | null
  
  // Detailed breakdowns
  expenseCategories: Record<string, number>
  incomeBreakdown: Array<{ source: string; amount: number; frequency: string }>
  activeDebts: Array<{ creditor: string; balance: number; payment: number }>
  activeGoals: Array<{ title: string; target: number; current: number; progress: number }>
}

export const useOptimizedFinancialData = () => {
  const { user } = useAuth()

  const financialData = useQuery({
    queryKey: ['optimized-financial-data', user?.id],
    queryFn: async (): Promise<OptimizedFinancialData> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Single query to get financial summary (calculated by triggers)
      const { data: summary } = await supabase
        .from('financial_summary')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Parallel queries for detailed data
      const [incomesResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        supabase.from('income_sources').select('*').eq('user_id', user.id).eq('is_active', true),
        supabase.from('expenses').select('*').eq('user_id', user.id).gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        supabase.from('debts').select('*').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('goals').select('*').eq('user_id', user.id).eq('status', 'active')
      ])

      const incomes = incomesResult.data || []
      const expenses = expensesResult.data || []
      const debts = debtsResult.data || []
      const goals = goalsResult.data || []

      // Calculate expense categories
      const expenseCategories = expenses.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {})

      // Map income breakdown
      const incomeBreakdown = incomes.map(income => ({
        source: income.source_name,
        amount: income.amount,
        frequency: income.frequency
      }))

      // Map active debts
      const activeDebts = debts.map(debt => ({
        creditor: debt.creditor,
        balance: debt.current_balance,
        payment: debt.monthly_payment
      }))

      // Map active goals with progress
      const activeGoals = goals.map(goal => ({
        title: goal.title,
        target: goal.target_amount,
        current: goal.current_amount,
        progress: goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
      }))

      return {
        monthlyIncome: summary?.total_monthly_income || 0,
        monthlyExpenses: summary?.total_monthly_expenses || 0,
        monthlyBalance: (summary?.total_monthly_income || 0) - (summary?.total_monthly_expenses || 0),
        savingsCapacity: summary?.savings_capacity || 0,
        totalDebtBalance: summary?.total_debt || 0,
        totalMonthlyDebtPayments: summary?.monthly_debt_payments || 0,
        currentSavings: summary?.emergency_fund || 0,
        totalGoalsTarget: goals.reduce((sum, goal) => sum + goal.target_amount, 0),
        totalGoalsCurrent: goals.reduce((sum, goal) => sum + goal.current_amount, 0),
        hasRealData: incomes.length > 0 || expenses.length > 0 || debts.length > 0,
        lastCalculated: summary?.last_calculated || null,
        expenseCategories,
        incomeBreakdown,
        activeDebts,
        activeGoals
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime)
  })

  return {
    data: financialData.data,
    isLoading: financialData.isLoading,
    error: financialData.error,
    refetch: financialData.refetch
  }
}
