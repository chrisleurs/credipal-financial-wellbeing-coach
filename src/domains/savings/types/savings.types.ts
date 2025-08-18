
/**
 * Savings Domain Types - Tipos para gestión de ahorros y metas
 */

import { Money, Status, Priority } from '../../../shared/types/core.types'

export interface SavingsAccount {
  id: string
  userId: string
  accountName: string
  currentBalance: Money
  targetAmount?: Money
  accountType: 'emergency' | 'goal' | 'general'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SavingsGoal {
  id: string
  userId: string
  title: string
  description?: string
  targetAmount: Money
  currentAmount: Money
  targetDate?: string
  priority: Priority
  status: Status
  createdAt: string
  updatedAt: string
}
