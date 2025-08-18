
/**
 * Debt Domain Types - Simplified and consistent with database
 */

export type DebtStatus = 'active' | 'paid' | 'delinquent'
export type DebtPriority = 'high' | 'medium' | 'low'

// Main debt interface matching database exactly
export interface Debt {
  id: string
  user_id: string
  creditor: string
  original_amount: number
  current_balance: number
  monthly_payment: number
  interest_rate: number
  due_date?: string
  status: DebtStatus
  description?: string
  created_at: string
  updated_at: string
}

// For creating new debts
export interface CreateDebtData {
  creditor: string
  original_amount: number
  current_balance: number
  monthly_payment: number
  interest_rate: number
  due_date?: string
  status?: DebtStatus
  description?: string
}

// For updating debts
export interface UpdateDebtData extends Partial<CreateDebtData> {
  id: string
}

// Legacy compatibility - remove after migration
export interface OnboardingDebt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}
