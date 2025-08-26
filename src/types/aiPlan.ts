
export interface AIGeneratedFinancialPlan {
  id?: string
  userId?: string
  motivationalMessage?: string
  monthlyBalance?: number
  projectedSavings?: number
  timeEstimate?: string
  goals?: Array<{
    id: string
    title: string
    status: 'completed' | 'in_progress' | 'pending'
    progress: number
    currentAmount?: number
    targetAmount?: number
  }>
  recommendations?: string[]
  analysis?: string
  priorityActions?: Array<{
    action: string
    impact: string
    timeline: string
  }>
  lastUpdated?: string
}
