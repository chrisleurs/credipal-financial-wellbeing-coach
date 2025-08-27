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

// Nueva interfaz unificada para el plan financiero
export interface FinancialPlan {
  id: string
  userId: string
  
  // Snapshot inicial y proyecciones
  currentSnapshot: {
    monthlyIncome: number
    monthlyExpenses: number
    totalDebt: number
    currentSavings: number
  }
  
  projectedSnapshot: {
    debtIn12Months: number
    emergencyFundIn12Months: number
    netWorthIn12Months: number
  }
  
  // Presupuesto recomendado (50/30/20)
  recommendedBudget: {
    needs: { percentage: number; amount: number }
    lifestyle: { percentage: number; amount: number }
    savings: { percentage: number; amount: number }
  }
  
  // Plan de pago de deudas
  debtPayoffPlan: Array<{
    debtName: string
    currentBalance: number
    payoffDate: string
    monthlyPayment: number
    interestSaved: number
  }>
  
  // Fondo de emergencia
  emergencyFund: {
    targetAmount: number
    currentAmount: number
    monthlySaving: number
    completionDate: string
  }
  
  // Crecimiento patrimonial
  wealthGrowth: {
    year1: number
    year3: number
    year5: number
  }
  
  // Metas a corto plazo
  shortTermGoals: {
    weekly: Array<{
      title: string
      target: number
      progress: number
      type: string
    }>
    monthly: Array<{
      title: string
      target: number
      progress: number
      type: string
    }>
  }
  
  // Roadmap de acción
  actionRoadmap: Array<{
    step: number
    title: string
    targetDate: string
    completed: boolean
    description?: string
  }>
  
  // Metadata
  generatedAt: string
  status: 'active' | 'draft' | 'completed'
}

export interface PlanGenerationData {
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  savingsCapacity: number
  debts: Array<{
    name: string
    amount: number
    monthlyPayment: number
  }>
  goals: string[]
  expenseCategories: Record<string, number>
}
