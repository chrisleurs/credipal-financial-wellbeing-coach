
/**
 * Debt Domain Types - Tipos unificados para gestión de deudas
 */

import { Money, Status, Priority } from '../../../shared/types/core.types'
import { UserScopedRecord } from '../../../shared/types/database.types'

export type DebtStatus = 'active' | 'paid' | 'delinquent'
export type DebtPriority = 'high' | 'medium' | 'low'
export type DebtStrategyType = 'snowball' | 'avalanche' | 'minimum'

// Unified domain type (using snake_case to match components)
export interface Debt {
  id: string
  user_id: string
  creditor: string
  original_amount: number
  current_balance: number
  monthly_payment: number
  interest_rate: number // Annual percentage rate
  due_date?: string // ISO date string
  status: DebtStatus
  priority?: DebtPriority
  description?: string
  created_at: string
  updated_at: string
}

// Database type (snake_case)
export interface DatabaseDebt extends UserScopedRecord {
  creditor: string
  original_amount: number
  current_balance: number
  monthly_payment: number
  interest_rate: number
  due_date?: string
  status: DebtStatus
}

export interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  amount: number
  payment_date: string
  notes?: string
  created_at: string
}

export interface DebtSummary {
  totalDebt: number
  monthlyPayments: number
  totalInterestPaid: number
  averageInterestRate: number
  payoffProjection: Date
  debts: Debt[]
}

// Legacy compatibility types
export interface LegacyDebt {
  id: string
  user_id: string
  creditor_name: string
  total_amount: number
  current_balance: number
  annual_interest_rate: number
  minimum_payment: number
  due_day?: number
  description?: string
  created_at: string
  updated_at: string
}

// Onboarding types
export interface OnboardingDebt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}
