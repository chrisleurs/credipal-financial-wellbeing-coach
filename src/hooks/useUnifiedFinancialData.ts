
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export interface UnifiedFinancialData {
  // Datos básicos del usuario
  userId: string
  userProfile: {
    firstName: string | null
    lastName: string | null
    email: string | null
  }
  
  // Datos financieros del onboarding
  monthlyIncome: number
  extraIncome: number
  totalMonthlyIncome: number
  
  monthlyExpenses: number
  expenseCategories: Record<string, number>
  
  currentSavings: number
  monthlySavingsCapacity: number
  
  debts: Array<{
    id: string
    name: string
    amount: number
    monthlyPayment: number
  }>
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  
  financialGoals: string[]
  
  // Cálculos derivados
  monthlyBalance: number
  availableCashFlow: number
  netWorth: number
  
  // Estado del onboarding
  isOnboardingComplete: boolean
  hasFinancialData: boolean
  
  // Metadatos
  lastUpdated: string | null
}

// Interfaz para el onboarding data con tipado correcto
interface OnboardingData {
  monthlyIncome?: number
  extraIncome?: number
  monthlyExpenses?: number
  currentSavings?: number
  monthlySavingsCapacity?: number
  expenseCategories?: Record<string, number>
  debts?: Array<{
    id?: string
    name?: string
    creditor?: string
    amount?: number
    current_balance?: number
    monthlyPayment?: number
    monthly_payment?: number
  }>
  financialGoals?: string[]
}

export const useUnifiedFinancialData = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['unified-financial-data', user?.id],
    queryFn: async (): Promise<UnifiedFinancialData> => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado')
      }

      // 1. Obtener perfil del usuario con datos del onboarding
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        throw profileError
      }

      // 2. Extraer datos del onboarding con type casting correcto
      const onboardingData: OnboardingData = (profile?.onboarding_data as OnboardingData) || {}
      
      // 3. Obtener datos consolidados de las tablas principales (solo como respaldo)
      const [incomesResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        supabase.from('income_sources').select('*').eq('user_id', user.id).eq('is_active', true),
        supabase.from('expenses').select('*').eq('user_id', user.id).gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        supabase.from('debts').select('*').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('goals').select('*').eq('user_id', user.id).eq('status', 'active')
      ])

      const incomes = incomesResult.data || []
      const expenses = expensesResult.data || []
      const dbDebts = debtsResult.data || []
      const goals = goalsResult.data || []

      // 4. Priorizar datos del onboarding sobre datos de BD
      const monthlyIncome = onboardingData.monthlyIncome || incomes.reduce((sum, income) => {
        switch (income.frequency) {
          case 'monthly': return sum + income.amount
          case 'biweekly': return sum + (income.amount * 2)
          case 'weekly': return sum + (income.amount * 4)
          case 'yearly': return sum + (income.amount / 12)
          default: return sum + income.amount
        }
      }, 0)

      const extraIncome = onboardingData.extraIncome || 0
      const totalMonthlyIncome = monthlyIncome + extraIncome

      const monthlyExpenses = onboardingData.monthlyExpenses || expenses.reduce((sum, expense) => sum + expense.amount, 0)
      
      const expenseCategories = onboardingData.expenseCategories || expenses.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {})

      const currentSavings = onboardingData.currentSavings || 0
      const monthlySavingsCapacity = onboardingData.monthlySavingsCapacity || 0

      // 5. Procesar deudas (priorizar onboarding)
      const onboardingDebts = onboardingData.debts || []
      const debts = onboardingDebts.length > 0 ? onboardingDebts.map((debt: any) => ({
        id: debt.id || `onboarding-${Math.random()}`,
        name: debt.name || debt.creditor || 'Deuda',
        amount: debt.amount || debt.current_balance || 0,
        monthlyPayment: debt.monthlyPayment || debt.monthly_payment || 0
      })) : dbDebts.map(debt => ({
        id: debt.id,
        name: debt.creditor,
        amount: debt.current_balance,
        monthlyPayment: debt.monthly_payment
      }))

      const totalDebtBalance = debts.reduce((sum, debt) => sum + debt.amount, 0)
      const totalMonthlyDebtPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

      // 6. Procesar metas financieras
      const financialGoals = onboardingData.financialGoals || goals.map(goal => goal.title) || []

      // 7. Calcular métricas derivadas
      const monthlyBalance = totalMonthlyIncome - monthlyExpenses
      const availableCashFlow = monthlyBalance - totalMonthlyDebtPayments
      const netWorth = currentSavings + (monthlySavingsCapacity * 12)

      // 8. Verificar si hay datos reales del onboarding
      const hasFinancialData = monthlyIncome > 0 || monthlyExpenses > 0 || debts.length > 0 || currentSavings > 0

      return {
        userId: user.id,
        userProfile: {
          firstName: profile?.first_name || user.user_metadata?.first_name || null,
          lastName: profile?.last_name || user.user_metadata?.last_name || null,
          email: profile?.email || user.email || null
        },
        
        monthlyIncome,
        extraIncome,
        totalMonthlyIncome,
        
        monthlyExpenses,
        expenseCategories,
        
        currentSavings,
        monthlySavingsCapacity,
        
        debts,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        
        financialGoals,
        
        monthlyBalance,
        availableCashFlow,
        netWorth,
        
        isOnboardingComplete: profile?.onboarding_completed || false,
        hasFinancialData,
        
        lastUpdated: profile?.updated_at || null
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  })
}
