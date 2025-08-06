
import { useState, useEffect } from 'react'
import type { DashboardData, FinancialGoal, CrediMessage, FinancialJourney } from '@/types/financialPlan'

export const useFinancialPlan = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos del plan financiero
    const loadPlanData = async () => {
      setIsLoading(true)
      
      // Simular API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: DashboardData = {
        greeting: getPersonalizedGreeting(),
        motivationalMessage: "Hoy es un gran día para acercarte a tus metas 🎯",
        goals: [
          {
            id: '1',
            type: 'short',
            title: 'Fondo de Emergencia',
            emoji: '🆘',
            targetAmount: 400,
            currentAmount: 240,
            deadline: '2024-10-15',
            status: 'in_progress',
            progress: 60,
            actionText: 'Aportar'
          },
          {
            id: '2', 
            type: 'medium',
            title: 'Eliminar Deuda Banorte',
            emoji: '💳',
            targetAmount: 3200,
            currentAmount: 800,
            deadline: '2025-02-15',
            status: 'in_progress',
            progress: 25,
            actionText: 'Pagar'
          },
          {
            id: '3',
            type: 'long',
            title: 'Fondo para Mudanza',
            emoji: '🏡',
            targetAmount: 20000,
            currentAmount: 1000,
            deadline: '2025-08-15',
            status: 'in_progress', 
            progress: 5,
            actionText: 'Ahorrar'
          }
        ],
        journey: {
          steps: [
            { id: '1', title: 'Fondo', emoji: '🟢', status: 'in_progress' },
            { id: '2', title: 'Deuda', emoji: '💳', status: 'in_progress' },
            { id: '3', title: 'Mudanza', emoji: '🏡', status: 'pending' },
            { id: '4', title: 'Libertad', emoji: '🎉', status: 'pending' }
          ],
          currentStep: 1
        },
        crediMessage: {
          id: Date.now().toString(),
          text: "¡Increíble! Ya llevas $240 de los $400 para tu fondo de emergencia. ¿Quieres acelerar el ritmo?",
          timestamp: new Date().toISOString(),
          type: 'motivational'
        },
        lastUpdate: new Date().toISOString()
      }
      
      setDashboardData(mockData)
      setIsLoading(false)
    }

    loadPlanData()
  }, [])

  const getPersonalizedGreeting = (): string => {
    const hour = new Date().getHours()
    const name = "María" // En producción vendría del usuario autenticado
    
    if (hour < 12) {
      return `¡Buenos días, ${name}!`
    } else if (hour < 18) {
      return `¡Buenas tardes, ${name}!`
    } else {
      return `¡Buenas noches, ${name}!`
    }
  }

  const updateGoalProgress = (goalId: string, amount: number) => {
    if (!dashboardData) return

    setDashboardData(prev => {
      if (!prev) return prev
      
      const updatedGoals = prev.goals.map(goal => {
        if (goal.id === goalId) {
          const newCurrent = goal.currentAmount + amount
          const newProgress = Math.min((newCurrent / goal.targetAmount) * 100, 100)
          
          return {
            ...goal,
            currentAmount: newCurrent,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' as const : 'in_progress' as const
          }
        }
        return goal
      })
      
      return { ...prev, goals: updatedGoals }
    })
  }

  const markGoalCompleted = (goalId: string) => {
    if (!dashboardData) return
    
    setDashboardData(prev => {
      if (!prev) return prev
      
      const updatedGoals = prev.goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'completed' as const, progress: 100 }
          : goal
      )
      
      return { ...prev, goals: updatedGoals }
    })
  }

  return {
    dashboardData,
    isLoading,
    updateGoalProgress,
    markGoalCompleted,
    refetch: () => window.location.reload()
  }
}
