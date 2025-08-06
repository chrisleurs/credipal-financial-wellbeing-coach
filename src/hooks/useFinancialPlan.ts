
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import type { DashboardData, FinancialGoal, CrediMessage, FinancialJourney } from '@/types/financialPlan'

export const useFinancialPlan = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasActivePlan, setHasActivePlan] = useState(false)

  useEffect(() => {
    if (user) {
      loadPlanData()
    }
  }, [user])

  const loadPlanData = async () => {
    if (!user) return
    
    setIsLoading(true)
    
    try {
      // Check if user has an active plan
      const { data: planData } = await supabase
        .from('user_financial_plans')
        .select('plan_data')
        .eq('user_id', user.id)
        .single()

      if (planData?.plan_data && typeof planData.plan_data === 'object' && planData.plan_data !== null) {
        const planDataObj = planData.plan_data as any
        if (planDataObj.goals) {
          // User has an active plan
          setHasActivePlan(true)
          setDashboardData(convertPlanToDashboard(planDataObj))
        } else {
          // No active plan
          setHasActivePlan(false)
          setDashboardData(null)
        }
      } else {
        // No active plan
        setHasActivePlan(false)
        setDashboardData(null)
      }
    } catch (error) {
      console.error('Error loading plan data:', error)
      setHasActivePlan(false)
      setDashboardData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const convertPlanToDashboard = (planData: any): DashboardData => {
    const goals: FinancialGoal[] = planData.goals || []
    
    return {
      greeting: getPersonalizedGreeting(),
      motivationalMessage: planData.motivationalMessage || "¡Sigue adelante con tu plan!",
      goals,
      journey: generateJourney(goals),
      crediMessage: {
        id: Date.now().toString(),
        text: getCrediMessage(goals),
        timestamp: new Date().toISOString(),
        type: 'motivational'
      },
      lastUpdate: new Date().toISOString()
    }
  }

  const generateJourney = (goals: FinancialGoal[]): FinancialJourney => {
    const steps = [
      { 
        id: '1', 
        title: goals[0]?.title.split(' ')[0] || 'Fondo', 
        emoji: goals[0]?.emoji || '🟢', 
        status: goals[0]?.progress > 0 ? 'in_progress' as const : 'pending' as const 
      },
      { 
        id: '2', 
        title: goals[1]?.title.split(' ')[0] || 'Deuda', 
        emoji: goals[1]?.emoji || '💳', 
        status: goals[1]?.progress > 0 ? 'in_progress' as const : 'pending' as const 
      },
      { 
        id: '3', 
        title: goals[2]?.title.split(' ')[0] || 'Meta', 
        emoji: goals[2]?.emoji || '🏡', 
        status: goals[2]?.progress > 0 ? 'in_progress' as const : 'pending' as const 
      },
      { 
        id: '4', 
        title: 'Libertad', 
        emoji: '🎉', 
        status: 'pending' as const 
      }
    ]

    const completedGoals = goals.filter(g => g.progress >= 100).length
    const currentStep = Math.min(completedGoals, 3)

    return { steps, currentStep }
  }

  const getCrediMessage = (goals: FinancialGoal[]): string => {
    const activeGoals = goals.filter(g => g.progress > 0 && g.progress < 100)
    
    if (activeGoals.length > 0) {
      const topGoal = activeGoals.reduce((prev, current) => 
        (prev.progress > current.progress) ? prev : current
      )
      return `¡Genial! Ya llevas ${Math.round(topGoal.progress)}% en "${topGoal.title}". ¿Quieres acelerar el ritmo?`
    }
    
    return "¡Es momento de comenzar! Tus metas te están esperando. 🚀"
  }

  const getPersonalizedGreeting = (): string => {
    const hour = new Date().getHours()
    const name = "Usuario" // In production this would come from authenticated user
    
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
    hasActivePlan,
    updateGoalProgress,
    markGoalCompleted,
    refetch: loadPlanData
  }
}
