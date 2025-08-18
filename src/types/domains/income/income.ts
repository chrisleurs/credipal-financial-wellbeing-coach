
/**
 * Income Domain Types - Unified income management
 */

import { Money, FrequencyType } from '../../core'

export interface IncomeSource {
  id: string
  userId: string
  sourceName: string
  amount: Money
  frequency: FrequencyType
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface IncomeProjection {
  source: IncomeSource
  monthlyAmount: Money
  annualAmount: Money
}

export interface IncomeSummary {
  totalMonthly: Money
  totalAnnual: Money
  sources: IncomeSource[]
  projections: IncomeProjection[]
}

// Utility types for onboarding
export interface OnboardingIncome {
  monthlyAmount: number
  extraIncome: number
  sources: Array<{
    name: string
    amount: number
    frequency: FrequencyType
  }>
}
