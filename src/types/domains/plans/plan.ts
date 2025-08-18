
/**
 * Plans Domain Types - AI-generated financial plans and action items
 */

import { Money } from '../../core/money'
import { DateRange } from '../../core/dates'

export type PlanStatus = 'draft' | 'active' | 'completed' | 'paused'
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type ActionCategory = 'debt' | 'savings' | 'expense' | 'income' | 'investment'

export interface AIFinancialPlan {
  id: string
  userId: string
  planType: 'debt_freedom' | 'savings_boost' | 'budget_optimization' | 'comprehensive'
  status: PlanStatus
  
  // Plan content
  title: string
  description: string
  motivationalMessage: string
  recommendations: string[]
  
  // Financial projections
  currentBalance: Money
  monthlyBalance: Money
  projectedSavings: Money
  savingsSuggestion: string
  timelineMonths: number
  
  // Metadata
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface ActionItem {
  id: string
  planId: string
  userId: string
  
  // Action details
  title: string
  description: string
  category: ActionCategory
  priority: 'high' | 'medium' | 'low'
  status: ActionStatus
  
  // Targets and metrics
  targetAmount?: Money
  currentProgress?: Money
  dueDate?: string
  
  // Completion tracking
  completedAt?: string
  notes?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface PlanProgress {
  planId: string
  totalActions: number
  completedActions: number
  progressPercentage: number
  estimatedCompletion: string
  currentMilestone: string
}

export interface PlanMetrics {
  totalSavingsAchieved: Money
  debtReductionAchieved: Money
  monthlyImprovements: Money
  goalsReached: number
  planEfficiencyScore: number
}
