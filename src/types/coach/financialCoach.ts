
/**
 * Financial Coach Types - Sistema de coaching financiero 3.2.1
 * 3 Metas Grandes, 2 Mini-Metas, 1 Acción Inmediata
 */

export type MotivationLevel = 'low' | 'medium' | 'high' | 'celebration'
export type GoalType = 'debt_elimination' | 'emergency_fund' | 'savings' | 'investment' | 'expense_reduction'
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked'
export type CoachMessageType = 'motivational' | 'educational' | 'reminder' | 'celebration' | 'challenge'
export type ActionPriority = 'immediate' | 'this_week' | 'this_month'

// Meta Grande (3 metas principales)
export interface BigGoal {
  id: string
  type: GoalType
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  progress: number // 0-100
  timeline: string // "4 meses", "6 semanas"
  status: GoalStatus
  emoji: string
  milestones: GoalMilestone[]
  createdAt: string
  updatedAt: string
}

// Hitos dentro de cada meta grande
export interface GoalMilestone {
  id: string
  title: string
  targetAmount: number
  isCompleted: boolean
  completedAt?: string
  reward?: string // "¡Celebra con una cena especial!"
}

// Mini Meta (2 metas semanales gamificadas)
export interface MiniGoal {
  id: string
  title: string
  description: string
  targetValue: number // Puede ser dinero, días, etc.
  currentValue: number
  unit: string // "pesos", "días", "veces"
  difficulty: 'easy' | 'medium' | 'hard'
  points: number // Sistema de puntos
  weekStartDate: string
  weekEndDate: string
  status: GoalStatus
  emoji: string
  completionReward: string
  isCompleted: boolean
  completedAt?: string
}

// Acción Inmediata (1 acción para hoy/esta semana)
export interface ImmediateAction {
  id: string
  title: string
  description: string
  priority: ActionPriority
  estimatedMinutes: number
  category: 'planning' | 'tracking' | 'payment' | 'research' | 'optimization'
  dueDate: string
  isCompleted: boolean
  completedAt?: string
  emoji: string
  impact: string // "Ahorro de $500 mensual"
}

// Mensaje del Coach (powered by OpenAI)
export interface CoachMessage {
  id: string
  text: string
  type: CoachMessageType
  motivationLevel: MotivationLevel
  personalizedGreeting: string
  weeklyHighlight?: string
  encouragement?: string
  nextStepSuggestion?: string
  timestamp: string
  metadata?: {
    userProgress: number
    streakDays: number
    completedGoalsThisWeek: number
  }
}

// Plan Financiero Completo 3.2.1
export interface FinancialCoachPlan {
  id: string
  userId: string
  planName: string
  methodology: '3.2.1'
  
  // Elementos principales
  coachMessage: CoachMessage
  bigGoals: BigGoal[] // Máximo 3
  miniGoals: MiniGoal[] // Máximo 2
  immediateAction: ImmediateAction
  
  // Metadata del plan
  weekNumber: number
  totalWeeks: number
  overallProgress: number // 0-100
  createdAt: string
  updatedAt: string
  lastCoachingDate: string
  
  // Estadísticas de engagement
  stats: CoachingStats
}

// Estadísticas de coaching
export interface CoachingStats {
  streak: number // días consecutivos de actividad
  completedBigGoals: number
  completedMiniGoals: number
  completedActions: number
  totalPoints: number
  currentLevel: number
  progressThisWeek: number
  motivationTrend: MotivationLevel[]
}

// Datos financieros consolidados para input a OpenAI
export interface UserFinancialSnapshot {
  userId: string
  
  // Datos básicos (de tu estructura existente)
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  savingsCapacity: number
  
  // Deudas
  totalDebt: number
  monthlyDebtPayments: number
  highestInterestDebt?: {
    creditor: string
    balance: number
    interestRate: number
  }
  
  // Metas actuales
  activeGoals: {
    title: string
    target: number
    current: number
    progress: number
  }[]
  
  // Contexto temporal
  lastWeekExpenses: number
  expensesTrend: 'increasing' | 'decreasing' | 'stable'
  
  // Progreso histórico
  previousWeekProgress: number
  completedActionsThisWeek: number
  
  // Contexto personal (opcional)
  preferredCommunicationStyle?: 'encouraging' | 'direct' | 'analytical'
  currentStressLevel?: 'low' | 'medium' | 'high'
}

// Input para OpenAI API
export interface CoachingAIInput {
  userSnapshot: UserFinancialSnapshot
  currentPlan?: FinancialCoachPlan
  requestType: 'new_plan' | 'weekly_update' | 'motivation_boost' | 'progress_check'
  preferences: {
    language: 'es' | 'en'
    tone: 'casual' | 'professional' | 'friendly'
    focusArea?: GoalType
  }
}

// Output esperado de OpenAI
export interface CoachingAIOutput {
  success: boolean
  plan?: FinancialCoachPlan
  message?: CoachMessage
  error?: string
  metadata?: {
    modelUsed: string
    tokensUsed: number
    processingTime: number
  }
}

// Estados de carga para UX
export interface CoachingUIState {
  isLoadingPlan: boolean
  isGeneratingMessage: boolean
  isUpdatingProgress: boolean
  error: string | null
  lastUpdated: string | null
  
  // Estados específicos
  planGeneration: {
    step: 'analyzing' | 'generating' | 'personalizing' | 'complete'
    progress: number
    message: string
  }
}

// Hook state para React
export interface UseFinancialCoachState {
  currentPlan: FinancialCoachPlan | null
  uiState: CoachingUIState
  userSnapshot: UserFinancialSnapshot | null
  
  // Acciones
  generateNewPlan: () => Promise<void>
  updateGoalProgress: (goalId: string, progress: number) => Promise<void>
  completeAction: (actionId: string) => Promise<void>
  requestMotivation: () => Promise<void>
  refreshPlan: () => Promise<void>
}

// Configuración del coach
export interface CoachConfiguration {
  enableWeeklyReminders: boolean
  enablePushNotifications: boolean
  preferredCoachingTime: string // "09:00"
  motivationFrequency: 'daily' | 'weekly' | 'on_demand'
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  focusAreas: GoalType[]
}
