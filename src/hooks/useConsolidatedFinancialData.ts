
/**
 * Hook simplificado que usa el nuevo useConsolidatedData
 * Mantiene compatibilidad con código existente
 */

import { useConsolidatedData } from './useConsolidatedData'

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
  const { data: consolidatedData, isLoading, error } = useConsolidatedData()

  const data: ConsolidatedFinancialData | null = consolidatedData ? {
    monthlyIncome: consolidatedData.monthlyIncome,
    monthlyExpenses: consolidatedData.monthlyExpenses,
    currentSavings: consolidatedData.currentSavings,
    savingsCapacity: consolidatedData.savingsCapacity,
    hasRealData: consolidatedData.hasRealData,
    expenseCategories: consolidatedData.expenseCategories,
    debts: consolidatedData.debts.map((debt, index) => ({
      id: `debt-${index}`,
      name: debt.creditor,
      creditor: debt.creditor,
      balance: debt.balance,
      payment: debt.payment,
      source: debt.creditor.toLowerCase().includes('kueski') ? 'kueski' as const : 'onboarding' as const
    })),
    financialGoals: consolidatedData.financialGoals,
    totalDebtBalance: consolidatedData.totalDebtBalance,
    totalMonthlyDebtPayments: consolidatedData.totalMonthlyDebtPayments
  } : null

  return {
    data,
    consolidatedData: data,
    isLoading,
    error
  }
}
