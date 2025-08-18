
/**
 * Unified Types - Single source of truth for all application types
 */

// Re-export core types
export * from '../shared/types/core.types'
export * from '../shared/types/database.types'

// Re-export domain types
export * from '../domains/debts/types/debt.types'
export * from '../domains/expenses/types/expense.types'
export * from '../domains/income/types/income.types'
export * from '../domains/savings/types/savings.types'
export * from '../domains/planning/types/planning.types'
export * from '../domains/analytics/types/analytics.types'

// Legacy compatibility types
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

export interface ConsolidatedProfile {
  userId: string
  name: string
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  currentSavings: number
  totalDebtBalance: number
  totalMonthlyDebtPayments: number
  savingsCapacity: number
  financialGoals: string[]
  expenseCategories: Record<string, number>
  debts: Array<{
    id: string
    creditor: string
    current_balance: number
    monthly_payment: number
    annual_interest_rate: number
  }>
  dataCompleteness: number
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

// Type converters for compatibility
export class TypeConverters {
  static convertOnboardingDebtToDatabase(debt: OnboardingDebt) {
    return {
      creditor: debt.name,
      original_amount: debt.amount,
      current_balance: debt.amount,
      monthly_payment: debt.monthlyPayment,
      interest_rate: 0,
      due_date: debt.paymentDueDate ? new Date(2024, 0, debt.paymentDueDate).toISOString() : null,
      status: 'active' as const
    }
  }
  
  static convertDatabaseDebtToOnboarding(dbDebt: any): OnboardingDebt {
    return {
      id: dbDebt.id,
      name: dbDebt.creditor,
      amount: dbDebt.current_balance,
      monthlyPayment: dbDebt.monthly_payment,
      paymentDueDate: dbDebt.due_date ? new Date(dbDebt.due_date).getDate() : undefined
    }
  }
}
