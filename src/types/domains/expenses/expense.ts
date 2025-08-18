
/**
 * Expenses Domain Types - Expense tracking and categorization
 */

import { Money } from '../core/money'
import { DateRange, RecurrencePattern } from '../core/dates'

export type ExpenseFrequency = 'one_time' | 'daily' | 'weekly' | 'monthly' | 'yearly'
export type ExpenseCategoryType = 'food' | 'transport' | 'housing' | 'utilities' | 'entertainment' | 'healthcare' | 'education' | 'shopping' | 'bills' | 'other'

export interface Expense {
  id: string
  userId: string
  amount: Money
  category: ExpenseCategoryType
  subcategory?: string
  description: string
  date: string // ISO date string
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ExpenseCategory {
  id: string
  userId: string
  name: string
  color: string
  icon?: string
  budget?: Money
  isDefault: boolean
  createdAt: string
}

export interface ExpensesByCategory {
  [category: string]: {
    total: Money
    expenses: Expense[]
    budget?: Money
    percentageOfTotal: number
  }
}

export interface ExpenseSummary {
  totalExpenses: Money
  monthlyAverage: Money
  byCategory: ExpensesByCategory
  topCategories: Array<{
    category: string
    amount: Money
    percentage: number
  }>
  trendDirection: 'up' | 'down' | 'stable'
  comparedToPreviousMonth: number
}

export interface Budget {
  id: string
  userId: string
  category: ExpenseCategoryType
  amount: Money
  period: DateRange
  alertThreshold: number // percentage (0-100)
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ExpenseAlert {
  id: string
  userId: string
  budgetId: string
  type: 'approaching_limit' | 'over_budget' | 'unusual_spending'
  message: string
  amount: Money
  threshold: Money
  createdAt: string
  acknowledged: boolean
}
