
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData'
import { useAuth } from './useAuth'

interface ConsolidatedProfile {
  userId: string
  name: string
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  currentSavings: number
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  expenseCategories: Record<string, number>
  debts: Array<{
    id: string
    creditor: string
    current_balance: number
    monthly_payment: number
    annual_interest_rate: number
  }>
  goals: Array<{
    goal_name: string
    target_amount: number
    current_amount: number
    target_date: string
  }>
  savingsGoal: number
  dataCompleteness: number
}

export const useConsolidatedProfile = () => {
  const { user } = useAuth()
  const { data: financialData, isLoading, error } = useConsolidatedFinancialData()

  const consolidatedProfile: ConsolidatedProfile | null = financialData ? {
    userId: user?.id || '',
    name: user?.email?.split('@')[0] || 'Usuario',
    monthlyIncome: financialData.monthlyIncome,
    extraIncome: 0,
    monthlyExpenses: financialData.monthlyExpenses,
    monthlyBalance: financialData.savingsCapacity,
    currentSavings: financialData.currentSavings,
    totalDebtBalance: financialData.totalDebts,
    totalMonthlyDebtPayments: financialData.monthlyDebtPayments,
    expenseCategories: financialData.expenseCategories,
    debts: financialData.debts.map(debt => ({
      id: debt.id,
      creditor: debt.creditor,
      current_balance: debt.currentBalance,
      monthly_payment: debt.monthlyPayment,
      annual_interest_rate: 0 // Default value since it's not in our current data
    })),
    goals: [], // Empty for now since we don't have detailed goals structure
    savingsGoal: 0,
    dataCompleteness: calculateDataCompleteness(financialData)
  } : null

  const hasCompleteData = consolidatedProfile ? consolidatedProfile.dataCompleteness > 0.5 : false

  return {
    data: financialData,
    consolidatedProfile,
    hasCompleteData,
    isLoading,
    error
  }
}

function calculateDataCompleteness(data: any): number {
  let completedFields = 0
  let totalFields = 6

  if (data.monthlyIncome > 0) completedFields++
  if (data.monthlyExpenses > 0) completedFields++
  if (data.currentSavings >= 0) completedFields++
  if (Object.keys(data.expenseCategories).length > 0) completedFields++
  if (data.debts.length > 0) completedFields++
  if (data.financialGoals.length > 0) completedFields++

  return completedFields / totalFields
}
