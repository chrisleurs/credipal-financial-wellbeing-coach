
/**
 * Unified Types - Single source of truth for all application types
 */

// Re-export domain types
export * from '../domains/debts/types/debt.types'
export * from '../domains/expenses/types/expense.types'
export * from '../domains/income/types/income.types'
export * from '../domains/savings/types/savings.types'

// Legacy compatibility types
export interface OnboardingDebt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}

export interface FinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  currentSavings: number
  monthlySavingsCapacity: number
  whatsappOptin: boolean
  debts: OnboardingDebt[]
  financialGoals: string[]
  expenseCategories: Record<string, number>
}

export interface ConsolidatedFinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  currentSavings: number
  monthlySavingsCapacity: number
  financialGoals: string[]
  expenseCategories: Record<string, number>
  debts: OnboardingDebt[]
  totalDebts: number
  monthlyDebtPayments: number
  savingsCapacity: number
  hasRealData: boolean
}

// AI-related types for compatibility
export interface AIGeneratedPlan {
  id: string
  recommendations: string[]
  projectedSavings: number
  timeline: string
}

export interface ActionPlan {
  id: string
  tasks: ActionTask[]
  timeline: string
}

export interface ActionTask {
  id: string
  title: string
  description: string
  status: ActionStatus
  dueDate: string
}

export type ActionStatus = 'pending' | 'in_progress' | 'completed'
