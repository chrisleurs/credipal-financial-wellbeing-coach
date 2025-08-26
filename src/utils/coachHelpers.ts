
/**
 * Helper functions para el Financial Coach
 */

import type { 
  BigGoal, 
  MiniGoal, 
  ImmediateAction, 
  GoalType,
  MotivationLevel 
} from '@/types/coach'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatProgress = (current: number, target: number): string => {
  const percentage = Math.round((current / target) * 100)
  return `${percentage}%`
}

export const getGoalTypeEmoji = (type: GoalType): string => {
  const emojiMap: Record<GoalType, string> = {
    debt_elimination: '💳',
    emergency_fund: '🛡️',
    savings: '💰',
    investment: '📈',
    expense_reduction: '✂️'
  }
  return emojiMap[type] || '🎯'
}

export const getMotivationColor = (level: MotivationLevel): string => {
  const colorMap: Record<MotivationLevel, string> = {
    low: 'text-red-600',
    medium: 'text-yellow-600',
    high: 'text-green-600',
    celebration: 'text-purple-600'
  }
  return colorMap[level]
}

export const calculateOverallProgress = (bigGoals: BigGoal[]): number => {
  if (bigGoals.length === 0) return 0
  
  const totalProgress = bigGoals.reduce((sum, goal) => sum + goal.progress, 0)
  return Math.round(totalProgress / bigGoals.length)
}

export const getNextMilestone = (goal: BigGoal) => {
  return goal.milestones.find(milestone => !milestone.isCompleted)
}

export const generateEncouragement = (progress: number): string => {
  if (progress >= 80) return "¡Estás súper cerca de tu meta! 🔥"
  if (progress >= 60) return "¡Vas muy bien! Sigue así 💪"
  if (progress >= 40) return "¡Buen progreso! Ya tienes impulso 🚀"
  if (progress >= 20) return "¡Excelente inicio! Cada paso cuenta ⭐"
  return "¡Vamos a empezar fuerte! Tú puedes 💪"
}
