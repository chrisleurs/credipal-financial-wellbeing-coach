
import { Money, Status, FrequencyType } from '@/shared/types/core.types'

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

export interface CreateIncomeData {
  source: string
  amount: number
  frequency: FrequencyType
  is_active?: boolean
  description?: string
}

export interface UpdateIncomeData extends Partial<CreateIncomeData> {
  id: string
}
