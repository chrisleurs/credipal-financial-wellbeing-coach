
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

export interface Debt {
  id: string
  user_id: string
  creditor: string
  original_amount: number
  current_balance: number
  monthly_payment: number
  interest_rate: number
  due_date?: string
  status: 'active' | 'paid' | 'delinquent'
  created_at: string
  updated_at: string
}

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
