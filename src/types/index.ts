
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
}

export interface LoanInfo {
  id: string
  userId: string
  amount: number
  paymentAmount: number
  paymentFrequency: 'quincenal' | 'mensual'
  origin: string
  startDate: string
  status: 'active' | 'completed'
}

export interface FinancialGoal {
  id: string
  type: 'emergency' | 'vacation' | 'home' | 'car' | 'education' | 'retirement' | 'other'
  description: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  priority: 'high' | 'medium' | 'low'
}

export interface FinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  expenseCategories: Record<string, number>
  debts: Debt[]
  currentSavings: number
  monthlySavingsCapacity: number
  financialGoals: FinancialGoal[]
  whatsappOptin: boolean
}

export interface Debt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate: number
  termInMonths: number
  estimatedPayoffDate?: string
}

export interface AIGeneratedPlan {
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

export interface ActionTask {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  completed: boolean
  steps: string[]
}

export interface ActionPlan {
  tasks: ActionTask[]
  nextReviewDate: string
  whatsappReminders: boolean
}

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}
