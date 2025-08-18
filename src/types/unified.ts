
// Unified types for CrediPal - Single source of truth
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
}

// Database Debt interface (matches Supabase structure)
export interface Debt {
  id: string
  user_id: string
  creditor: string
  creditor_name?: string // For backward compatibility
  original_amount: number
  total_amount?: number // For backward compatibility  
  current_balance: number
  monthly_payment: number
  minimum_payment?: number // For backward compatibility
  interest_rate: number
  annual_interest_rate?: number // For backward compatibility
  due_date?: string
  due_day?: number // For backward compatibility
  status: 'active' | 'paid' | 'delinquent'
  description?: string
  created_at: string
  updated_at: string
}

// Onboarding-specific debt interface (for forms and user input)
export interface OnboardingDebt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}

// Unified Financial Data interface
export interface FinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  expenseCategories: Record<string, number>
  debts: OnboardingDebt[] // Use onboarding-specific type here
  currentSavings: number
  monthlySavingsCapacity: number
  financialGoals: string[]
  whatsappOptin: boolean
}

// Income source interface
export interface IncomeSource {
  id: string
  user_id: string
  source_name: string
  amount: number
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'yearly'
  is_active: boolean
  created_at: string
  updated_at: string
}

// Expense interface
export interface Expense {
  id: string
  user_id: string
  category: string
  subcategory?: string
  amount: number
  date: string
  description?: string
  is_recurring: boolean
  created_at: string
  updated_at: string
}

// Goal interface
export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  target_amount: number
  current_amount: number
  deadline?: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
}

// Financial Summary interface
export interface FinancialSummary {
  id: string
  user_id: string
  total_monthly_income: number
  total_monthly_expenses: number
  total_debt: number
  monthly_debt_payments: number
  savings_capacity: number
  emergency_fund: number
  last_calculated: string
  updated_at: string
}

// Debt Payment interface
export interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  amount: number
  payment_date: string
  notes?: string
  created_at: string
}

// AI Plan interface
export interface AIPlan {
  id: string
  recommendations: string[]
  monthlyBalance: number
  savingsSuggestion: number
  budgetBreakdown: {
    fixedExpenses: number
    variableExpenses: number
    savings: number
    emergency: number
  }
  timeEstimate: string
  motivationalMessage: string
  createdAt: string
}

// Action Task interface
export interface ActionTask {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  completed: boolean
}

// AI Generated Plan interface (for openai service)
export interface AIGeneratedPlan {
  id: string
  recommendations: string[]
  monthlyBalance: number
  savingsSuggestion: number
  budgetBreakdown: {
    fixedExpenses: number
    variableExpenses: number
    savings: number
    emergency: number
  }
  timeEstimate: string
  motivationalMessage: string
}

// Action Plan interface (for openai service)
export interface ActionPlan {
  id: string
  tasks: ActionTask[]
  timeframe: string
  priority: 'high' | 'medium' | 'low'
}

// Financial Plan interface (for backward compatibility)
export interface FinancialPlan {
  id: string
  user_id: string
  plan_type: string
  plan_data: any
  status: 'draft' | 'active' | 'completed'
  version: number
  created_at: string
  updated_at: string
}

// Type conversion utilities
export namespace TypeConverters {
  export function convertDatabaseDebtToUnified(dbDebt: any): Debt {
    return {
      id: dbDebt.id,
      user_id: dbDebt.user_id,
      creditor: dbDebt.creditor || dbDebt.creditor_name || '',
      creditor_name: dbDebt.creditor_name || dbDebt.creditor,
      original_amount: dbDebt.original_amount || dbDebt.total_amount || 0,
      total_amount: dbDebt.total_amount || dbDebt.original_amount,
      current_balance: dbDebt.current_balance,
      monthly_payment: dbDebt.monthly_payment || dbDebt.minimum_payment || 0,
      minimum_payment: dbDebt.minimum_payment || dbDebt.monthly_payment,
      interest_rate: dbDebt.interest_rate || dbDebt.annual_interest_rate || 0,
      annual_interest_rate: dbDebt.annual_interest_rate || dbDebt.interest_rate,
      due_date: dbDebt.due_date,
      due_day: dbDebt.due_day,
      status: dbDebt.status || 'active',
      description: dbDebt.description,
      created_at: dbDebt.created_at,
      updated_at: dbDebt.updated_at
    }
  }

  export function convertOnboardingDebtToDatabase(onboardingDebt: OnboardingDebt): Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
    return {
      creditor: onboardingDebt.name,
      original_amount: onboardingDebt.amount,
      current_balance: onboardingDebt.amount,
      monthly_payment: onboardingDebt.monthlyPayment,
      interest_rate: 0, // Default value
      status: 'active',
      due_date: onboardingDebt.paymentDueDate ? `2024-01-${onboardingDebt.paymentDueDate.toString().padStart(2, '0')}` : undefined
    }
  }
}
