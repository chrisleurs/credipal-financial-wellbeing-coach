
export interface Income {
  id: string
  user_id: string
  source: string
  amount: number
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'one-time'
  is_active: boolean
  date: string
  created_at: string
  updated_at: string
}

export interface NewIncome {
  source: string
  amount: string
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'one-time'
}
