
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

      console.log('🔍 Fetching financial data for user:', user.id)

      // PRIORIDAD 1: Obtener datos del perfil (onboarding_data)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('👤 Profile found:', !!profile)
      console.log('📊 Onboarding data keys:', Object.keys(profile?.onboarding_data || {}))

      // Extraer datos del onboarding del JSON
      const onboardingData = (profile?.onboarding_data as any) || {}

      console.log('💰 Raw onboarding data:', {
        monthlyIncome: onboardingData.monthlyIncome,
        extraIncome: onboardingData.extraIncome,
        monthlyExpenses: onboardingData.monthlyExpenses,
        currentSavings: onboardingData.currentSavings,
        debtsCount: onboardingData.debts?.length || 0,
        goalsCount: onboardingData.financialGoals?.length || 0
      })

      // CALCULAR INGRESOS MENSUALES - Priorizar datos del onboarding
      let monthlyIncome = 0
      const incomeBreakdown = []

      if (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0) {
        monthlyIncome += Number(onboardingData.monthlyIncome)
        incomeBreakdown.push({
          source: 'Ingreso Principal',
          amount: Number(onboardingData.monthlyIncome),
          frequency: 'monthly'
        })
      }

      if (onboardingData.extraIncome && onboardingData.extraIncome > 0) {
        monthlyIncome += Number(onboardingData.extraIncome)
        incomeBreakdown.push({
          source: 'Ingresos Adicionales',
          amount: Number(onboardingData.extraIncome),
          frequency: 'monthly'
        })
      }

      console.log('💰 Calculated income:', { monthlyIncome, breakdownCount: incomeBreakdown.length })

      // CALCULAR GASTOS MENSUALES - Usar datos del onboarding
      let monthlyExpenses = 0
      let expenseCategories: Record<string, number> = {}

      // Usar gastos categorizados del onboarding
      if (onboardingData.expenseCategories && Object.keys(onboardingData.expenseCategories).length > 0) {
        const categoryMapping: Record<string, string> = {
          'food': 'Alimentación',
          'transport': 'Transporte',
          'housing': 'Vivienda',
          'bills': 'Servicios',
          'entertainment': 'Entretenimiento',
          'healthcare': 'Salud',
          'shopping': 'Compras',
          'other': 'Otros'
        }

        Object.entries(onboardingData.expenseCategories).forEach(([key, amount]) => {
          if (typeof amount === 'number' && amount > 0) {
            const categoryName = categoryMapping[key] || key
            expenseCategories[categoryName] = amount
            monthlyExpenses += amount
          }
        })
      }

      // Usar gastos totales del onboarding si no hay categorías
      if (monthlyExpenses === 0 && onboardingData.monthlyExpenses && onboardingData.monthlyExpenses > 0) {
        monthlyExpenses = Number(onboardingData.monthlyExpenses)
        expenseCategories['Gastos Generales'] = monthlyExpenses
      }

      console.log('💸 Calculated expenses:', { monthlyExpenses, categoriesCount: Object.keys(expenseCategories).length })

      // CALCULAR DEUDAS - Usar datos del onboarding
      let totalDebtBalance = 0
      let totalMonthlyDebtPayments = 0
      const activeDebts = []

      if (onboardingData.debts && Array.isArray(onboardingData.debts) && onboardingData.debts.length > 0) {
        onboardingData.debts.forEach((debt: any) => {
          const balance = Number(debt.amount || 0)
          const payment = Number(debt.monthlyPayment || 0)
          
          if (balance > 0) {
            activeDebts.push({
              creditor: debt.name || 'Acreedor desconocido',
              balance: balance,
              payment: payment
            })
            totalDebtBalance += balance
            totalMonthlyDebtPayments += payment
          }
        })
      }

      console.log('💳 Calculated debts:', { 
        totalDebtBalance, 
        totalMonthlyDebtPayments, 
        debtsCount: activeDebts.length 
      })

      // CALCULAR AHORROS Y METAS
      let currentSavings = 0
      const activeGoals = []

      // Usar ahorros del onboarding
      if (onboardingData.currentSavings && onboardingData.currentSavings > 0) {
        currentSavings = Number(onboardingData.currentSavings)
      }

      // Usar metas del onboarding
      if (onboardingData.financialGoals && Array.isArray(onboardingData.financialGoals) && onboardingData.financialGoals.length > 0) {
        onboardingData.financialGoals.forEach((goalTitle: string) => {
          const targetAmount = onboardingData.monthlySavingsCapacity ? onboardingData.monthlySavingsCapacity * 12 : 50000
          activeGoals.push({
            title: goalTitle,
            target: targetAmount,
            current: currentSavings * 0.3, // Distribute savings across goals
            progress: targetAmount > 0 ? ((currentSavings * 0.3) / targetAmount) * 100 : 0
          })
        })
      }

      // Calcular capacidad de ahorro
      const savingsCapacity = onboardingData.monthlySavingsCapacity || 
                             Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)

      console.log('💎 Calculated savings:', { currentSavings, savingsCapacity, goalsCount: activeGoals.length })

      // Determinar si tenemos datos reales
      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || totalDebtBalance > 0 || 
                         activeGoals.length > 0 || Object.keys(expenseCategories).length > 0

      const result: OptimizedFinancialData = {
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
        savingsCapacity,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        currentSavings,
        totalGoalsTarget: activeGoals.reduce((sum, goal) => sum + goal.target, 0),
        totalGoalsCurrent: activeGoals.reduce((sum, goal) => sum + goal.current, 0),
        hasRealData,
        lastCalculated: new Date().toISOString(),
        expenseCategories,
        incomeBreakdown,
        activeDebts,
        activeGoals
      }

      console.log('✅ FINAL OPTIMIZED DATA:', {
        monthlyIncome: result.monthlyIncome,
        monthlyExpenses: result.monthlyExpenses,
        totalDebtBalance: result.totalDebtBalance,
        currentSavings: result.currentSavings,
        savingsCapacity: result.savingsCapacity,
        hasRealData: result.hasRealData,
        dataSource: 'ONBOARDING_PROFILE'
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
