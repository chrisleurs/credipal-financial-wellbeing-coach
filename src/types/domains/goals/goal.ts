
/**
 * Goals Domain Types - Financial goals and milestones
 */

import { Money } from '../../core/money'
import { DateRange } from '../../core/dates'

export type GoalType = 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund'
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'
export type GoalPriority = 'high' | 'medium' | 'low'

export interface FinancialGoal {
  id: string
  userId: string
  title: string
  description?: string
  type: GoalType
  targetAmount: Money
  currentAmount: Money
  targetDate: string
  status: GoalStatus
  priority: GoalPriority
  createdAt: string
  updatedAt: string
}

export interface GoalMilestone {
  id: string
  goalId: string
  title: string
  targetAmount: Money
  targetDate: string
  isCompleted: boolean
  completedAt?: string
  createdAt: string
}

export interface GoalProgress {
  goal: FinancialGoal
  progressPercentage: number
  remainingAmount: Money
  timeRemaining: number // days
  onTrack: boolean
  projectedCompletionDate: string
  requiredMonthlySavings: Money
}

export interface GoalsSummary {
  totalTargetAmount: Money
  totalCurrentAmount: Money
  overallProgress: number
  activeGoals: number
  completedGoals: number
  onTrackGoals: number
  behindScheduleGoals: number
  nextMilestones: GoalMilestone[]
}
