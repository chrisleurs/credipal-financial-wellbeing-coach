
import { Money, Status, Priority } from '@/shared/types/core.types'

export type SavingsGoalStatus = 'active' | 'completed' | 'paused'

export interface SavingsGoal {
  id: string
  user_id: string
  title: string
  description?: string
  target_amount: number
  current_amount: number
  deadline?: string // Changed from targetDate to deadline
  priority: Priority
  status: SavingsGoalStatus
  created_at: string
  updated_at: string
}

export interface CreateSavingsGoalData {
  title: string
  description?: string
  target_amount: number
  current_amount?: number
  deadline?: string // Changed from targetDate to deadline
  priority?: Priority
  status?: SavingsGoalStatus
}

export interface UpdateSavingsGoalData extends Partial<CreateSavingsGoalData> {
  id: string
}
