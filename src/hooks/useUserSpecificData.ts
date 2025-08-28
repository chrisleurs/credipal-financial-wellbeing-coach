
/**
 * Hook que garantiza datos específicos del usuario autenticado
 * Incluye validación estricta de user_id en todas las consultas
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export interface UserSpecificFinancialData {
  userId: string
  
  // Datos de perfil/onboarding
  profileData: {
    onboardingCompleted: boolean
    onboardingStep: number
    onboardingData: any
  }
  
  // Datos consolidados
  monthlyIncome: number
  monthlyExpenses: number
  totalDebtBalance: number
  currentSavings: number
  savingsCapacity: number
  
  // Colecciones detalladas
  incomeBreakdown: Array<{ source: string; amount: number; frequency: string }>
  expenseCategories: Record<string, number>
  activeDebts: Array<{ creditor: string; balance: number; payment: number }>
  activeGoals: Array<{ title: string; target: number; current: number; progress: number }>
  
  // Validación
  hasRealData: boolean
  dataSource: string
  lastUpdated: string
}

// Type guard for onboarding data
const isValidOnboardingData = (data: any): data is Record<string, any> => {
  return data && typeof data === 'object' && !Array.isArray(data)
}

export const useUserSpecificData = () => {
  const { user } = useAuth()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user-specific-data', user?.id],
    queryFn: async (): Promise<UserSpecificFinancialData> => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado')
      }

      console.log('🔍 Obteniendo datos específicos para usuario:', user.id)

      // 1. VERIFICAR PERFIL DEL USUARIO
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        console.error('❌ Error obteniendo perfil:', profileError)
        throw new Error(`Error obteniendo perfil: ${profileError.message}`)
      }

      if (!profile) {
        throw new Error('Perfil de usuario no encontrado')
      }

      console.log('👤 Perfil encontrado para usuario:', user.id, {
        onboardingCompleted: profile.onboarding_completed,
        onboardingStep: profile.onboarding_step,
        hasOnboardingData: !!profile.onboarding_data && Object.keys(profile.onboarding_data).length > 0
      })

      // 2. OBTENER FUENTES DE INGRESO (con filtro estricto de user_id)
      const { data: incomeSources, error: incomeError } = await supabase
        .from('income_sources')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (incomeError) {
        console.error('❌ Error obteniendo ingresos:', incomeError)
      }

      let monthlyIncome = 0
      const incomeBreakdown = []

      if (incomeSources && incomeSources.length > 0) {
        console.log('💰 Fuentes de ingreso encontradas:', incomeSources.length)
        
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
      } else {
        // Fallback a datos del onboarding si no hay datos consolidados
        const onboardingData = isValidOnboardingData(profile.onboarding_data) ? profile.onboarding_data : {}
        
        if (onboardingData.monthlyIncome && typeof onboardingData.monthlyIncome === 'number') {
          monthlyIncome += onboardingData.monthlyIncome
          incomeBreakdown.push({
            source: 'Ingreso Principal (Onboarding)',
            amount: onboardingData.monthlyIncome,
            frequency: 'monthly'
          })
        }
        
        if (onboardingData.extraIncome && typeof onboardingData.extraIncome === 'number') {
          monthlyIncome += onboardingData.extraIncome
          incomeBreakdown.push({
            source: 'Ingresos Adicionales (Onboarding)',
            amount: onboardingData.extraIncome,
            frequency: 'monthly'
          })
        }
        
        console.log('📊 Usando datos de onboarding para ingresos:', monthlyIncome)
      }

      // 3. OBTENER GASTOS (últimos 30 días)
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

      if (expensesError) {
        console.error('❌ Error obteniendo gastos:', expensesError)
      }

      let monthlyExpenses = 0
      let expenseCategories: Record<string, number> = {}

      if (expenses && expenses.length > 0) {
        console.log('💸 Gastos encontrados:', expenses.length)
        
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
        monthlyExpenses = totalExpenses

        expenses.forEach(expense => {
          const category = expense.category || 'Otros'
          expenseCategories[category] = (expenseCategories[category] || 0) + expense.amount
        })
      } else {
        // Fallback a datos del onboarding
        const onboardingData = isValidOnboardingData(profile.onboarding_data) ? profile.onboarding_data : {}
        
        if (onboardingData.expenseCategories && typeof onboardingData.expenseCategories === 'object') {
          Object.entries(onboardingData.expenseCategories).forEach(([key, amount]) => {
            if (typeof amount === 'number' && amount > 0) {
              expenseCategories[key] = amount
              monthlyExpenses += amount
            }
          })
        } else if (onboardingData.monthlyExpenses && typeof onboardingData.monthlyExpenses === 'number') {
          monthlyExpenses = onboardingData.monthlyExpenses
          expenseCategories['Gastos Generales'] = monthlyExpenses
        }
        
        console.log('📊 Usando datos de onboarding para gastos:', monthlyExpenses)
      }

      // 4. OBTENER DEUDAS ACTIVAS
      const { data: debts, error: debtsError } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (debtsError) {
        console.error('❌ Error obteniendo deudas:', debtsError)
      }

      let totalDebtBalance = 0
      const activeDebts = []

      if (debts && debts.length > 0) {
        console.log('💳 Deudas encontradas:', debts.length)
        
        debts.forEach(debt => {
          totalDebtBalance += debt.current_balance
          activeDebts.push({
            creditor: debt.creditor,
            balance: debt.current_balance,
            payment: debt.monthly_payment
          })
        })
      } else {
        // Fallback a datos del onboarding
        const onboardingData = isValidOnboardingData(profile.onboarding_data) ? profile.onboarding_data : {}
        
        if (onboardingData.debts && Array.isArray(onboardingData.debts)) {
          onboardingData.debts.forEach((debt: any) => {
            const balance = Number(debt.amount || 0)
            if (balance > 0) {
              totalDebtBalance += balance
              activeDebts.push({
                creditor: debt.name || 'Acreedor',
                balance: balance,
                payment: Number(debt.monthlyPayment || 0)
              })
            }
          })
        }
        
        console.log('📊 Usando datos de onboarding para deudas:', totalDebtBalance)
      }

      // 5. OBTENER METAS ACTIVAS
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (goalsError) {
        console.error('❌ Error obteniendo metas:', goalsError)
      }

      const activeGoals = []
      let currentSavings = 0

      if (goals && goals.length > 0) {
        console.log('🎯 Metas encontradas:', goals.length)
        
        goals.forEach(goal => {
          const progress = goal.target_amount > 0 ? 
            (goal.current_amount / goal.target_amount) * 100 : 0
          
          activeGoals.push({
            title: goal.title,
            target: goal.target_amount,
            current: goal.current_amount,
            progress
          })
          
          currentSavings += goal.current_amount
        })
      } else {
        // Fallback a datos del onboarding
        const onboardingData = isValidOnboardingData(profile.onboarding_data) ? profile.onboarding_data : {}
        
        if (onboardingData.currentSavings && typeof onboardingData.currentSavings === 'number') {
          currentSavings = onboardingData.currentSavings
        }
        
        if (onboardingData.financialGoals && Array.isArray(onboardingData.financialGoals)) {
          onboardingData.financialGoals.forEach((goalTitle: string) => {
            activeGoals.push({
              title: goalTitle,
              target: 10000, // Valor por defecto
              current: currentSavings * 0.1, // Distribución estimada
              progress: 10
            })
          })
        }
        
        console.log('📊 Usando datos de onboarding para metas y ahorros')
      }

      // 6. CALCULAR CAPACIDAD DE AHORRO
      const totalMonthlyDebtPayments = activeDebts.reduce((sum, debt) => sum + debt.payment, 0)
      const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)

      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || totalDebtBalance > 0 || activeGoals.length > 0

      const result: UserSpecificFinancialData = {
        userId: user.id,
        profileData: {
          onboardingCompleted: profile.onboarding_completed,
          onboardingStep: profile.onboarding_step || 0,
          onboardingData: isValidOnboardingData(profile.onboarding_data) ? profile.onboarding_data : {}
        },
        monthlyIncome,
        monthlyExpenses,
        totalDebtBalance,
        currentSavings,
        savingsCapacity,
        incomeBreakdown,
        expenseCategories,
        activeDebts,
        activeGoals,
        hasRealData,
        dataSource: hasRealData ? 'consolidated+onboarding' : 'onboarding-only',
        lastUpdated: new Date().toISOString()
      }

      console.log('✅ DATOS ESPECÍFICOS DEL USUARIO COMPLETADOS:', {
        userId: user.id,
        monthlyIncome: result.monthlyIncome,
        monthlyExpenses: result.monthlyExpenses,
        totalDebtBalance: result.totalDebtBalance,
        currentSavings: result.currentSavings,
        savingsCapacity: result.savingsCapacity,
        hasRealData: result.hasRealData,
        dataSource: result.dataSource
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
    refetch,
    userId: user?.id
  }
}
