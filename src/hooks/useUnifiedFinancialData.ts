
/**
 * Hook unificado que reemplaza useOptimizedFinancialData
 * Solo lee de tablas consolidadas, elimina la duplicación de fuentes
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export interface UnifiedFinancialData {
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
  dataSource: 'consolidated' | 'empty'
  
  // Detailed breakdowns
  expenseCategories: Record<string, number>
  incomeBreakdown: Array<{ source: string; amount: number; frequency: string }>
  activeDebts: Array<{ creditor: string; balance: number; payment: number }>
  activeGoals: Array<{ title: string; target: number; current: number; progress: number }>
}

export const useUnifiedFinancialData = () => {
  const { user } = useAuth()

  const financialData = useQuery({
    queryKey: ['unified-financial-data', user?.id],
    queryFn: async (): Promise<UnifiedFinancialData> => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('🎯 Fetching UNIFIED financial data from consolidated tables only')

      // 1. OBTENER INGRESOS de income_sources
      const { data: incomeSources } = await supabase
        .from('income_sources')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      let monthlyIncome = 0
      const incomeBreakdown = []

      if (incomeSources && incomeSources.length > 0) {
        incomeSources.forEach(income => {
          let monthlyAmount = 0
          
          switch (income.frequency) {
            case 'monthly':
              monthlyAmount = income.amount
              break
            case 'biweekly':
              monthlyAmount = income.amount * 2
              break
            case 'weekly':
              monthlyAmount = income.amount * 4
              break
            case 'yearly':
              monthlyAmount = income.amount / 12
              break
            default:
              monthlyAmount = income.amount
          }
          
          monthlyIncome += monthlyAmount
          incomeBreakdown.push({
            source: income.source_name,
            amount: monthlyAmount,
            frequency: income.frequency
          })
        })
      }

      // 2. OBTENER GASTOS de expenses (últimos 30 días promedio)
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

      let monthlyExpenses = 0
      let expenseCategories: Record<string, number> = {}

      if (expenses && expenses.length > 0) {
        // Calcular promedio diario y convertir a mensual
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
        const avgDaily = totalExpenses / 30
        monthlyExpenses = avgDaily * 30

        // Agrupar por categorías
        expenses.forEach(expense => {
          const category = expense.category || 'Otros'
          expenseCategories[category] = (expenseCategories[category] || 0) + expense.amount
        })
      }

      // 3. OBTENER DEUDAS de debts
      const { data: debts } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      let totalDebtBalance = 0
      let totalMonthlyDebtPayments = 0
      const activeDebts = []

      if (debts && debts.length > 0) {
        debts.forEach(debt => {
          totalDebtBalance += debt.current_balance
          totalMonthlyDebtPayments += debt.monthly_payment
          
          activeDebts.push({
            creditor: debt.creditor,
            balance: debt.current_balance,
            payment: debt.monthly_payment
          })
        })
      }

      // 4. OBTENER METAS de goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      let totalGoalsTarget = 0
      let totalGoalsCurrent = 0
      const activeGoals = []

      if (goals && goals.length > 0) {
        goals.forEach(goal => {
          totalGoalsTarget += goal.target_amount
          totalGoalsCurrent += goal.current_amount
          
          const progress = goal.target_amount > 0 ? 
            (goal.current_amount / goal.target_amount) * 100 : 0
          
          activeGoals.push({
            title: goal.title,
            target: goal.target_amount,
            current: goal.current_amount,
            progress
          })
        })
      }

      // 5. OBTENER RESUMEN FINANCIERO (para ahorros actuales)
      const { data: summary } = await supabase
        .from('financial_summary')
        .select('*')
        .eq('user_id', user.id)
        .single()

      const currentSavings = 0 // TODO: Implementar tabla de ahorros
      const savingsCapacity = summary?.savings_capacity || 
        Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)

      // Determinar si hay datos reales
      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || totalDebtBalance > 0 || activeGoals.length > 0

      const result: UnifiedFinancialData = {
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
        savingsCapacity,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        currentSavings,
        totalGoalsTarget,
        totalGoalsCurrent,
        hasRealData,
        lastCalculated: summary?.last_calculated || new Date().toISOString(),
        dataSource: hasRealData ? 'consolidated' : 'empty',
        expenseCategories,
        incomeBreakdown,
        activeDebts,
        activeGoals
      }

      console.log('✅ UNIFIED DATA RESULT:', {
        monthlyIncome: result.monthlyIncome,
        monthlyExpenses: result.monthlyExpenses,
        totalDebtBalance: result.totalDebtBalance,
        savingsCapacity: result.savingsCapacity,
        hasRealData: result.hasRealData,
        dataSource: result.dataSource
      })

      return result
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  return {
    data: financialData.data,
    isLoading: financialData.isLoading,
    error: financialData.error,
    refetch: financialData.refetch
  }
}
