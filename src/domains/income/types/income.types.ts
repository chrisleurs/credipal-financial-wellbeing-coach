
/**
 * Income Domain Types - Simplified and consistent with database
 */

export type FrequencyType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'

// Main income interface matching database exactly
export interface Income {
  id: string
  user_id: string
  source: string
  amount: number
  frequency: FrequencyType
  is_active: boolean
  description?: string
  created_at: string
  updated_at: string
}

// For creating new income sources
export interface CreateIncomeData {
  source: string
  amount: number
  frequency: FrequencyType
  is_active?: boolean
  description?: string
}

// For updating income sources
export interface UpdateIncomeData extends Partial<CreateIncomeData> {
  id: string
}
