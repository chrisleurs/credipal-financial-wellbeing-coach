
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

      console.log('🔍 Fetching optimized financial data for user:', user.id)

      // Parallel queries for all financial data
      const [summaryResult, incomesResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        // Financial summary (calculated by triggers)
        supabase
          .from('financial_summary')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
          
        // Income sources  
        supabase
          .from('income_sources')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true),
          
        // Recent expenses (last 90 days)
        supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: false }),
          
        // Active debts
        supabase
          .from('debts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active'),
          
        // Active goals
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
      ])

      const summary = summaryResult.data
      const incomes = incomesResult.data || []
      const expenses = expensesResult.data || []
      const debts = debtsResult.data || []
      const goals = goalsResult.data || []

      console.log('📊 Raw financial data:', {
        summary,
        incomesCount: incomes.length,
        expensesCount: expenses.length,
        debtsCount: debts.length,
        goalsCount: goals.length
      })

      // Calculate expense categories
      const expenseCategories = expenses.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
        return acc
      }, {})

      // Map income breakdown
      const incomeBreakdown = incomes.map(income => ({
        source: income.source_name,
        amount: Number(income.amount),
        frequency: income.frequency
      }))

      // Map active debts
      const activeDebts = debts.map(debt => ({
        creditor: debt.creditor,
        balance: Number(debt.current_balance),
        payment: Number(debt.monthly_payment)
      }))

      // Map active goals with progress
      const activeGoals = goals.map(goal => ({
        title: goal.title,
        target: Number(goal.target_amount),
        current: Number(goal.current_amount),
        progress: goal.target_amount > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0
      }))

      // Use summary data if available, otherwise calculate from raw data
      const monthlyIncome = summary?.total_monthly_income || 
        incomes.reduce((sum, income) => {
          const amount = Number(income.amount)
          switch (income.frequency) {
            case 'weekly': return sum + (amount * 4)
            case 'biweekly': return sum + (amount * 2)
            case 'yearly': return sum + (amount / 12)
            default: return sum + amount // monthly
          }
        }, 0)

      const monthlyExpenses = summary?.total_monthly_expenses || 
        (expenses.length > 0 ? expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) / 3 : 0) // Average over 3 months

      const totalDebtBalance = summary?.total_debt || 
        debts.reduce((sum, debt) => sum + Number(debt.current_balance), 0)

      const totalMonthlyDebtPayments = summary?.monthly_debt_payments || 
        debts.reduce((sum, debt) => sum + Number(debt.monthly_payment), 0)

      const savingsCapacity = summary?.savings_capacity || 
        Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)

      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || totalDebtBalance > 0 || 
                         goals.length > 0 || Object.keys(expenseCategories).length > 0

      const result: OptimizedFinancialData = {
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
        savingsCapacity,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        currentSavings: summary?.emergency_fund || 0,
        totalGoalsTarget: goals.reduce((sum, goal) => sum + Number(goal.target_amount), 0),
        totalGoalsCurrent: goals.reduce((sum, goal) => sum + Number(goal.current_amount), 0),
        hasRealData,
        lastCalculated: summary?.last_calculated || null,
        expenseCategories,
        incomeBreakdown,
        activeDebts,
        activeGoals
      }

      console.log('✅ Optimized financial data:', result)
      return result
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced for more frequent updates)
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    data: financialData.data,
    isLoading: financialData.isLoading,
    error: financialData.error,
    refetch: financialData.refetch
  }
}
