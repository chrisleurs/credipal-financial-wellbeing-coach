
/**
 * Income Domain Types - Income sources and tracking
 */

import { Money, Currency } from '../../core/money'
import { FrequencyType, RecurrencePattern } from '../../core/dates'

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

export interface RecurringIncome {
  id: string
  incomeSourceId: string
  userId: string
  amount: Money
  recurrence: RecurrencePattern
  nextPaymentDate: string
  isActive: boolean
  createdAt: string
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
