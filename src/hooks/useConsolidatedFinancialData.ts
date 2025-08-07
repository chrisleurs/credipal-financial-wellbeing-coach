
import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { useFinancialData } from './useFinancialData'
import { useUserFinancialData } from './useUserFinancialData'
import { useDebts } from './useDebts'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface ConsolidatedUserProfile {
  // Basic info
  userId: string
  name: string
  
  // Financial overview
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  
  // Detailed breakdown
  expenseCategories: Record<string, number>
  totalExpensesByCategory: Record<string, number>
  
  // Debts information
  debts: Array<{
    id: string
    creditor_name: string
    total_amount: number
    current_balance: number
    annual_interest_rate: number
    minimum_payment: number
    due_day: number
  }>
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  
  // Goals
  goals: Array<{
    id: string
    goal_name: string
    target_amount: number
    current_amount: number
    target_date: string
    status: string
    priority: string
  }>
  
  // Savings
  currentSavings: number
  monthlySavingsCapacity: number
  savingsGoal: number
  emergencyFundGoal: number
  
  // Data quality indicators
  hasOnboardingData: boolean
  hasRealFinancialData: boolean
  hasDebtsData: boolean
  hasGoalsData: boolean
  dataCompleteness: number
}

export const useConsolidatedFinancialData = () => {
  const { user } = useAuth()
  const { financialDataRecord } = useFinancialData()
  const { userFinancialData } = useUserFinancialData()
  const { debts } = useDebts()

  // Fetch goals
  const { data: goals = [] } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching goals:', error)
        return []
      }
      
      return data || []
    },
    enabled: !!user?.id,
  })

  // Fetch user profile for name
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      
      return data
    },
    enabled: !!user?.id,
  })

  const consolidatedProfile = useMemo((): ConsolidatedUserProfile | null => {
    if (!user) return null

    console.log('🔄 Consolidating financial data for user:', user.id)
    console.log('📊 Available data sources:')
    console.log('  - userFinancialData:', userFinancialData)
    console.log('  - financialDataRecord:', financialDataRecord)
    console.log('  - debts:', debts)
    
    // Basic info
    const name = profile?.first_name || 'Usuario'
    
    // Income data - prioritize user_financial_data (onboarding) over financial_data
    const monthlyIncome = userFinancialData?.ingresos || financialDataRecord?.monthly_income || 0
    const extraIncome = userFinancialData?.ingresos_extras || 0
    
    console.log('💰 Income calculated:', { monthlyIncome, extraIncome })
    
    // Expenses - calculate from categorized expenses if available
    let monthlyExpenses = 0
    let expenseCategories: Record<string, number> = {}
    let totalExpensesByCategory: Record<string, number> = {}
    
    if (userFinancialData?.gastos_categorizados && Array.isArray(userFinancialData.gastos_categorizados)) {
      console.log('💸 Processing categorized expenses:', userFinancialData.gastos_categorizados)
      
      userFinancialData.gastos_categorizados.forEach((expense: any) => {
        const category = expense.category || 'Other'
        const subcategory = expense.subcategory || category
        const amount = expense.amount || 0
        
        monthlyExpenses += amount
        expenseCategories[subcategory] = amount
        totalExpensesByCategory[category] = (totalExpensesByCategory[category] || 0) + amount
      })
    } else if (financialDataRecord?.monthly_expenses) {
      monthlyExpenses = financialDataRecord.monthly_expenses
      // Create a generic category for display
      expenseCategories['Gastos generales'] = financialDataRecord.monthly_expenses
      totalExpensesByCategory['Gastos generales'] = financialDataRecord.monthly_expenses
    }
    
    console.log('💸 Expenses calculated:', { monthlyExpenses, expenseCategories, totalExpensesByCategory })
    
    // Calculate monthly balance
    const totalIncome = monthlyIncome + extraIncome
    const monthlyBalance = totalIncome - monthlyExpenses
    
    // Debts processing - prioritize onboarding data from userFinancialData
    let processedDebts: Array<{
      id: string
      creditor_name: string
      total_amount: number
      current_balance: number
      annual_interest_rate: number
      minimum_payment: number
      due_day: number
    }> = []
    
    let totalDebtBalance = 0
    let totalMonthlyDebtPayments = 0
    
    // First check for real debts from the debts table
    if (debts && debts.length > 0) {
      processedDebts = debts.map(debt => ({
        id: debt.id,
        creditor_name: debt.creditor_name,
        total_amount: debt.total_amount,
        current_balance: debt.current_balance,
        annual_interest_rate: debt.annual_interest_rate,
        minimum_payment: debt.minimum_payment,
        due_day: debt.due_day,
      }))
      totalDebtBalance = debts.reduce((sum, debt) => sum + (debt.current_balance || 0), 0)
      totalMonthlyDebtPayments = debts.reduce((sum, debt) => sum + (debt.minimum_payment || 0), 0)
    } else if (userFinancialData?.deudas && Array.isArray(userFinancialData.deudas) && userFinancialData.deudas.length > 0) {
      // Use onboarding debts data if no real debts exist
      console.log('🏦 Processing onboarding debts:', userFinancialData.deudas)
      
      processedDebts = userFinancialData.deudas.map((debt: any, index: number) => ({
        id: `onboarding-debt-${index}`,
        creditor_name: debt.name || debt.creditor_name || `Deuda ${index + 1}`,
        total_amount: debt.amount || debt.total_amount || 0,
        current_balance: debt.amount || debt.current_balance || 0,
        annual_interest_rate: debt.interest_rate || debt.annual_interest_rate || 0,
        minimum_payment: debt.monthly_payment || debt.minimum_payment || 0,
        due_day: debt.due_day || 1,
      }))
      
      totalDebtBalance = processedDebts.reduce((sum, debt) => sum + debt.current_balance, 0)
      totalMonthlyDebtPayments = processedDebts.reduce((sum, debt) => sum + debt.minimum_payment, 0)
    }
    
    console.log('🏦 Debts calculated:', { processedDebts, totalDebtBalance, totalMonthlyDebtPayments })
    
    // Savings data
    let currentSavings = 0
    let monthlySavingsCapacity = 0
    
    if (userFinancialData?.ahorros && typeof userFinancialData.ahorros === 'object') {
      const ahorros = userFinancialData.ahorros as any
      currentSavings = ahorros.actual || 0
      monthlySavingsCapacity = ahorros.mensual || 0
    }
    
    // If no monthly savings capacity defined, estimate from balance
    if (monthlySavingsCapacity === 0 && monthlyBalance > 0) {
      monthlySavingsCapacity = Math.max(monthlyBalance * 0.1, 50) // At least 10% or $50
    }
    
    const savingsGoal = financialDataRecord?.savings_goal || currentSavings * 2
    const emergencyFundGoal = financialDataRecord?.emergency_fund_goal || monthlyExpenses * 6
    
    // Data quality assessment
    const hasOnboardingData = !!(userFinancialData && (monthlyIncome > 0 || monthlyExpenses > 0))
    const hasRealFinancialData = !!(financialDataRecord && financialDataRecord.monthly_income > 0)
    const hasDebtsData = processedDebts.length > 0
    const hasGoalsData = goals.length > 0
    
    const dataCompleteness = [
      hasOnboardingData,
      hasRealFinancialData || hasOnboardingData, // Accept either source
      true, // Always have basic user data
      monthlyExpenses > 0 || monthlyIncome > 0,
    ].filter(Boolean).length / 4 * 100
    
    const consolidatedData: ConsolidatedUserProfile = {
      userId: user.id,
      name,
      monthlyIncome,
      extraIncome,
      monthlyExpenses,
      monthlyBalance,
      expenseCategories,
      totalExpensesByCategory,
      debts: processedDebts,
      totalDebtBalance,
      totalMonthlyDebtPayments,
      goals: goals.map(goal => ({
        id: goal.id,
        goal_name: goal.goal_name,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        target_date: goal.target_date || '',
        status: goal.status,
        priority: goal.priority,
      })),
      currentSavings,
      monthlySavingsCapacity,
      savingsGoal,
      emergencyFundGoal,
      hasOnboardingData,
      hasRealFinancialData,
      hasDebtsData,
      hasGoalsData,
      dataCompleteness,
    }
    
    console.log('✅ Final consolidated financial profile:', {
      userId: consolidatedData.userId,
      name: consolidatedData.name,
      monthlyIncome: consolidatedData.monthlyIncome,
      monthlyExpenses: consolidatedData.monthlyExpenses,
      monthlyBalance: consolidatedData.monthlyBalance,
      totalDebts: consolidatedData.totalDebtBalance,
      expenseCategoriesCount: Object.keys(consolidatedData.expenseCategories).length,
      debtsCount: consolidatedData.debts.length,
      goalsCount: consolidatedData.goals.length,
      dataCompleteness: consolidatedData.dataCompleteness + '%'
    })
    
    return consolidatedData
    
  }, [user, profile, userFinancialData, financialDataRecord, debts, goals])

  return {
    consolidatedProfile,
    isLoading: !user || consolidatedProfile === null,
    hasCompleteData: consolidatedProfile ? consolidatedProfile.dataCompleteness >= 75 : false,
  }
}
