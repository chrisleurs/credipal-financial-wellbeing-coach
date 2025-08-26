
import { useState, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { debounce } from 'lodash'

// Types for AI Plan
interface AIPlan {
  id: string
  version: number
  weekNumber: number
  totalWeeks: number
  overallProgress: number
  methodology: string
  bigGoals: Array<{
    id: string
    title: string
    targetAmount: number
    currentAmount: number
    progress: number
    status: 'active' | 'completed' | 'paused'
    timeline: string
    emoji: string
  }>
  miniGoals: Array<{
    id: string
    title: string
    description: string
    points: number
    isCompleted: boolean
    completedAt?: string
    emoji: string
    currentValue: number
    targetValue: number
    unit: string
  }>
  immediateAction: {
    id: string
    title: string
    description: string
    impact: string
    isCompleted: boolean
    completedAt?: string
    emoji: string
    estimatedMinutes: number
  }
  coachMessage: {
    text: string
    type: 'motivational' | 'warning' | 'celebration'
    personalizedGreeting: string
    nextStepSuggestion: string
  }
  stats: {
    completedBigGoals: number
    completedMiniGoals: number
    completedActions: number
    totalPoints: number
    streakDays: number
    streak: number // Backward compatibility alias
  }
  createdAt: string
  updatedAt: string
}

interface UseFinancialPlanReturn {
  // Core data
  financialData: any
  aiPlan: AIPlan | null
  plan: AIPlan | null // Alias for backward compatibility
  
  // Loading states
  loading: boolean
  isUpdatingGoal: boolean
  isGeneratingPlan: boolean
  isRefreshingData: boolean
  
  // Loading states object for backward compatibility
  loadingStates: {
    isUpdatingGoal: boolean
    isGeneratingPlan: boolean
    isRefreshingData: boolean
    refreshing: boolean // Backward compatibility
    updatingBigGoal: boolean // Backward compatibility
    updatingMiniGoal: boolean // Backward compatibility
    completingAction: boolean // Backward compatibility
  }
  
  // Methods
  updateBigGoal: (goalId: string, updates: any) => Promise<void>
  completeMiniGoal: (goalId: string) => Promise<void>
  completeAction: (actionId: string) => Promise<void>
  generateNewPlan: () => Promise<void>
  refreshAll: () => Promise<void>
  refreshPlan: () => Promise<void> // Alias for backward compatibility
  
  // Metadata
  lastSyncTime: Date | null
  lastUpdated: string | null // Backward compatibility alias
  isStale: boolean
  error: string | null
}

export const useFinancialPlan = (userId?: string): UseFinancialPlanReturn => {
  const { user } = useAuth()
  const effectiveUserId = userId || user?.id
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Local states for granular loading
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isRefreshingData, setIsRefreshingData] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  
  // Get base financial data
  const optimizedData = useOptimizedFinancialData()
  
  // Fetch AI Plan from financial_plans table
  const aiPlanQuery = useQuery({
    queryKey: ['financial-plan-ai', effectiveUserId],
    queryFn: async (): Promise<AIPlan | null> => {
      if (!effectiveUserId) throw new Error('User ID required')
      
      console.log('Fetching AI plan for user:', effectiveUserId)
      
      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('status', 'active')
        .in('plan_type', ['3-2-1', 'coach-3-2-1', 'credipal-3-2-1'])
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching AI plan:', error)
        throw error
      }
      
      // If no plan exists, generate a basic one
      if (!data) {
        console.log('No AI plan found, will generate basic plan')
        return await generateBasicPlan(effectiveUserId)
      }
      
      return transformPlanData(data)
    },
    enabled: !!effectiveUserId && !!optimizedData.data,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours cache
    gcTime: 48 * 60 * 60 * 1000, // 48 hours garbage collection
    retry: 2
  })

  // Transform database plan data to AIPlan format
  const transformPlanData = (dbPlan: any): AIPlan => {
    const planData = typeof dbPlan.plan_data === 'string' 
      ? JSON.parse(dbPlan.plan_data) 
      : dbPlan.plan_data

    const bigGoals = Array.isArray(planData.bigGoals) ? planData.bigGoals : []
    const miniGoals = Array.isArray(planData.miniGoals) ? planData.miniGoals : []

    return {
      id: dbPlan.id,
      version: dbPlan.version || 1,
      weekNumber: planData.weekNumber || 1,
      totalWeeks: planData.totalWeeks || 12,
      overallProgress: planData.overallProgress || 0,
      methodology: planData.methodology || '3-2-1',
      bigGoals: bigGoals.map((goal: any) => ({
        ...goal,
        emoji: goal.emoji || '🎯'
      })),
      miniGoals: miniGoals.map((goal: any) => ({
        ...goal,
        emoji: goal.emoji || '⭐',
        currentValue: goal.currentValue || 0,
        targetValue: goal.targetValue || 1,
        unit: goal.unit || 'tareas'
      })),
      immediateAction: planData.immediateAction ? {
        ...planData.immediateAction,
        emoji: planData.immediateAction.emoji || '⚡',
        estimatedMinutes: planData.immediateAction.estimatedMinutes || 15
      } : {
        id: 'default',
        title: 'Revisar gastos mensuales',
        description: 'Identifica oportunidades de ahorro',
        impact: 'Medio',
        isCompleted: false,
        emoji: '⚡',
        estimatedMinutes: 15
      },
      coachMessage: planData.coachMessage || {
        text: '¡Bienvenido a tu journey financiero!',
        type: 'motivational',
        personalizedGreeting: `¡Hola ${user?.user_metadata?.first_name || 'Usuario'}!`,
        nextStepSuggestion: 'Comencemos organizando tus finanzas'
      },
      stats: {
        completedBigGoals: planData.stats?.completedBigGoals || 0,
        completedMiniGoals: planData.stats?.completedMiniGoals || 0,
        completedActions: planData.stats?.completedActions || 0,
        totalPoints: planData.stats?.totalPoints || 0,
        streakDays: planData.stats?.streakDays || 0,
        streak: planData.stats?.streakDays || planData.stats?.streak || 0
      },
      createdAt: dbPlan.created_at,
      updatedAt: dbPlan.updated_at
    }
  }

  // Generate basic plan when none exists
  const generateBasicPlan = async (userId: string): Promise<AIPlan> => {
    console.log('Generating basic plan for user:', userId)
    
    const basicPlan: AIPlan = {
      id: `basic-${userId}`,
      version: 1,
      weekNumber: 1,
      totalWeeks: 12,
      overallProgress: 0,
      methodology: '3-2-1',
      bigGoals: [
        {
          id: 'goal-1',
          title: 'Crear fondo de emergencia',
          targetAmount: 10000,
          currentAmount: 0,
          progress: 0,
          status: 'active',
          timeline: '6 meses',
          emoji: '🛡️'
        },
        {
          id: 'goal-2', 
          title: 'Reducir gastos innecesarios',
          targetAmount: 2000,
          currentAmount: 0,
          progress: 0,
          status: 'active',
          timeline: '3 meses',
          emoji: '✂️'
        },
        {
          id: 'goal-3',
          title: 'Aumentar ingresos',
          targetAmount: 5000,
          currentAmount: 0,
          progress: 0,
          status: 'active',
          timeline: '12 meses',
          emoji: '📈'
        }
      ],
      miniGoals: [
        {
          id: 'mini-1',
          title: 'Revisar gastos de la semana',
          description: 'Analiza dónde va tu dinero',
          points: 10,
          isCompleted: false,
          emoji: '📊',
          currentValue: 0,
          targetValue: 1,
          unit: 'revisión'
        },
        {
          id: 'mini-2',
          title: 'Separar dinero para ahorro',
          description: 'Aparta al menos $500 esta semana',
          points: 20,
          isCompleted: false,
          emoji: '💰',
          currentValue: 0,
          targetValue: 500,
          unit: 'pesos'
        }
      ],
      immediateAction: {
        id: 'action-1',
        title: 'Revisar gastos del mes pasado',
        description: 'Identifica tus 3 gastos más grandes',
        impact: 'Alto',
        isCompleted: false,
        emoji: '⚡',
        estimatedMinutes: 15
      },
      coachMessage: {
        text: '¡Perfecto momento para tomar control de tus finanzas!',
        type: 'motivational',
        personalizedGreeting: `¡Hola ${user?.user_metadata?.first_name || 'Usuario'}!`,
        nextStepSuggestion: 'Empecemos con pequeños pasos que generen gran impacto'
      },
      stats: {
        completedBigGoals: 0,
        completedMiniGoals: 0,
        completedActions: 0,
        totalPoints: 0,
        streakDays: 1,
        streak: 1
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save basic plan to database - cast to any to avoid Json type issues
    await supabase
      .from('financial_plans')
      .insert({
        user_id: userId,
        plan_type: 'basic-3-2-1',
        plan_data: basicPlan as any,
        status: 'active',
        version: 1
      })

    return basicPlan
  }

  // Update Big Goal mutation with optimistic updates
  const updateBigGoalMutation = useMutation({
    mutationFn: async ({ goalId, updates }: { goalId: string; updates: any }) => {
      if (!effectiveUserId || !aiPlanQuery.data) throw new Error('Missing data')
      
      const updatedPlan = {
        ...aiPlanQuery.data,
        bigGoals: aiPlanQuery.data.bigGoals.map(goal =>
          goal.id === goalId 
            ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
            : goal
        ),
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updatedPlan as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', effectiveUserId)
        .eq('status', 'active')

      if (error) throw error
      return updatedPlan
    },
    onMutate: async ({ goalId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['financial-plan-ai', effectiveUserId] })
      
      // Snapshot previous value
      const previousPlan = queryClient.getQueryData(['financial-plan-ai', effectiveUserId])
      
      // Optimistically update cache
      queryClient.setQueryData(['financial-plan-ai', effectiveUserId], (old: AIPlan | undefined) => {
        if (!old) return old
        return {
          ...old,
          bigGoals: old.bigGoals.map(goal =>
            goal.id === goalId ? { ...goal, ...updates } : goal
          )
        }
      })
      
      return { previousPlan }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousPlan) {
        queryClient.setQueryData(['financial-plan-ai', effectiveUserId], context.previousPlan)
      }
      
      toast({
        title: "Error actualizando meta",
        description: "No se pudo guardar el progreso. Intenta nuevamente.",
        variant: "destructive"
      })
    },
    onSuccess: () => {
      setLastSyncTime(new Date())
      toast({
        title: "¡Progreso actualizado! 📈",
        description: "Tu avance ha sido guardado exitosamente.",
      })
    },
    onSettled: () => {
      setIsUpdatingGoal(false)
    }
  })

  // Complete Mini Goal mutation
  const completeMiniGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      if (!effectiveUserId || !aiPlanQuery.data) throw new Error('Missing data')
      
      const updatedPlan = {
        ...aiPlanQuery.data,
        miniGoals: aiPlanQuery.data.miniGoals.map(goal =>
          goal.id === goalId 
            ? { ...goal, isCompleted: true, completedAt: new Date().toISOString() }
            : goal
        ),
        stats: {
          ...aiPlanQuery.data.stats,
          completedMiniGoals: aiPlanQuery.data.stats.completedMiniGoals + 1,
          totalPoints: aiPlanQuery.data.stats.totalPoints + (aiPlanQuery.data.miniGoals.find(g => g.id === goalId)?.points || 0)
        },
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updatedPlan as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', effectiveUserId)
        .eq('status', 'active')

      if (error) throw error
      return updatedPlan
    },
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(['financial-plan-ai', effectiveUserId], updatedPlan)
      setLastSyncTime(new Date())
      
      const completedGoal = aiPlanQuery.data?.miniGoals.find(g => g.id === updatedPlan.miniGoals.find(mg => mg.isCompleted)?.id)
      
      toast({
        title: "¡Mini-meta completada! 🎉",
        description: `+${completedGoal?.points || 0} puntos. ¡Excelente trabajo!`,
      })
    },
    onError: () => {
      toast({
        title: "Error completando meta",
        description: "No se pudo marcar como completada. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  // Complete Action mutation
  const completeActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      if (!effectiveUserId || !aiPlanQuery.data) throw new Error('Missing data')
      
      const updatedPlan = {
        ...aiPlanQuery.data,
        immediateAction: {
          ...aiPlanQuery.data.immediateAction,
          isCompleted: true,
          completedAt: new Date().toISOString()
        },
        stats: {
          ...aiPlanQuery.data.stats,
          completedActions: aiPlanQuery.data.stats.completedActions + 1
        },
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updatedPlan as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', effectiveUserId)
        .eq('status', 'active')

      if (error) throw error
      return updatedPlan
    },
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(['financial-plan-ai', effectiveUserId], updatedPlan)
      setLastSyncTime(new Date())
      
      toast({
        title: "¡Acción completada! ✅",
        description: `Impacto: ${updatedPlan.immediateAction.impact}`,
      })
    }
  })

  // Generate New Plan mutation using edge function
  const generateNewPlanMutation = useMutation({
    mutationFn: async () => {
      if (!effectiveUserId || !optimizedData.data) throw new Error('Missing data')
      
      console.log('Generating new AI plan...')
      
      const { data, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: {
          userId: effectiveUserId,
          financialData: {
            name: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || user?.email || 'Usuario',
            monthlyIncome: optimizedData.data.monthlyIncome,
            monthlyExpenses: optimizedData.data.monthlyExpenses,
            totalDebt: optimizedData.data.totalDebtBalance,
            savingsCapacity: optimizedData.data.savingsCapacity,
            goals: optimizedData.data.activeGoals,
            debts: optimizedData.data.activeDebts
          }
        }
      })

      if (error) throw new Error(`AI generation failed: ${error.message}`)
      
      // Transform AI response to our AIPlan format
      const aiPlan: AIPlan = {
        id: `ai-${Date.now()}`,
        version: Date.now(),
        weekNumber: 1,
        totalWeeks: 12,
        overallProgress: 0,
        methodology: '3-2-1',
        bigGoals: data.bigGoals || [],
        miniGoals: data.miniGoals || [],
        immediateAction: data.immediateAction || {},
        coachMessage: {
          text: data.motivationalMessage || '¡Nuevo plan listo!',
          type: 'motivational',
          personalizedGreeting: `¡Hola ${user?.user_metadata?.first_name || 'Usuario'}!`,
          nextStepSuggestion: data.recommendations?.[0] || 'Sigamos con el plan'
        },
        stats: {
          completedBigGoals: 0,
          completedMiniGoals: 0,
          completedActions: 0,
          totalPoints: 0,
          streakDays: 1,
          streak: 1
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Save to financial_plans table - cast to any to avoid Json type issues
      await supabase
        .from('financial_plans')
        .upsert({
          user_id: effectiveUserId,
          plan_type: 'ai-3-2-1',
          plan_data: aiPlan as any,
          status: 'active',
          version: Date.now()
        })
        
      return aiPlan
    },
    onSuccess: (newPlan) => {
      queryClient.setQueryData(['financial-plan-ai', effectiveUserId], newPlan)
      setIsGeneratingPlan(false)
      setLastSyncTime(new Date())
      
      toast({
        title: "¡Nuevo plan generado! 🎯",
        description: "Tu plan financiero personalizado está listo.",
      })
    },
    onError: (error) => {
      setIsGeneratingPlan(false)
      console.error('Plan generation error:', error)
      
      toast({
        title: "Error generando plan",
        description: "No se pudo generar tu plan financiero. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  // Debounced update methods
  const debouncedUpdateBigGoal = useCallback(
    debounce((goalId: string, updates: any) => {
      setIsUpdatingGoal(true)
      updateBigGoalMutation.mutate({ goalId, updates })
    }, 1000),
    [updateBigGoalMutation]
  )

  // Public methods
  const updateBigGoal = useCallback(async (goalId: string, updates: any) => {
    debouncedUpdateBigGoal(goalId, updates)
  }, [debouncedUpdateBigGoal])

  const completeMiniGoal = useCallback(async (goalId: string) => {
    completeMiniGoalMutation.mutate(goalId)
  }, [completeMiniGoalMutation])

  const completeAction = useCallback(async (actionId: string) => {
    completeActionMutation.mutate(actionId)
  }, [completeActionMutation])

  const generateNewPlan = useCallback(async () => {
    setIsGeneratingPlan(true)
    generateNewPlanMutation.mutate()
  }, [generateNewPlanMutation])

  const refreshAll = useCallback(async () => {
    setIsRefreshingData(true)
    
    try {
      await Promise.all([
        optimizedData.refetch(),
        queryClient.invalidateQueries({ queryKey: ['financial-plan-ai', effectiveUserId] })
      ])
      
      setLastSyncTime(new Date())
      
      toast({
        title: "Datos actualizados",
        description: "Información sincronizada con el servidor.",
      })
    } catch (error) {
      toast({
        title: "Error actualizando",
        description: "No se pudieron actualizar los datos. Intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsRefreshingData(false)
    }
  }, [optimizedData, queryClient, effectiveUserId, toast])

  const refreshPlan = useCallback(async () => {
    await refreshAll()
  }, [refreshAll])

  const currentPlan = aiPlanQuery.data

  return {
    // Core data
    financialData: optimizedData.data,
    aiPlan: currentPlan,
    plan: currentPlan, // Backward compatibility alias
    
    // Loading states
    loading: optimizedData.isLoading || aiPlanQuery.isLoading,
    isUpdatingGoal,
    isGeneratingPlan,
    isRefreshingData,
    
    // Loading states object for backward compatibility
    loadingStates: {
      isUpdatingGoal,
      isGeneratingPlan,
      isRefreshingData,
      refreshing: isRefreshingData, // Backward compatibility
      updatingBigGoal: isUpdatingGoal, // Backward compatibility
      updatingMiniGoal: isUpdatingGoal, // Backward compatibility
      completingAction: isUpdatingGoal, // Backward compatibility
    },
    
    // Methods
    updateBigGoal,
    completeMiniGoal,
    completeAction,
    generateNewPlan,
    refreshAll,
    refreshPlan, // Backward compatibility alias
    
    // Metadata
    lastSyncTime,
    lastUpdated: lastSyncTime?.toISOString() || null, // Backward compatibility alias
    isStale: aiPlanQuery.isStale || false,
    error: optimizedData.error?.message || aiPlanQuery.error?.message || null
  }
}

// Export types for external use
export type { AIPlan, UseFinancialPlanReturn }
