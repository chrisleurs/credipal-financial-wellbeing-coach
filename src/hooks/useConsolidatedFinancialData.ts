
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useLoans } from './useLoans'

export interface ConsolidatedFinancialData {
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  savingsCapacity: number
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  hasRealData: boolean
  
  // Detailed breakdowns
  debts: Array<{
    id: string
    name: string
    creditor: string
    balance: number
    payment: number
    source: 'database' | 'kueski' | 'onboarding'
    interest_rate?: number
    current_balance: number
    monthly_payment: number
  }>
  
  expenseCategories: Record<string, number>
  activeGoals: Array<{
    id: string
    title: string
    target: number
    current: number
  }>
  
  financialGoals: string[]
}

export const useConsolidatedFinancialData = () => {
  const { user } = useAuth()
  const { loans, kueskiLoan } = useLoans()
  
  return useQuery({
    queryKey: ['consolidated-financial-data', user?.id],
    queryFn: async (): Promise<ConsolidatedFinancialData> => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      console.log('🔍 Consolidating financial data for user:', user.id)

      // Fetch all data in parallel
      const [
        profileData,
        incomesData,
        expensesData,
        debtsData,
        goalsData,
        onboardingExpensesData
      ] = await Promise.all([
        // Profile and onboarding data
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
          
        // Income sources
        supabase
          .from('income_sources')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true),
          
        // Recent expenses
        supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: false }),
          
        // Database debts
        supabase
          .from('debts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active'),
          
        // Goals
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active'),
          
        // Onboarding expenses for categorization
        supabase
          .from('onboarding_expenses')
          .select('*')
          .eq('user_id', user.id)
      ])

      // Process income data
      const monthlyIncome = incomesData.data?.reduce((sum, income) => {
        switch (income.frequency) {
          case 'weekly':
            return sum + (income.amount * 4)
          case 'biweekly':
            return sum + (income.amount * 2)
          case 'yearly':
            return sum + (income.amount / 12)
          default: // monthly
            return sum + income.amount
        }
      }, 0) || 0

      // Process expenses data (average from last 30 days)
      const monthlyExpenses = expensesData.data?.length ? 
        (expensesData.data.reduce((sum, expense) => sum + Number(expense.amount), 0) / 3) : 0

      // Create expense categories from both sources
      const expenseCategories: Record<string, number> = {}
      
      // From regular expenses
      expensesData.data?.forEach(expense => {
        const category = expense.category || 'Otros'
        expenseCategories[category] = (expenseCategories[category] || 0) + Number(expense.amount)
      })
      
      // From onboarding expenses
      onboardingExpensesData.data?.forEach(expense => {
        const category = expense.category || 'Otros'
        expenseCategories[category] = (expenseCategories[category] || 0) + Number(expense.amount)
      })

      // Consolidate all debts from different sources
      const consolidatedDebts: ConsolidatedFinancialData['debts'] = []
      
      // 1. Database debts
      debtsData.data?.forEach(debt => {
        consolidatedDebts.push({
          id: debt.id,
          name: debt.creditor,
          creditor: debt.creditor,
          balance: Number(debt.current_balance),
          payment: Number(debt.monthly_payment),
          source: 'database',
          interest_rate: debt.interest_rate,
          current_balance: Number(debt.current_balance),
          monthly_payment: Number(debt.monthly_payment)
        })
      })
      
      // 2. Kueski loan
      if (kueskiLoan) {
        consolidatedDebts.push({
          id: kueskiLoan.id,
          name: 'Préstamo Kueski',
          creditor: 'Kueski',
          balance: Number(kueskiLoan.amount),
          payment: Number(kueskiLoan.payment_amount) * 2, // Biweekly to monthly
          source: 'kueski',
          current_balance: Number(kueskiLoan.amount),
          monthly_payment: Number(kueskiLoan.payment_amount) * 2
        })
      }
      
      // 3. Onboarding debts from profile
      const onboardingData = profileData.data?.onboarding_data as any
      if (onboardingData?.debts && Array.isArray(onboardingData.debts)) {
        onboardingData.debts.forEach((debt: any, index: number) => {
          // Check if this debt is not already in database
          const existsInDb = consolidatedDebts.some(d => 
            d.creditor.toLowerCase().includes(debt.name?.toLowerCase() || '') ||
            debt.name?.toLowerCase().includes(d.creditor.toLowerCase() || '')
          )
          
          if (!existsInDb && debt.amount > 0) {
            consolidatedDebts.push({
              id: `onboarding-${index}`,
              name: debt.name || 'Deuda del onboarding',
              creditor: debt.name || 'Acreedor desconocido',
              balance: Number(debt.amount) || 0,
              payment: Number(debt.monthlyPayment) || 0,
              source: 'onboarding',
              current_balance: Number(debt.amount) || 0,
              monthly_payment: Number(debt.monthlyPayment) || 0
            })
          }
        })
      }

      // Calculate debt totals
      const totalDebtBalance = consolidatedDebts.reduce((sum, debt) => sum + debt.balance, 0)
      const totalMonthlyDebtPayments = consolidatedDebts.reduce((sum, debt) => sum + debt.payment, 0)

      // Process goals
      const activeGoals = goalsData.data?.map(goal => ({
        id: goal.id,
        title: goal.title,
        target: Number(goal.target_amount),
        current: Number(goal.current_amount)
      })) || []

      // Extract financial goals from onboarding
      const financialGoals = onboardingData?.goals || []

      // Calculate savings capacity
      const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments)

      // Determine if we have real data
      const hasRealData = monthlyIncome > 0 || monthlyExpenses > 0 || totalDebtBalance > 0 || 
                         activeGoals.length > 0 || Object.keys(expenseCategories).length > 0

      const result: ConsolidatedFinancialData = {
        monthlyIncome,
        monthlyExpenses,
        currentSavings: 0, // We don't track this separately yet
        savingsCapacity,
        totalDebtBalance,
        totalMonthlyDebtPayments,
        hasRealData,
        debts: consolidatedDebts,
        expenseCategories,
        activeGoals,
        financialGoals
      }

      console.log('📊 Consolidated Financial Data:', {
        monthlyIncome,
        monthlyExpenses,
        totalDebtBalance,
        debtsCount: consolidatedDebts.length,
        debtsBreakdown: consolidatedDebts.map(d => ({
          name: d.name,
          balance: d.balance,
          source: d.source
        })),
        hasRealData
      })

      return result
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}
