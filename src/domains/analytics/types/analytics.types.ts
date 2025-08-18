
/**
 * Analytics Domain Types - Tipos para análisis y reportes
 */

import { Money } from '../../../shared/types/core.types'

export interface FinancialSummary {
  id: string
  userId: string
  totalMonthlyIncome: Money
  totalMonthlyExpenses: Money
  totalDebt: Money
  monthlyDebtPayments: Money
  savingsCapacity: Money
  emergencyFund: Money
  lastCalculated: string
  updatedAt: string
}

export interface FinancialHealth {
  score: number // 0-100
  debtToIncomeRatio: number
  savingsRate: number
  emergencyFundMonths: number
  status: 'poor' | 'fair' | 'good' | 'excellent'
}
