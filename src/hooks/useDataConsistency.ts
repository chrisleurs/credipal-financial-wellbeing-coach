
import React from 'react'
import { useFinancial } from './useFinancial'
import { useUserFinancialData } from './useUserFinancialData'
import { useFinancialStore } from '@/store/financialStore'

export interface ConsistentFinancialData {
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  savingsGoal: number
  emergencyFundGoal: number
  hasRealData: boolean
  dataSource: 'database' | 'onboarding' | 'mock'
}

export const useDataConsistency = (): ConsistentFinancialData => {
  const { data: dbData, hasRealData: hasDbData } = useFinancial()
  const { userFinancialData } = useUserFinancialData()
  const { financialData: onboardingData, isOnboardingComplete } = useFinancialStore()

  return React.useMemo(() => {
    // Priority: Real database data > Onboarding data > Mock data
    if (hasDbData && dbData.monthly_income > 0) {
      return {
        monthlyIncome: dbData.monthly_income,
        monthlyExpenses: dbData.monthly_expenses,
        currentSavings: dbData.current_savings,
        savingsGoal: dbData.savings_goal,
        emergencyFundGoal: dbData.emergency_fund_goal,
        hasRealData: true,
        dataSource: 'database'
      }
    }

    if (isOnboardingComplete && onboardingData.monthlyIncome > 0) {
      return {
        monthlyIncome: onboardingData.monthlyIncome,
        monthlyExpenses: onboardingData.monthlyExpenses,
        currentSavings: onboardingData.currentSavings,
        savingsGoal: onboardingData.currentSavings, // Use as goal temporarily
        emergencyFundGoal: onboardingData.monthlySavingsCapacity * 6, // 6 months
        hasRealData: true,
        dataSource: 'onboarding'
      }
    }

    if (userFinancialData) {
      const monthlyExpenses = userFinancialData.gastos_categorizados?.reduce(
        (sum: number, gasto: any) => sum + (gasto.amount || 0), 0
      ) || 0

      return {
        monthlyIncome: userFinancialData.ingresos || 0,
        monthlyExpenses,
        currentSavings: userFinancialData.ahorros?.actual || 0,
        savingsGoal: userFinancialData.ahorros?.mensual * 12 || 0,
        emergencyFundGoal: monthlyExpenses * 6,
        hasRealData: userFinancialData.ingresos > 0,
        dataSource: 'database'
      }
    }

    // Fallback to mock data
    return {
      monthlyIncome: 4000,
      monthlyExpenses: 2800,
      currentSavings: 1500,
      savingsGoal: 10000,
      emergencyFundGoal: 15000,
      hasRealData: false,
      dataSource: 'mock'
    }
  }, [dbData, userFinancialData, onboardingData, hasDbData, isOnboardingComplete])
}
