
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
  financialGoals: string[] // CAMBIO: Array simple de strings
  whatsappOptin: boolean
}

export interface Debt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
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
