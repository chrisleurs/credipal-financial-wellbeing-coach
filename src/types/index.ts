
export interface Debt {
  id: string
  user_id: string
  creditor_name: string
  total_amount: number
  current_balance: number
  annual_interest_rate: number
  minimum_payment: number
  due_day: number
  description?: string
  created_at: string
  updated_at: string
}

export interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  amount: number
  payment_date: string
  notes?: string
  created_at: string
}

export interface DebtReminder {
  id: string
  debt_id: string
  user_id: string
  days_before: number
  is_active: boolean
  reminder_type: string
  created_at: string
  updated_at: string
}

export interface DebtScenario {
  monthsToPayOff: number
  totalInterest: number
  monthlyPayment: number
  totalPayment: number
}

export interface AIMotivationalMessage {
  type: 'positive' | 'negative' | 'progress' | 'celebration'
  message: string
  actionSuggestion?: string
}

// Financial data interfaces needed by other files
export interface FinancialData {
  monthlyIncome: number
  extraIncome: number
  expenses: any[]
  debts: Debt[]
  savings: any
  goals: any[]
}

export interface AIGeneratedPlan {
  id: string
  goals: any[]
  recommendations: string[]
  monthlyBalance: number
  savingsSuggestion: number
}

export interface ActionPlan {
  id: string
  tasks: ActionTask[]
  status: string
}

export interface ActionTask {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
}

export interface AIPlan {
  id: string
  type: string
  data: any
}
