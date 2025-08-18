
import { useMemo } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { ConsolidatedProfile } from '@/types/unified'

export const useConsolidatedProfile = () => {
  const { financialData, isOnboardingComplete } = useFinancialStore()

  const consolidatedProfile = useMemo((): ConsolidatedProfile => {
    const monthlyBalance = financialData.monthlyIncome - financialData.monthlyExpenses
    const totalDebtBalance = financialData.debts.reduce((sum, debt) => sum + debt.amount, 0)
    const totalMonthlyDebtPayments = financialData.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
    
    // Convert debts to expected format
    const formattedDebts = financialData.debts.map(debt => ({
      id: debt.id,
      creditor: debt.name,
      current_balance: debt.amount,
      monthly_payment: debt.monthlyPayment,
      annual_interest_rate: 0 // Default rate for onboarding debts
    }))
    
    return {
      userId: 'current-user',
      name: 'Usuario',
      monthlyIncome: financialData.monthlyIncome,
      extraIncome: financialData.extraIncome,
      monthlyExpenses: financialData.monthlyExpenses,
      monthlyBalance,
      currentSavings: financialData.currentSavings,
      totalDebtBalance,
      totalMonthlyDebtPayments,
      savingsCapacity: financialData.monthlySavingsCapacity,
      financialGoals: financialData.financialGoals,
      debts: formattedDebts,
      dataCompleteness: isOnboardingComplete ? 1 : 0.7
    }
  }, [financialData, isOnboardingComplete])

  const hasCompleteData = isOnboardingComplete && 
    financialData.monthlyIncome > 0 && 
    financialData.monthlyExpenses > 0

  return {
    consolidatedProfile,
    hasCompleteData,
    isLoading: false
  }
}
