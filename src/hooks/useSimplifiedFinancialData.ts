
import { useFinancialSummary } from './useFinancialSummary'
import { useAuth } from './useAuth'
import { useMemo } from 'react'

export interface SimplifiedFinancialData {
  // Core metrics from financial_summary (always up-to-date via triggers)
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  savingsCapacity: number
  totalDebt: number
  monthlyDebtPayments: number
  emergencyFund: number
  
  // Calculated metrics
  debtToIncomeRatio: number
  savingsRate: number
  emergencyFundMonths: number
  
  // Status indicators
  hasData: boolean
  isHealthy: boolean
  lastUpdated: string | null
}

export const useSimplifiedFinancialData = () => {
  const { user } = useAuth()
  const { financialSummary, isLoading, error, recalculate, isRecalculating } = useFinancialSummary()

  const simplifiedData = useMemo((): SimplifiedFinancialData | null => {
    if (!financialSummary || !user) return null

    const monthlyBalance = financialSummary.total_monthly_income - financialSummary.total_monthly_expenses
    const debtToIncomeRatio = financialSummary.total_monthly_income > 0 
      ? (financialSummary.monthly_debt_payments / financialSummary.total_monthly_income) * 100 
      : 0
    const savingsRate = financialSummary.total_monthly_income > 0 
      ? (financialSummary.savings_capacity / financialSummary.total_monthly_income) * 100 
      : 0
    const emergencyFundMonths = financialSummary.total_monthly_expenses > 0 
      ? financialSummary.emergency_fund / financialSummary.total_monthly_expenses 
      : 0

    return {
      monthlyIncome: financialSummary.total_monthly_income,
      monthlyExpenses: financialSummary.total_monthly_expenses,
      monthlyBalance,
      savingsCapacity: financialSummary.savings_capacity,
      totalDebt: financialSummary.total_debt,
      monthlyDebtPayments: financialSummary.monthly_debt_payments,
      emergencyFund: financialSummary.emergency_fund,
      
      debtToIncomeRatio,
      savingsRate,
      emergencyFundMonths,
      
      hasData: financialSummary.total_monthly_income > 0 || financialSummary.total_monthly_expenses > 0,
      isHealthy: monthlyBalance > 0 && debtToIncomeRatio < 40,
      lastUpdated: financialSummary.last_calculated
    }
  }, [financialSummary, user])

  return {
    data: simplifiedData,
    isLoading,
    error,
    recalculate,
    isRecalculating,
    // Convenience flags
    hasRealData: simplifiedData?.hasData || false,
    isFinanciallyHealthy: simplifiedData?.isHealthy || false
  }
}
