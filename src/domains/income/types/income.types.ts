
/**
 * Income Domain Types - Tipos para gestión de ingresos
 */

import { Money, FrequencyType, RecurrencePattern } from '../../../shared/types/core.types'

export type IncomeType = 'salary' | 'freelance' | 'business' | 'investment' | 'rental' | 'other'

export interface IncomeSource {
  id: string
  userId: string
  sourceName: string
  type: IncomeType
  amount: Money
  frequency: FrequencyType
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface IncomeSummary {
  totalMonthlyIncome: Money
  totalAnnualIncome: Money
  sourceBreakdown: Array<{
    source: IncomeSource
    monthlyAmount: Money
    percentage: number
  }>
  stability: {
    score: number // 0-100, higher is more stable
    recurringPercentage: number
    volatility: number
  }
  trends: {
    monthOverMonth: number // percentage change
    yearOverYear: number // percentage change
  }
}
