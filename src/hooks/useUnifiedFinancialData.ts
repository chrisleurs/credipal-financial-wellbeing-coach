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
  
  // Deudas combinadas: onboarding + Kueski + otras deudas de BD
  debts: Array<{
    id: string
    name: string
    creditor: string
    amount: number
    monthlyPayment: number
    source: 'onboarding' | 'kueski' | 'database'
    isKueski?: boolean
  }>
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  
  // Metas financieras del onboarding + metas de BD
  financialGoals: Array<{
    id: string
    title: string
    targetAmount: number
    currentAmount: number
    progress: number
    source: 'onboarding' | 'database'
  }>
  
  // Préstamos Kueski
  kueskiLoan: {
    id: string
    lender: string
    amount: number
    paymentAmount: number
    remainingPayments: number
    totalPayments: number
    nextPaymentDate: string
    status: string
  } | null
  
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

      console.log('🔍 Fetching unified financial data for user:', user.id)

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

      console.log('👤 Profile data:', profile)

      // 2. Obtener préstamo de Kueski
      console.log('🏦 Fetching Kueski loan...')
      const { data: kueskiLoanData } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id)
        .eq('lender', 'Kueski')
        .eq('status', 'active')
        .single()

      // 3. Obtener todas las deudas de la BD
      console.log('💳 Fetching database debts...')
      const { data: dbDebts } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      // 4. Obtener gastos del onboarding que podrían ser deudas
      console.log('📋 Fetching onboarding expenses...')
      const { data: onboardingExpenses } = await supabase
        .from('onboarding_expenses')
        .select('*')
        .eq('user_id', user.id)

      // 5. Obtener metas de la BD
      console.log('🎯 Fetching database goals...')
      const { data: dbGoals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      // 6. Extraer datos del onboarding
      const onboardingData: OnboardingData = (profile?.onboarding_data as OnboardingData) || {}
      
      console.log('📊 Raw onboarding data:', onboardingData)

      // 7. Procesar datos financieros básicos
      const monthlyIncome = onboardingData.monthlyIncome || 0
      const extraIncome = onboardingData.extraIncome || 0
      const totalMonthlyIncome = monthlyIncome + extraIncome
      const monthlyExpenses = onboardingData.monthlyExpenses || 0
      const expenseCategories = onboardingData.expenseCategories || {}
      const currentSavings = onboardingData.currentSavings || 0
      const monthlySavingsCapacity = onboardingData.monthlySavingsCapacity || 0

      // 8. Procesar deudas combinadas con MEJOR LOGGING
      const combinedDebts = []

      console.log('💰 Processing debts...')

      // DEUDAS DEL ONBOARDING JSON (las más importantes)
      if (onboardingData.debts && Array.isArray(onboardingData.debts) && onboardingData.debts.length > 0) {
        console.log('📋 Found onboarding debts in JSON:', onboardingData.debts)
        onboardingData.debts.forEach((debt: any, index: number) => {
          console.log(`Processing onboarding debt ${index + 1}:`, debt)
          
          const debtEntry = {
            id: debt.id || `onboarding-debt-${index}`,
            name: debt.name || debt.creditor || 'Deuda del Onboarding',
            creditor: debt.creditor || debt.name || 'Acreedor',
            amount: debt.amount || debt.current_balance || 0,
            monthlyPayment: debt.monthlyPayment || debt.monthly_payment || 0,
            source: 'onboarding' as const,
            isKueski: false
          }
          
          console.log('✅ Added onboarding debt:', debtEntry)
          combinedDebts.push(debtEntry)
        })
      } else {
        console.log('❌ No debts found in onboarding JSON data')
      }

      // DEUDAS DE ONBOARDING_EXPENSES (gastos categorizados como deudas)
      if (onboardingExpenses && onboardingExpenses.length > 0) {
        console.log('💳 Found onboarding expenses:', onboardingExpenses.length)
        onboardingExpenses.forEach(expense => {
          // Categorías que consideramos deudas
          const debtCategories = [
            'Bills & Services', 
            'Deudas', 
            'Tarjetas de Crédito', 
            'Préstamos', 
            'Créditos',
            'Credit Cards',
            'Loans'
          ]
          
          const isDebtCategory = debtCategories.some(cat => 
            expense.category.toLowerCase().includes(cat.toLowerCase()) ||
            expense.subcategory?.toLowerCase().includes(cat.toLowerCase())
          )
          
          if (isDebtCategory) {
            const debtEntry = {
              id: `onboarding-expense-${expense.id}`,
              name: expense.subcategory || expense.category,
              creditor: expense.subcategory || expense.category,
              amount: expense.amount,
              monthlyPayment: expense.amount, // Asumimos que es un pago mensual
              source: 'onboarding' as const,
              isKueski: false
            }
            
            console.log('✅ Added expense as debt:', debtEntry)
            combinedDebts.push(debtEntry)
          }
        })
      }

      // Préstamo Kueski como deuda
      if (kueskiLoanData) {
        console.log('🏦 Adding Kueski loan as debt:', kueskiLoanData)
        combinedDebts.push({
          id: kueskiLoanData.id,
          name: 'Préstamo Kueski',
          creditor: 'Kueski',
          amount: kueskiLoanData.amount,
          monthlyPayment: kueskiLoanData.payment_amount * 2, // Quincenal a mensual
          source: 'kueski' as const,
          isKueski: true
        })
      }

      // Otras deudas de la BD
      if (dbDebts && dbDebts.length > 0) {
        console.log('💾 Adding database debts:', dbDebts.length)
        dbDebts.forEach(debt => {
          combinedDebts.push({
            id: debt.id,
            name: debt.creditor,
            creditor: debt.creditor,
            amount: debt.current_balance,
            monthlyPayment: debt.monthly_payment,
            source: 'database' as const,
            isKueski: false
          })
        })
      }

      console.log('💳 FINAL Combined debts:', combinedDebts)

      const totalDebtBalance = combinedDebts.reduce((sum, debt) => sum + debt.amount, 0)
      const totalMonthlyDebtPayments = combinedDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

      console.log('💰 Total debt balance:', totalDebtBalance)
      console.log('💸 Total monthly payments:', totalMonthlyDebtPayments)

      // 9. Procesar metas financieras combinadas
      const combinedGoals = []

      // Metas del onboarding
      if (onboardingData.financialGoals && onboardingData.financialGoals.length > 0) {
        onboardingData.financialGoals.forEach((goalTitle: string, index: number) => {
          combinedGoals.push({
            id: `onboarding-goal-${index}`,
            title: goalTitle,
            targetAmount: monthlySavingsCapacity * 12, // Estimación
            currentAmount: currentSavings,
            progress: currentSavings > 0 ? (currentSavings / (monthlySavingsCapacity * 12)) * 100 : 0,
            source: 'onboarding' as const
          })
        })
      }

      // Metas de la BD
      if (dbGoals && dbGoals.length > 0) {
        dbGoals.forEach(goal => {
          combinedGoals.push({
            id: goal.id,
            title: goal.title,
            targetAmount: goal.target_amount,
            currentAmount: goal.current_amount,
            progress: goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0,
            source: 'database' as const
          })
        })
      }

      console.log('🎯 Combined goals:', combinedGoals)

      // 10. Calcular métricas derivadas
      const monthlyBalance = totalMonthlyIncome - monthlyExpenses
      const availableCashFlow = monthlyBalance - totalMonthlyDebtPayments
      const netWorth = currentSavings - totalDebtBalance

      // 11. Verificar si hay datos reales del onboarding
      const hasFinancialData = monthlyIncome > 0 || monthlyExpenses > 0 || combinedDebts.length > 0 || currentSavings > 0

      const result = {
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
        
        debts: combinedDebts,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        
        financialGoals: combinedGoals,
        
        kueskiLoan: kueskiLoanData ? {
          id: kueskiLoanData.id,
          lender: kueskiLoanData.lender,
          amount: kueskiLoanData.amount,
          paymentAmount: kueskiLoanData.payment_amount,
          remainingPayments: kueskiLoanData.remaining_payments,
          totalPayments: kueskiLoanData.total_payments,
          nextPaymentDate: kueskiLoanData.next_payment_date,
          status: kueskiLoanData.status
        } : null,
        
        monthlyBalance,
        availableCashFlow,
        netWorth,
        
        isOnboardingComplete: profile?.onboarding_completed || false,
        hasFinancialData,
        
        lastUpdated: profile?.updated_at || null
      }

      console.log('🎉 FINAL unified financial data:', result)
      return result
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  })
}
