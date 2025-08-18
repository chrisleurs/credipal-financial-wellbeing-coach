
/**
 * Goals Domain Types - Financial goals and targets
 */

import { Money } from '../../core'

export type GoalPriority = 'high' | 'medium' | 'low'
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'
export type GoalType = 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund'

export interface FinancialGoal {
  id: string
  userId: string
  title: string
  description?: string
  type: GoalType
  targetAmount: Money
  currentAmount: Money
  deadline?: string
  priority: GoalPriority
  status: GoalStatus
  monthlyContribution?: Money
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
}

export interface GoalProjection {
  goal: FinancialGoal
  monthsToComplete: number
  monthlyContributionNeeded: Money
  projectedCompletionDate: string
  probabilityOfSuccess: number
}

export interface GoalsSummary {
  activeGoals: FinancialGoal[]
  completedGoals: FinancialGoal[]
  totalTargetAmount: Money
  totalCurrentAmount: Money
  monthlyContributionsNeeded: Money
  projections: GoalProjection[]
}
