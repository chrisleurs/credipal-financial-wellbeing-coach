
import { useOptimizedFinancialData } from './useOptimizedFinancialData'

export interface ConsolidatedFinancialData {
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  savingsCapacity: number
  hasRealData: boolean
  expenseCategories: Record<string, number>
  debts: Array<{ 
    id: string
    name: string
    creditor: string; 
    balance: number; 
    payment: number;
    source: 'onboarding' | 'kueski' | 'database'
  }>
  financialGoals: string[]
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
}

export const useConsolidatedFinancialData = () => {
  const { data: optimizedData, isLoading, error } = useOptimizedFinancialData()

  const consolidatedData: ConsolidatedFinancialData | null = optimizedData ? {
    monthlyIncome: optimizedData.monthlyIncome,
    monthlyExpenses: optimizedData.monthlyExpenses,
    currentSavings: optimizedData.currentSavings,
    savingsCapacity: optimizedData.savingsCapacity,
    hasRealData: optimizedData.hasRealData,
    expenseCategories: optimizedData.expenseCategories,
    debts: optimizedData.activeDebts.map((debt, index) => ({
      id: `debt-${index}`,
      name: debt.creditor,
      creditor: debt.creditor,
      balance: debt.balance,
      payment: debt.payment,
      source: 'onboarding' as const
    })),
    financialGoals: optimizedData.activeGoals.map(goal => goal.title),
    totalDebtBalance: optimizedData.totalDebtBalance,
    totalMonthlyDebtPayments: optimizedData.totalMonthlyDebtPayments
  } : null

  return {
    data: consolidatedData,
    consolidatedData,
    isLoading,
    error
  }
}
