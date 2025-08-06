
export interface FinancialGoal {
  id: string
  type: 'short' | 'medium' | 'long'
  title: string
  emoji: string
  targetAmount: number
  currentAmount: number
  deadline: string
  status: 'completed' | 'in_progress' | 'pending'
  progress: number
  actionText: string
}

export interface CrediMessage {
  id: string
  text: string
  timestamp: string
  type: 'motivational' | 'suggestion' | 'celebration' | 'reminder'
}

export interface FinancialJourney {
  steps: {
    id: string
    title: string
    emoji: string
    status: 'completed' | 'in_progress' | 'pending'
  }[]
  currentStep: number
}

export interface DashboardData {
  greeting: string
  motivationalMessage: string
  goals: FinancialGoal[]
  journey: FinancialJourney
  crediMessage: CrediMessage
  lastUpdate: string
}
