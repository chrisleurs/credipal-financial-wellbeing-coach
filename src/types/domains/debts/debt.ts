
/**
 * Debt Domain Types - Unified debt management (FINAL VERSION)
 */

import { Money } from '../../core/money'
import { DateRange, RecurrencePattern } from '../../core/dates'

export type DebtStatus = 'active' | 'paid' | 'delinquent'
export type DebtPriority = 'high' | 'medium' | 'low'
export type DebtStrategyType = 'snowball' | 'avalanche' | 'minimum'

export interface Debt {
  id: string
  userId: string
  creditor: string
  originalAmount: Money
  currentBalance: Money
  monthlyPayment: Money
  interestRate: number // Annual percentage rate
  dueDate: string // ISO date string
  status: DebtStatus
  priority: DebtPriority
  description?: string
  createdAt: string
  updatedAt: string
}

export interface DebtPayment {
  id: string
  debtId: string
  userId: string
  amount: Money
  paymentDate: string
  notes?: string
  createdAt: string
}

export interface DebtProjection {
  debt: Debt
  monthsToPayoff: number
  totalInterestPaid: Money
  payoffDate: string
  totalPayments: Money
}

export interface DebtSummary {
  totalDebt: Money
  monthlyPayments: Money
  totalInterestPaid: Money
  averageInterestRate: number
  payoffProjection: Date
  debts: Debt[]
}

export interface DebtStrategy {
  id: string
  userId: string
  strategyType: DebtStrategyType
  prioritizedDebts: string[] // Array of debt IDs in order
  projectedPayoffDate: string
  totalInterestSaved: Money
  createdAt: string
}

// Utility types for onboarding
export interface OnboardingDebt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}
