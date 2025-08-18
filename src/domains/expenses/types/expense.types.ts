
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
  userId: string
  amount: Money
  category: ExpenseCategoryType
  subcategory?: string
  description: string
  date: string
  isRecurring: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseData {
  amount: Money
  category: ExpenseCategoryType
  subcategory?: string
  description?: string
  date: string
  isRecurring?: boolean
  tags?: string[]
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  id: string
}
