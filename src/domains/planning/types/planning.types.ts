
/**
 * Planning Domain Types - Tipos para planificación financiera y IA
 */

import { Money, Status } from '../../../shared/types/core.types'

export type PlanType = 'debt_freedom' | 'savings_boost' | 'budget_optimization' | 'comprehensive'
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type ActionCategory = 'debt' | 'savings' | 'expense' | 'income' | 'investment'

export interface FinancialPlan {
  id: string
  userId: string
  planType: PlanType
  status: Status
  title: string
  description: string
  recommendations: string[]
  projectedSavings: Money
  timelineMonths: number
  createdAt: string
  updatedAt: string
}

export interface ActionItem {
  id: string
  planId: string
  userId: string
  title: string
  description: string
  category: ActionCategory
  priority: 'high' | 'medium' | 'low'
  status: ActionStatus
  targetAmount?: Money
  dueDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}
