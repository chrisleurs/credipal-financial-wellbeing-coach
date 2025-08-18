
/**
 * Expenses Domain Types - Simplified and consistent with database
 */

export type ExpenseCategoryType = 
  | 'Food & Dining'
  | 'Transportation' 
  | 'Housing & Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Healthcare'
  | 'Education'
  | 'Bills & Services'
  | 'Other'

// Main expense interface matching database exactly
export interface Expense {
  id: string
  user_id: string
  amount: number
  category: ExpenseCategoryType
  subcategory?: string
  description?: string
  date: string
  is_recurring: boolean
  tags?: string[]
  created_at: string
  updated_at: string
}

// For creating new expenses
export interface CreateExpenseData {
  amount: number
  category: ExpenseCategoryType
  subcategory?: string
  description?: string
  date: string
  is_recurring?: boolean
  tags?: string[]
}

// For updating expenses
export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  id: string
}
