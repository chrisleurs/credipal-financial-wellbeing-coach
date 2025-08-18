
/**
 * Savings Domain Types - Simplified and consistent with database
 */

export type SavingsGoalStatus = 'active' | 'completed' | 'paused'
export type Priority = 'high' | 'medium' | 'low'

// Main savings goal interface matching database exactly
export interface SavingsGoal {
  id: string
  user_id: string
  title: string
  description?: string
  target_amount: number
  current_amount: number
  deadline?: string
  priority: Priority
  status: SavingsGoalStatus
  created_at: string
  updated_at: string
}

// For creating new goals
export interface CreateSavingsGoalData {
  title: string
  description?: string
  target_amount: number
  current_amount?: number
  deadline?: string
  priority?: Priority
  status?: SavingsGoalStatus
}

// For updating goals
export interface UpdateSavingsGoalData extends Partial<CreateSavingsGoalData> {
  id: string
}
