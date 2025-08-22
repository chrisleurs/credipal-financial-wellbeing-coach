
import { useState, useEffect } from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData'

export interface MiniGoal {
  id: string
  title: string
  description: string
  badge: string
  icon: string
  targetValue: number
  currentValue: number
  isCompleted: boolean
  type: 'static' | 'dynamic'
  category: 'expense' | 'saving' | 'debt' | 'income'
  completedAt?: string
}

export const useMiniGoals = () => {
  const { financialData } = useFinancialStore()
  const { consolidatedData } = useConsolidatedFinancialData()
  const [goals, setGoals] = useState<MiniGoal[]>([])
  const [weeklyStreak, setWeeklyStreak] = useState(0)
  const [completedThisWeek, setCompletedThisWeek] = useState(0)

  // Generate static mini-goals (always available)
  const generateStaticGoals = (): MiniGoal[] => [
    {
      id: 'first-expense',
      title: 'Registra tu primer gasto',
      description: 'Comienza a trackear tus gastos',
      badge: '📝 Tracker Novato',
      icon: 'Zap',
      targetValue: 1,
      currentValue: consolidatedData?.hasRealData ? 1 : 0,
      isCompleted: consolidatedData?.hasRealData || false,
      type: 'static',
      category: 'expense'
    },
    {
      id: 'save-100',
      title: 'Ahorra $100 esta semana',
      description: 'Meta de ahorro semanal',
      badge: '💰 Ahorrador',
      icon: 'Target',
      targetValue: 100,
      currentValue: Math.min(consolidatedData?.currentSavings || 0, 100),
      isCompleted: (consolidatedData?.currentSavings || 0) >= 100,
      type: 'static',
      category: 'saving'
    }
  ]

  // Generate dynamic mini-goals based on user data
  const generateDynamicGoals = (): MiniGoal[] => {
    const dynamicGoals: MiniGoal[] = []

    // If user has debts
    if (financialData.debts.length > 0) {
      dynamicGoals.push({
        id: 'pay-debt-ontime',
        title: 'Paga una deuda a tiempo',
        description: 'Mantén tus pagos al día',
        badge: '🎯 Responsable',
        icon: 'Star',
        targetValue: 1,
        currentValue: 0, // Would need payment tracking
        isCompleted: false,
        type: 'dynamic',
        category: 'debt'
      })
    }

    // If user spends a lot (>80% of income)
    const spendingRatio = consolidatedData ? 
      consolidatedData.monthlyExpenses / consolidatedData.monthlyIncome : 0
    
    if (spendingRatio > 0.8) {
      dynamicGoals.push({
        id: 'stay-under-budget',
        title: 'Mantente bajo presupuesto 3 días',
        description: 'Controla tus gastos diarios',
        badge: '💪 Disciplinado',
        icon: 'Target',
        targetValue: 3,
        currentValue: 1, // Mock progress
        isCompleted: false,
        type: 'dynamic',
        category: 'expense'
      })
    }

    // If user saves little (<10% of income)
    const savingsRate = consolidatedData ?
      consolidatedData.savingsCapacity / consolidatedData.monthlyIncome : 0

    if (savingsRate < 0.1) {
      dynamicGoals.push({
        id: 'register-extra-income',
        title: 'Registra un ingreso extra',
        description: 'Encuentra nuevas fuentes de ingresos',
        badge: '🚀 Emprendedor',
        icon: 'Zap',
        targetValue: 1,
        currentValue: 0,
        isCompleted: false,
        type: 'dynamic',
        category: 'income'
      })
    }

    return dynamicGoals
  }

  // Calculate progress percentage
  const getProgressPercentage = (goal: MiniGoal): number => {
    if (goal.targetValue === 0) return 0
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  // Get motivational message based on completion
  const getMotivationalMessage = (completedCount: number): string => {
    if (completedCount === 0) return "¡Comienza tu primera meta! 🎯"
    if (completedCount === 1) return "¡Excelente inicio! Sigue así 👏"
    if (completedCount === 2) return "¡Casi lo logras! Una más 🔥"
    if (completedCount >= 3) return "¡Streak de campeón! 🏆🔥"
    return "¡Sigue adelante! 💪"
  }

  // Complete a goal
  const completeGoal = (goalId: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              isCompleted: true, 
              currentValue: goal.targetValue,
              completedAt: new Date().toISOString()
            }
          : goal
      )
    )
    
    setCompletedThisWeek(prev => prev + 1)
    
    // Update streak if 3+ goals completed
    if (completedThisWeek + 1 >= 3) {
      setWeeklyStreak(prev => prev + 1)
    }
  }

  // Initialize goals
  useEffect(() => {
    const staticGoals = generateStaticGoals()
    const dynamicGoals = generateDynamicGoals()
    const allGoals = [...staticGoals, ...dynamicGoals.slice(0, 2)] // Limit to 4 total
    
    setGoals(allGoals)
    
    // Count completed goals
    const completed = allGoals.filter(goal => goal.isCompleted).length
    setCompletedThisWeek(completed)
  }, [consolidatedData, financialData])

  return {
    goals: goals.slice(0, 2), // Show only 2 goals in the grid
    weeklyStreak,
    completedThisWeek,
    getProgressPercentage,
    getMotivationalMessage: () => getMotivationalMessage(completedThisWeek),
    completeGoal,
    totalGoals: goals.length,
    isLoading: !consolidatedData
  }
}
