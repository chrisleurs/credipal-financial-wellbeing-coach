
import { Money, Status, Priority } from '@/shared/types/core.types'

export type SavingsGoalStatus = 'active' | 'completed' | 'paused'

export interface SavingsGoal {
  id: string
  userId: string
  title: string
  description?: string
  targetAmount: Money
  currentAmount: Money
  targetDate?: string
  priority: Priority
  status: SavingsGoalStatus
  createdAt: string
  updatedAt: string
}

export interface CreateSavingsGoalData {
  title: string
  description?: string
  targetAmount: Money
  currentAmount?: Money
  targetDate?: string
  priority?: Priority
  status?: SavingsGoalStatus
}

export interface UpdateSavingsGoalData extends Partial<CreateSavingsGoalData> {
  id: string
}
