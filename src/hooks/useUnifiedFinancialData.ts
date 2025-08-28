
/**
 * Hook unificado final - GARANTIZA que los datos del onboarding se muestren
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
  
  // Debt info (incluyendo Kueski)
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  kueskiDebt: {
    balance: number
    monthlyPayment: number
    nextPaymentDate: string
    remainingPayments: number
  }
  
  // Savings & Goals
  currentSavings: number
  
  // Metadata
  hasRealData: boolean
  userId: string
  
  // Collections
  expenseCategories: Record<string, number>
  debts: Array<{ creditor: string; balance: number; payment: number }>
  financialGoals: string[]
}

export const useUnifiedFinancialData = () => {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['unified-financial-data', user?.id],
    queryFn: async (): Promise<UnifiedFinancialData> => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('🎯 UNIFIED: Fetching financial data for user:', user.id)

      // 1. OBTENER datos del perfil (donde están los datos del onboarding)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        console.error('❌ UNIFIED: Error fetching profile:', profileError)
        throw new Error(`Error obteniendo perfil: ${profileError.message}`)
      }

      const onboardingData = (profile?.onboarding_data as any) || {}
      console.log('📊 UNIFIED: Onboarding data:', {
        monthlyIncome: onboardingData.monthlyIncome,
        extraIncome: onboardingData.extraIncome,
        monthlyExpenses: onboardingData.monthlyExpenses,
        currentSavings: onboardingData.currentSavings,
        debtsCount: onboardingData.debts?.length || 0,
        expenseCategoriesKeys: Object.keys(onboardingData.expenseCategories || {}),
        financialGoals: onboardingData.financialGoals?.length || 0
      })

      // 2. PROCESAR INGRESOS del onboarding
      let monthlyIncome = 0
      if (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0) {
        monthlyIncome += Number(onboardingData.monthlyIncome)
      }
      if (onboardingData.extraIncome && onboardingData.extraIncome > 0) {
        monthlyIncome += Number(onboardingData.extraIncome)
      }

      console.log('💰 UNIFIED: Monthly income calculated:', monthlyIncome)

      // 3. PROCESAR GASTOS del onboarding
      let monthlyExpenses = 0
      let expenseCategories: Record<string, number> = {}

      if (onboardingData.expenseCategories && typeof onboardingData.expenseCategories === 'object') {
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
      } else if (onboardingData.monthlyExpenses && onboardingData.monthlyExpenses > 0) {
        monthlyExpenses = Number(onboardingData.monthlyExpenses)
        expenseCategories['Gastos Generales'] = monthlyExpenses
      }

      console.log('💸 UNIFIED: Monthly expenses calculated:', monthlyExpenses, 'Categories:', Object.keys(expenseCategories))

      // 4. PROCESAR DEUDAS del onboarding
      let totalDebtBalance = 0
      let totalMonthlyDebtPayments = 0
      const debts = []

      // Agregar deudas del onboarding
      if (onboardingData.debts && Array.isArray(onboardingData.debts) && onboardingData.debts.length > 0) {
        onboardingData.debts.forEach((debt: any) => {
          const balance = Number(debt.amount || 0)
          const payment = Number(debt.monthlyPayment || 0)
          if (balance > 0) {
            debts.push({
              creditor: debt.name || 'Acreedor',
              balance: balance,
              payment: payment
            })
            totalDebtBalance += balance
            totalMonthlyDebtPayments += payment
          }
        })
      }

      // 5. AGREGAR deuda de Kueski (siempre presente)
      const kueskiDebt = {
        balance: 500,
        monthlyPayment: 200,
        nextPaymentDate: '2025-09-01',
        remainingPayments: 5
      }

      // Verificar si Kueski ya está en las deudas del onboarding
      const hasKueski = debts.some(debt => debt.creditor.toLowerCase().includes('kueski'))
      if (!hasKueski) {
        debts.push({
          creditor: 'KueskiPay',
          balance: kueskiDebt.balance,
          payment: kueskiDebt.monthlyPayment
        })
        totalDebtBalance += kueskiDebt.balance
        totalMonthlyDebtPayments += kueskiDebt.monthlyPayment
      }

      console.log('💳 UNIFIED: Debts processed:', {
        totalDebtBalance,
        totalMonthlyDebtPayments,
        debtsCount: debts.length,
        hasKueski: hasKueski
      })

      // 6. PROCESAR AHORROS Y METAS
      const currentSavings = Number(onboardingData.currentSavings || 0)
      const financialGoals = onboardingData.financialGoals || []

      console.log('🎯 UNIFIED: Savings and goals:', {
        currentSavings,
        financialGoalsCount: financialGoals.length,
        goals: financialGoals
      })

      // 7. CALCULAR métricas finales
      const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)
      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || debts.length > 1 || financialGoals.length > 0

      const result: UnifiedFinancialData = {
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
        savingsCapacity,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        kueskiDebt,
        currentSavings,
        hasRealData,
        userId: user.id,
        expenseCategories,
        debts,
        financialGoals
      }

      console.log('✅ UNIFIED: Final result:', {
        monthlyIncome: result.monthlyIncome,
        monthlyExpenses: result.monthlyExpenses,
        totalDebtBalance: result.totalDebtBalance,
        kueskiDebt: result.kueskiDebt.balance,
        hasRealData: result.hasRealData,
        financialGoalsCount: result.financialGoals.length,
        debtsCount: result.debts.length
      })

      return result
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  })

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      console.log('🔄 UNIFIED: Refetching data...')
    }
  }
}
