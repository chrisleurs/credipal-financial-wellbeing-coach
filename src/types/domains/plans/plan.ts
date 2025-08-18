
/**
 * Plans Domain Types - AI-generated financial plans and actions
 */

import { Money } from '../../core/money'
import { DateRange } from '../../core/dates'

export type PlanType = 'debt_payoff' | 'savings' | 'budget_optimization' | 'comprehensive'
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'
export type ActionPriority = 'high' | 'medium' | 'low'

export interface AIFinancialPlan {
  id: string
  userId: string
  title: string
  description: string
  type: PlanType
  generatedAt: string
  targetDate: string
  estimatedSavings: Money
  confidenceScore: number // 0-100
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ActionItem {
  id: string
  planId: string
  userId: string
  title: string
  description: string
  category: string
  priority: ActionPriority
  status: ActionStatus
  estimatedImpact: Money
  dueDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PlanProgress {
  plan: AIFinancialPlan
  totalActions: number
  completedActions: number
  progressPercentage: number
  estimatedCompletion: string
  actualSavings: Money
  projectedSavings: Money
}

export interface PlanSummary {
  activePlans: AIFinancialPlan[]
  completedPlans: AIFinancialPlan[]
  totalEstimatedSavings: Money
  totalActualSavings: Money
  overallProgress: number
  upcomingActions: ActionItem[]
}

// Legacy compatibility exports
export type AIPlan = AIFinancialPlan
export type ActionTask = ActionItem
