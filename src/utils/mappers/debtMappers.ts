
/**
 * Debt Mappers - Bidirectional conversion between domain and database types
 */

import { Debt, OnboardingDebt } from '../../types/domains/debts'
import { createMoney } from '../../types/core'

// Database type (from Supabase)
type DatabaseDebt = {
  id: string
  user_id: string
  creditor: string
  original_amount: number
  current_balance: number
  monthly_payment: number
  interest_rate: number
  due_date?: string
  status: 'active' | 'paid' | 'delinquent'
  created_at: string
  updated_at: string
}

// Legacy type conversion (for backward compatibility)
type LegacyDebt = {
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

/**
 * Convert from database format to unified domain type
 */
export const fromDatabaseDebt = (dbDebt: DatabaseDebt): Debt => ({
  id: dbDebt.id,
  userId: dbDebt.user_id,
  creditor: dbDebt.creditor,
  originalAmount: createMoney(dbDebt.original_amount),
  currentBalance: createMoney(dbDebt.current_balance),
  monthlyPayment: createMoney(dbDebt.monthly_payment),
  interestRate: dbDebt.interest_rate,
  dueDate: dbDebt.due_date || new Date().toISOString().split('T')[0],
  status: dbDebt.status,
  priority: 'medium', // Default priority
  createdAt: dbDebt.created_at,
  updatedAt: dbDebt.updated_at
})

/**
 * Convert from unified domain type to database format
 */
export const toDatabaseDebt = (debt: Debt): Omit<DatabaseDebt, 'id' | 'created_at' | 'updated_at'> => ({
  user_id: debt.userId,
  creditor: debt.creditor,
  original_amount: debt.originalAmount.amount,
  current_balance: debt.currentBalance.amount,
  monthly_payment: debt.monthlyPayment.amount,
  interest_rate: debt.interestRate,
  due_date: debt.dueDate,
  status: debt.status
})

/**
 * Convert from legacy debt format to unified domain type
 */
export const fromLegacyDebt = (legacyDebt: LegacyDebt): Debt => ({
  id: legacyDebt.id,
  userId: legacyDebt.user_id,
  creditor: legacyDebt.creditor_name,
  originalAmount: createMoney(legacyDebt.total_amount),
  currentBalance: createMoney(legacyDebt.current_balance),
  monthlyPayment: createMoney(legacyDebt.minimum_payment),
  interestRate: legacyDebt.annual_interest_rate,
  dueDate: legacyDebt.due_day ? `2024-01-${legacyDebt.due_day.toString().padStart(2, '0')}` : new Date().toISOString().split('T')[0],
  status: 'active',
  priority: 'medium',
  description: legacyDebt.description,
  createdAt: legacyDebt.created_at,
  updatedAt: legacyDebt.updated_at
})

/**
 * Convert from onboarding debt to unified domain type
 */
export const fromOnboardingDebt = (onboardingDebt: OnboardingDebt, userId: string): Omit<Debt, 'id' | 'createdAt' | 'updatedAt'> => ({
  userId,
  creditor: onboardingDebt.name,
  originalAmount: createMoney(onboardingDebt.amount),
  currentBalance: createMoney(onboardingDebt.amount),
  monthlyPayment: createMoney(onboardingDebt.monthlyPayment),
  interestRate: 0, // Default interest rate for onboarding
  dueDate: onboardingDebt.paymentDueDate ? 
    `2024-01-${onboardingDebt.paymentDueDate.toString().padStart(2, '0')}` : 
    new Date().toISOString().split('T')[0],
  status: 'active',
  priority: 'medium'
})

/**
 * Convert unified debt to legacy format (for backward compatibility)
 */
export const toLegacyDebt = (debt: Debt): Omit<LegacyDebt, 'created_at' | 'updated_at'> => ({
  id: debt.id,
  user_id: debt.userId,
  creditor_name: debt.creditor,
  total_amount: debt.originalAmount.amount,
  current_balance: debt.currentBalance.amount,
  annual_interest_rate: debt.interestRate,
  minimum_payment: debt.monthlyPayment.amount,
  due_day: parseInt(debt.dueDate.split('-')[2]) || 1,
  description: debt.description
})
