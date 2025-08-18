
/**
 * Expense Domain Types - Expense tracking and budgeting
 */

import { Money, Currency } from '../../core/money'
import { DateRange, RecurrencePattern } from '../../core/dates'

export type ExpenseCategory = 
  | 'housing' 
  | 'food' 
  | 'transportation' 
  | 'utilities'
  | 'healthcare' 
  | 'entertainment' 
  | 'shopping' 
  | 'education'
  | 'personal_care' 
  | 'travel' 
  | 'debt_payments' 
  | 'savings'
  | 'insurance' 
  | 'taxes' 
  | 'other'

export interface Expense {
  id: string
  userId: string
  category: ExpenseCategory
  amount: Money
  description: string
  date: string // ISO date string
  isRecurring: boolean
  recurrence?: RecurrencePattern
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ExpensesByCategory {
  [K in ExpenseCategory]: Money
}

export interface Budget {
  id: string
  userId: string
  category: ExpenseCategory
  budgetedAmount: Money
  spentAmount: Money
  period: DateRange
  alertThreshold?: number // percentage (e.g., 80 for 80%)
  createdAt: string
  updatedAt: string
}

export interface ExpenseSummary {
  totalMonthlyExpenses: Money
  byCategory: ExpensesByCategory
  budgetStatus: {
    totalBudget: Money
    totalSpent: Money
    remainingBudget: Money
    categoriesOverBudget: ExpenseCategory[]
  }
  trends: {
    monthOverMonth: number // percentage change
    yearOverYear: number // percentage change
    topCategories: Array<{
      category: ExpenseCategory
      amount: Money
      percentage: number
    }>
  }
}
