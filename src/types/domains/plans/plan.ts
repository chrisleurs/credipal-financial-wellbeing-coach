
/**
 * Plans Domain Types - AI-generated financial plans and actions
 */

import { Money } from '../../core'

export type PlanStatus = 'draft' | 'active' | 'completed' | 'paused'
export type PlanType = '3-2-1' | 'debt_freedom' | 'wealth_building' | 'emergency_fund'
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'
export type ActionPriority = 'high' | 'medium' | 'low'

export interface AIFinancialPlan {
  id: string
  userId: string
  planType: PlanType
  status: PlanStatus
  version: number
  
  // Plan content
  title: string
  description: string
  recommendations: string[]
  
  // Financial projections
  monthlyBalance: Money
  savingsSuggestion: Money
  budgetBreakdown: {
    fixedExpenses: Money
    variableExpenses: Money
    savings: Money
    emergency: Money
    debtPayments: Money
  }
  
  // Timeline
  timeEstimate: string
  projectedOutcomes: {
    debtFreeDate?: string
    emergencyFundDate?: string
    savingsTarget?: Money
  }
  
  // AI insights
  motivationalMessage: string
  riskAssessment: string
  confidenceScore: number
  
  createdAt: string
  updatedAt: string
}

export interface ActionItem {
  id: string
  planId: string
  userId: string
  
  title: string
  description: string
  category: 'budget' | 'debt' | 'savings' | 'income' | 'expense'
  priority: ActionPriority
  status: ActionStatus
  
  // Timing
  dueDate?: string
  estimatedDuration: string
  
  // Tracking
  progress: number // 0-100
  notes?: string
  completedAt?: string
  
  createdAt: string
  updatedAt: string
}

export interface PlanProgress {
  plan: AIFinancialPlan
  totalActions: number
  completedActions: number
  progressPercentage: number
  currentPhase: string
  nextMilestone?: string
  lastUpdated: string
}
