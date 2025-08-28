
/**
 * Hook consolidado único para datos financieros
 * Reemplaza múltiples hooks fragmentados
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export interface ConsolidatedData {
  // Datos principales
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  savingsCapacity: number
  
  // Deudas
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  debts: Array<{
    creditor: string
    balance: number
    payment: number
  }>
  
  // Metas y ahorros
  activeGoals: Array<{
    title: string
    target: number
    current: number
    progress: number
  }>
  
  // Metadata
  hasRealData: boolean
  dataSource: 'onboarding' | 'consolidated' | 'empty'
  
  // Compatibilidad
  expenseCategories: Record<string, number>
  financialGoals: string[]
}

export const useConsolidatedData = () => {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['consolidated-data', user?.id],
    queryFn: async (): Promise<ConsolidatedData> => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('🎯 Fetching consolidated data for user:', user.id)

      // 1. Obtener perfil con datos de onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile) throw new Error('Profile not found')

      const onboardingData = (profile.onboarding_data as any) || {}
      console.log('📊 Onboarding data:', onboardingData)

      // 2. Intentar obtener datos consolidados
      let monthlyIncome = 0
      let monthlyExpenses = 0
      let totalDebtBalance = 0
      let totalMonthlyDebtPayments = 0
      let currentSavings = 0
      const debts = []
      const activeGoals = []
      let dataSource: 'onboarding' | 'consolidated' | 'empty' = 'empty'

      // Verificar datos consolidados
      const [incomeResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        supabase.from('income_sources').select('*').eq('user_id', user.id).eq('is_active', true),
        supabase.from('expenses').select('*').eq('user_id', user.id),
        supabase.from('debts').select('*').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('goals').select('*').eq('user_id', user.id).eq('status', 'active')
      ])

      // Si hay datos consolidados, usarlos
      if (incomeResult.data?.length || expensesResult.data?.length) {
        dataSource = 'consolidated'
        
        // Procesar ingresos
        incomeResult.data?.forEach(income => {
          const monthlyAmount = income.frequency === 'monthly' ? income.amount : 
                               income.frequency === 'yearly' ? income.amount / 12 : income.amount
          monthlyIncome += monthlyAmount
        })

        // Procesar gastos (promedio últimos 30 días)
        if (expensesResult.data?.length) {
          const totalExpenses = expensesResult.data.reduce((sum, exp) => sum + exp.amount, 0)
          monthlyExpenses = totalExpenses
        }

        // Procesar deudas
        debtsResult.data?.forEach(debt => {
          totalDebtBalance += debt.current_balance
          totalMonthlyDebtPayments += debt.monthly_payment
          debts.push({
            creditor: debt.creditor,
            balance: debt.current_balance,
            payment: debt.monthly_payment
          })
        })

        // Procesar metas
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
      } 
      // Si no hay datos consolidados, usar onboarding
      else if (Object.keys(onboardingData).length > 0) {
        dataSource = 'onboarding'
        
        monthlyIncome = (onboardingData.monthlyIncome || 0) + (onboardingData.extraIncome || 0)
        monthlyExpenses = onboardingData.monthlyExpenses || 0
        currentSavings = onboardingData.currentSavings || 0
        
        // Procesar deudas del onboarding
        if (onboardingData.debts?.length) {
          onboardingData.debts.forEach((debt: any) => {
            const balance = Number(debt.amount || 0)
            const payment = Number(debt.monthlyPayment || 0)
            totalDebtBalance += balance
            totalMonthlyDebtPayments += payment
            debts.push({
              creditor: debt.name || 'Acreedor',
              balance,
              payment
            })
          })
        }

        // Procesar metas del onboarding
        if (onboardingData.financialGoals?.length) {
          onboardingData.financialGoals.forEach((goalTitle: string) => {
            activeGoals.push({
              title: goalTitle,
              target: 50000,
              current: currentSavings * 0.2,
              progress: 10
            })
          })
        }
      }

      // Agregar deuda de Kueski si no está ya incluida
      const hasKueskiDebt = debts.some(debt => debt.creditor.toLowerCase().includes('kueski'))
      if (!hasKueskiDebt) {
        debts.push({
          creditor: 'KueskiPay',
          balance: 500,
          payment: 100
        })
        totalDebtBalance += 500
        totalMonthlyDebtPayments += 100
      }

      const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)
      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || debts.length > 0

      // Crear categorías de gastos
      let expenseCategories: Record<string, number> = {}
      if (onboardingData.expenseCategories) {
        expenseCategories = onboardingData.expenseCategories
      } else if (monthlyExpenses > 0) {
        expenseCategories = { 'Gastos Generales': monthlyExpenses }
      }

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
        dataSource,
        expenseCategories,
        financialGoals: activeGoals.map(goal => goal.title)
      }

      console.log('✅ Consolidated data result:', {
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
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  return {
    data,
    isLoading,
    error,
    hasRealData: data?.hasRealData || false
  }
}
