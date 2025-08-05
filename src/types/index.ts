
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
}

export interface FinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  expenseCategories: Record<string, number>
  debts: Debt[]
  currentSavings: number
  monthlySavingsCapacity: number
  financialGoals: string[]
  whatsappOptin: boolean
}

export interface Debt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}

// FIXED: Goal interface with all required properties
export interface Goal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount?: number
  deadline: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  actionSteps?: string[]
  reason?: string
  celebrationMessage?: string
}

// FIXED: Complete AIGeneratedPlan interface with goal arrays
export interface AIGeneratedPlan {
  shortTermGoals: Goal[]
  mediumTermGoals: Goal[]
  longTermGoals: Goal[]
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
  analysis?: {
    positives: string[]
    concerns: string[]
    quickWins: string[]
  }
}

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

export interface ActionTask {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  completed: boolean
}

export interface ActionPlan {
  tasks: ActionTask[]
  nextReviewDate: string
  whatsappReminders: boolean
}

// Database row interface with proper typing for JSONB fields
export interface FinancialPlanRow {
  id: string
  user_id: string
  plan_data: Record<string, any> | null
  plan_type: string
  status: string
  goals: any[] | null
  recommendations: string[] | null
  monthly_balance: number
  savings_suggestion: number
  created_at: string
  updated_at: string
}
