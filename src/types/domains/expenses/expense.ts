
/**
 * Expense Domain Types - Unified expense management
 */

import { Money } from '../../core'

export type ExpenseCategory = 
  | 'housing'
  | 'food'
  | 'transportation' 
  | 'utilities'
  | 'healthcare'
  | 'entertainment'
  | 'education'
  | 'personal'
  | 'debt'
  | 'savings'
  | 'other'

export interface Expense {
  id: string
  userId: string
  category: ExpenseCategory
  subcategory?: string
  amount: Money
  date: string
  description?: string
  isRecurring: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ExpensesByCategory {
  [key in ExpenseCategory]?: Money
}

export interface ExpenseSummary {
  totalMonthly: Money
  byCategory: ExpensesByCategory
  recurringExpenses: Expense[]
  averageDaily: Money
}

export interface Budget {
  id: string
  userId: string
  category: ExpenseCategory
  budgetAmount: Money
  spentAmount: Money
  remainingAmount: Money
  period: 'monthly' | 'weekly'
  isExceeded: boolean
  createdAt: string
  updatedAt: string
}

// Utility types for onboarding
export interface OnboardingExpense {
  category: ExpenseCategory
  amount: number
  description?: string
  isRecurring?: boolean
}
