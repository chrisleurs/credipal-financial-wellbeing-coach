
import { Money } from '@/shared/types/core.types'

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

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: ExpenseCategoryType
  subcategory?: string
  description: string
  date: string
  is_recurring: boolean
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface CreateExpenseData {
  amount: number
  category: ExpenseCategoryType
  subcategory?: string
  description?: string
  date: string
  is_recurring?: boolean
  tags?: string[]
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  id: string
}
