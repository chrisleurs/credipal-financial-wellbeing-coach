
import { Money, Status, FrequencyType } from '@/shared/types/core.types'

export interface Income {
  id: string
  userId: string
  source: string // Changed from source_name to match domain pattern
  amount: Money
  frequency: FrequencyType
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateIncomeData {
  source: string
  amount: Money
  frequency: FrequencyType
  isActive?: boolean
  description?: string
}

export interface UpdateIncomeData extends Partial<CreateIncomeData> {
  id: string
}
