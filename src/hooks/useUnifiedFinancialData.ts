
/**
 * Hook unificado final - reemplaza todos los hooks fragmentados
 * Una sola fuente de verdad para todos los datos financieros
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

      console.log('🎯 Fetching UNIFIED financial data')

      // 1. Obtener datos del onboarding desde profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('user_id', user.id)
        .single()

      const onboardingData = (profile?.onboarding_data as any) || {}
      console.log('📊 Onboarding data found:', !!onboardingData.monthlyIncome)

      // 2. Calcular datos básicos del onboarding
      const monthlyIncome = Number(onboardingData.monthlyIncome || 0) + Number(onboardingData.extraIncome || 0)
      let monthlyExpenses = 0
      let expenseCategories: Record<string, number> = {}

      if (onboardingData.expenseCategories) {
        Object.entries(onboardingData.expenseCategories).forEach(([key, amount]) => {
          if (typeof amount === 'number' && amount > 0) {
            const categoryName = key === 'food' ? 'Alimentación' : 
                                 key === 'transport' ? 'Transporte' : 
                                 key === 'housing' ? 'Vivienda' : 
                                 key === 'bills' ? 'Servicios' : 
                                 key === 'entertainment' ? 'Entretenimiento' : key
            expenseCategories[categoryName] = amount
            monthlyExpenses += amount
          }
        })
      } else if (onboardingData.monthlyExpenses) {
        monthlyExpenses = Number(onboardingData.monthlyExpenses)
        expenseCategories['Gastos Generales'] = monthlyExpenses
      }

      // 3. Procesar deudas del onboarding
      let totalDebtBalance = 0
      let totalMonthlyDebtPayments = 0
      const debts = []

      if (onboardingData.debts?.length) {
        onboardingData.debts.forEach((debt: any) => {
          const balance = Number(debt.amount || 0)
          const payment = Number(debt.monthlyPayment || 0)
          if (balance > 0) {
            debts.push({
              creditor: debt.name || 'Acreedor',
              balance,
              payment
            })
            totalDebtBalance += balance
            totalMonthlyDebtPayments += payment
          }
        })
      }

      // 4. AGREGAR DEUDA DE KUESKI (siempre presente)
      const kueskiDebt = {
        balance: 500, // $500 USD
        monthlyPayment: 200, // $100 USD cada 15 días = $200/mes
        nextPaymentDate: '2025-09-01',
        remainingPayments: 5
      }

      // Agregar Kueski a las deudas si no está
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

      // 5. Calcular métricas finales
      const currentSavings = Number(onboardingData.currentSavings || 0)
      const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)
      const financialGoals = onboardingData.financialGoals || []
      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || debts.length > 0

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

      console.log('✅ UNIFIED DATA RESULT:', {
        monthlyIncome: result.monthlyIncome,
        monthlyExpenses: result.monthlyExpenses,
        totalDebtBalance: result.totalDebtBalance,
        kueskiDebt: result.kueskiDebt,
        hasRealData: result.hasRealData
      })

      return result
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    data,
    isLoading,
    error,
    refetch: () => console.log('Refetching unified data...')
  }
}
