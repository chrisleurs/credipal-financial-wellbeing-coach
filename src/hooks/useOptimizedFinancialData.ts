
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

      // PRIORIDAD 1: Obtener datos del perfil (onboarding_data)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('👤 Profile data:', profile)
      console.log('📊 Onboarding data:', profile?.onboarding_data)

      // Extraer datos del onboarding del JSON
      const onboardingData = (profile?.onboarding_data as any) || {}

      // PRIORIDAD 2: Obtener datos consolidados de las tablas permanentes
      const [summaryResult, incomesResult, expensesResult, debtsResult, goalsResult, onboardingExpensesResult] = await Promise.all([
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
          .eq('status', 'active'),

        // Onboarding expenses para categorías
        supabase
          .from('onboarding_expenses')
          .select('*')
          .eq('user_id', user.id)
      ])

      const summary = summaryResult.data
      const incomes = incomesResult.data || []
      const expenses = expensesResult.data || []
      const debts = debtsResult.data || []
      const goals = goalsResult.data || []
      const onboardingExpenses = onboardingExpensesResult.data || []

      console.log('📊 Raw financial data:', {
        summary,
        onboardingData,
        incomesCount: incomes.length,
        expensesCount: expenses.length,
        debtsCount: debts.length,
        goalsCount: goals.length,
        onboardingExpensesCount: onboardingExpenses.length
      })

      // CALCULAR INGRESOS MENSUALES - Priorizar datos del onboarding
      let monthlyIncome = 0
      const incomeBreakdown = []

      if (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0) {
        monthlyIncome += Number(onboardingData.monthlyIncome)
        incomeBreakdown.push({
          source: 'Ingreso Principal (Onboarding)',
          amount: Number(onboardingData.monthlyIncome),
          frequency: 'monthly'
        })
      }

      if (onboardingData.extraIncome && onboardingData.extraIncome > 0) {
        monthlyIncome += Number(onboardingData.extraIncome)
        incomeBreakdown.push({
          source: 'Ingresos Adicionales (Onboarding)',
          amount: Number(onboardingData.extraIncome),
          frequency: 'monthly'
        })
      }

      // Si no hay datos del onboarding, usar datos de las tablas permanentes
      if (monthlyIncome === 0 && incomes.length > 0) {
        monthlyIncome = incomes.reduce((sum, income) => {
          const amount = Number(income.amount)
          switch (income.frequency) {
            case 'weekly': return sum + (amount * 4)
            case 'biweekly': return sum + (amount * 2)
            case 'yearly': return sum + (amount / 12)
            default: return sum + amount // monthly
          }
        }, 0)

        incomeBreakdown.push(...incomes.map(income => ({
          source: income.source_name,
          amount: Number(income.amount),
          frequency: income.frequency
        })))
      }

      // Si aún no hay datos, usar el summary
      if (monthlyIncome === 0 && summary?.total_monthly_income) {
        monthlyIncome = Number(summary.total_monthly_income)
        incomeBreakdown.push({
          source: 'Resumen Financiero',
          amount: Number(summary.total_monthly_income),
          frequency: 'monthly'
        })
      }

      // CALCULAR GASTOS MENSUALES - Priorizar datos del onboarding
      let monthlyExpenses = 0
      let expenseCategories: Record<string, number> = {}

      // Primero usar los gastos categorizados del onboarding
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

      // Usar gastos detallados del onboarding si existen
      if (monthlyExpenses === 0 && onboardingExpenses.length > 0) {
        onboardingExpenses.forEach(expense => {
          const category = expense.category || 'Otros'
          expenseCategories[category] = (expenseCategories[category] || 0) + Number(expense.amount)
          monthlyExpenses += Number(expense.amount)
        })
      }

      // Si no hay datos del onboarding, usar datos permanentes
      if (monthlyExpenses === 0 && expenses.length > 0) {
        expenses.forEach(expense => {
          const category = expense.category || 'Otros'
          expenseCategories[category] = (expenseCategories[category] || 0) + Number(expense.amount)
        })
        monthlyExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) / 3 // Average over 3 months
      }

      // Usar datos del onboarding directo para gastos mensuales
      if (monthlyExpenses === 0 && onboardingData.monthlyExpenses && onboardingData.monthlyExpenses > 0) {
        monthlyExpenses = Number(onboardingData.monthlyExpenses)
        expenseCategories['Gastos Generales'] = monthlyExpenses
      }

      // Fallback al summary
      if (monthlyExpenses === 0 && summary?.total_monthly_expenses) {
        monthlyExpenses = Number(summary.total_monthly_expenses)
        expenseCategories['Resumen Financiero'] = monthlyExpenses
      }

      // CALCULAR DEUDAS - Priorizar datos del onboarding
      let totalDebtBalance = 0
      let totalMonthlyDebtPayments = 0
      const activeDebts = []

      // Primero usar deudas del onboarding
      if (onboardingData.debts && Array.isArray(onboardingData.debts) && onboardingData.debts.length > 0) {
        onboardingData.debts.forEach((debt: any, index: number) => {
          const balance = Number(debt.amount || 0)
          const payment = Number(debt.monthlyPayment || 0)
          
          if (balance > 0) {
            activeDebts.push({
              creditor: debt.name || `Deuda del Onboarding #${index + 1}`,
              balance: balance,
              payment: payment
            })
            totalDebtBalance += balance
            totalMonthlyDebtPayments += payment
          }
        })
      }

      // Si no hay deudas del onboarding, usar datos permanentes
      if (activeDebts.length === 0 && debts.length > 0) {
        debts.forEach(debt => {
          activeDebts.push({
            creditor: debt.creditor,
            balance: Number(debt.current_balance),
            payment: Number(debt.monthly_payment)
          })
          totalDebtBalance += Number(debt.current_balance)
          totalMonthlyDebtPayments += Number(debt.monthly_payment)
        })
      }

      // Fallback al summary
      if (totalDebtBalance === 0 && summary) {
        totalDebtBalance = Number(summary.total_debt || 0)
        totalMonthlyDebtPayments = Number(summary.monthly_debt_payments || 0)
      }

      // CALCULAR AHORROS Y METAS - Priorizar datos del onboarding
      let currentSavings = 0
      const activeGoals = []

      // Usar ahorros del onboarding
      if (onboardingData.currentSavings && onboardingData.currentSavings > 0) {
        currentSavings = Number(onboardingData.currentSavings)
      } else if (summary?.emergency_fund) {
        currentSavings = Number(summary.emergency_fund)
      }

      // Usar metas del onboarding
      if (onboardingData.financialGoals && Array.isArray(onboardingData.financialGoals) && onboardingData.financialGoals.length > 0) {
        onboardingData.financialGoals.forEach((goalTitle: string, index: number) => {
          const targetAmount = onboardingData.monthlySavingsCapacity ? onboardingData.monthlySavingsCapacity * 12 : 10000
          activeGoals.push({
            title: goalTitle,
            target: targetAmount,
            current: currentSavings,
            progress: targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0
          })
        })
      }

      // Si no hay metas del onboarding, usar datos permanentes
      if (activeGoals.length === 0 && goals.length > 0) {
        goals.forEach(goal => {
          activeGoals.push({
            title: goal.title,
            target: Number(goal.target_amount),
            current: Number(goal.current_amount),
            progress: goal.target_amount > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0
          })
        })
      }

      // Calcular capacidad de ahorro
      const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)

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
        lastCalculated: summary?.last_calculated || null,
        expenseCategories,
        incomeBreakdown,
        activeDebts,
        activeGoals
      }

      console.log('✅ Optimized financial data (PRIORIZING ONBOARDING):', {
        monthlyIncome,
        monthlyExpenses,
        totalDebtBalance,
        hasRealData,
        dataSources: {
          incomeFromOnboarding: onboardingData.monthlyIncome > 0,
          expensesFromOnboarding: Object.keys(onboardingData.expenseCategories || {}).length > 0,
          debtsFromOnboarding: (onboardingData.debts?.length || 0) > 0,
          goalsFromOnboarding: (onboardingData.financialGoals?.length || 0) > 0
        }
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
