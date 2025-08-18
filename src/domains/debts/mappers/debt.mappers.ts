
/**
 * Debt Mappers - Conversión entre tipos de dominio y base de datos
 */

import { Debt, DatabaseDebt, LegacyDebt, OnboardingDebt } from '../types/debt.types'
import { createMoney } from '../../../shared/types/core.types'

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
