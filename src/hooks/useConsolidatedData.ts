
/**
 * Hook que GARANTIZA que los datos consolidados estén disponibles
 * Consulta DIRECTAMENTE las tablas donde se guardan los datos migrados
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export interface ConsolidatedData {
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  savingsCapacity: number
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  debts: Array<{
    creditor: string
    balance: number
    payment: number
  }>
  activeGoals: Array<{
    title: string
    target: number
    current: number
    progress: number
  }>
  hasRealData: boolean
  dataSource: 'consolidated' | 'empty'
  expenseCategories: Record<string, number>
  financialGoals: string[]
}

export const useConsolidatedData = () => {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['fixed-consolidated-data', user?.id],
    queryFn: async (): Promise<ConsolidatedData> => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('🔍 FIXED: Fetching data from ACTUAL tables where data is stored')

      // CONSULTAR DIRECTAMENTE las tablas donde se migran los datos
      const [incomeResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        supabase.from('income_sources').select('*').eq('user_id', user.id).eq('is_active', true),
        supabase.from('expenses').select('*').eq('user_id', user.id),
        supabase.from('debts').select('*').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('goals').select('*').eq('user_id', user.id).eq('status', 'active')
      ])

      console.log('📊 FIXED: Raw data from tables:', {
        incomes: incomeResult.data?.length || 0,
        expenses: expensesResult.data?.length || 0,
        debts: debtsResult.data?.length || 0,
        goals: goalsResult.data?.length || 0
      })

      let monthlyIncome = 0
      let monthlyExpenses = 0
      let currentSavings = 0
      let totalDebtBalance = 0
      let totalMonthlyDebtPayments = 0
      const debts = []
      const activeGoals = []
      const expenseCategories: Record<string, number> = {}

      // PROCESAR INGRESOS
      incomeResult.data?.forEach(income => {
        const monthlyAmount = income.frequency === 'monthly' ? income.amount : 
                             income.frequency === 'yearly' ? income.amount / 12 : income.amount
        monthlyIncome += monthlyAmount
      })

      // PROCESAR GASTOS
      expensesResult.data?.forEach(expense => {
        monthlyExpenses += expense.amount
        expenseCategories[expense.category] = (expenseCategories[expense.category] || 0) + expense.amount
      })

      // PROCESAR DEUDAS
      debtsResult.data?.forEach(debt => {
        totalDebtBalance += debt.current_balance
        totalMonthlyDebtPayments += debt.monthly_payment
        debts.push({
          creditor: debt.creditor,
          balance: debt.current_balance,
          payment: debt.monthly_payment
        })
      })

      // PROCESAR METAS
      goalsResult.data?.forEach(goal => {
        const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
        activeGoals.push({
          title: goal.title,
          target: goal.target_amount,
          current: goal.current_amount,
          progress
        })
        currentSavings += goal.current_amount
      })

      const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)
      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || debts.length > 0 || activeGoals.length > 0

      const result: ConsolidatedData = {
        monthlyIncome,
        monthlyExpenses,
        currentSavings,
        savingsCapacity,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        debts,
        activeGoals,
        hasRealData,
        dataSource: hasRealData ? 'consolidated' : 'empty',
        expenseCategories,
        financialGoals: activeGoals.map(goal => goal.title)
      }

      console.log('✅ FIXED: Final consolidated result:', {
        monthlyIncome: result.monthlyIncome,
        monthlyExpenses: result.monthlyExpenses,
        savingsCapacity: result.savingsCapacity,
        totalDebtBalance: result.totalDebtBalance,
        hasRealData: result.hasRealData,
        dataSource: result.dataSource
      })

      return result
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    data,
    isLoading,
    error,
    hasRealData: data?.hasRealData || false
  }
}
