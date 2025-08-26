
import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { debounce } from 'lodash'
import type { 
  FinancialCoachPlan, 
  BigGoal, 
  MiniGoal, 
  ImmediateAction,
  CoachingUIState 
} from '@/types/coach'

// Hook options and configuration
interface UseFinancialPlanOptions {
  enableRealtime?: boolean
  cacheTimeout?: number
  retryAttempts?: number
  optimisticUpdates?: boolean
}

interface UseFinancialPlanReturn {
  // Core data
  plan: FinancialCoachPlan | null
  loading: boolean
  error: string | null
  
  // Granular loading states
  loadingStates: {
    refreshing: boolean
    updatingBigGoal: boolean
    updatingMiniGoal: boolean
    completingAction: boolean
  }
  
  // Update methods
  updateBigGoal: (goalId: string, updates: Partial<BigGoal>) => Promise<void>
  completeMiniGoal: (goalId: string) => Promise<void>
  completeAction: (actionId: string) => Promise<void>
  refreshPlan: () => Promise<void>
  
  // Utility methods
  invalidateCache: () => void
  retryLastOperation: () => Promise<void>
  
  // Metrics
  isStale: boolean
  lastUpdated: string | null
}

const DEFAULT_OPTIONS: UseFinancialPlanOptions = {
  enableRealtime: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  optimisticUpdates: true
}

export const useFinancialPlan = (
  userId?: string, 
  options: UseFinancialPlanOptions = {}
): UseFinancialPlanReturn => {
  const { user } = useAuth()
  const { data: financialData } = useOptimizedFinancialData()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const config = { ...DEFAULT_OPTIONS, ...options }
  const effectiveUserId = userId || user?.id
  
  // Local state for granular loading management
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    updatingBigGoal: false,
    updatingMiniGoal: false,
    completingAction: false
  })
  
  const [lastOperation, setLastOperation] = useState<(() => Promise<void>) | null>(null)
  const retryCountRef = useRef(0)

  // Query key for caching
  const planQueryKey = ['financial-plan', effectiveUserId]
  
  // Fetch financial plan with caching and error handling
  const planQuery = useQuery({
    queryKey: planQueryKey,
    queryFn: async (): Promise<FinancialCoachPlan | null> => {
      if (!effectiveUserId) throw new Error('User ID is required')

      console.log(`Fetching financial plan for user: ${effectiveUserId}`)
      
      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('plan_type', 'coach-3-2-1')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching financial plan:', error)
        throw error
      }
      
      if (!data?.plan_data) {
        console.log('No active financial plan found')
        return null
      }

      // Parse plan data safely
      try {
        const planData = typeof data.plan_data === 'string' 
          ? JSON.parse(data.plan_data) 
          : data.plan_data
        
        return planData as FinancialCoachPlan
      } catch (parseError) {
        console.error('Error parsing plan data:', parseError)
        throw new Error('Invalid plan data format')
      }
    },
    enabled: !!effectiveUserId,
    staleTime: config.cacheTimeout,
    gcTime: config.cacheTimeout * 2,
    retry: (failureCount, error) => {
      console.log(`Query retry attempt ${failureCount}:`, error)
      return failureCount < config.retryAttempts
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  // Optimistic update helper
  const performOptimisticUpdate = useCallback((
    updateFn: (plan: FinancialCoachPlan) => FinancialCoachPlan
  ) => {
    if (!config.optimisticUpdates || !planQuery.data) return

    queryClient.setQueryData(planQueryKey, updateFn)
  }, [queryClient, planQueryKey, planQuery.data, config.optimisticUpdates])

  // Rollback optimistic update helper
  const rollbackOptimisticUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: planQueryKey })
  }, [queryClient, planQueryKey])

  // Database update mutation with retry logic
  const updatePlanMutation = useMutation({
    mutationFn: async (updatedPlan: FinancialCoachPlan) => {
      if (!effectiveUserId) throw new Error('User ID is required')

      console.log('Updating financial plan in database')
      
      const { data, error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updatedPlan as any,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', effectiveUserId)
        .eq('plan_type', 'coach-3-2-1')
        .eq('status', 'active')
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      console.log('Plan updated successfully')
      queryClient.invalidateQueries({ queryKey: planQueryKey })
      retryCountRef.current = 0
    },
    onError: (error) => {
      console.error('Plan update failed:', error)
      rollbackOptimisticUpdate()
      
      if (retryCountRef.current < config.retryAttempts) {
        retryCountRef.current++
        toast({
          title: "Error temporal",
          description: `Reintentando actualización... (${retryCountRef.current}/${config.retryAttempts})`,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Error actualizando plan",
          description: "No se pudo guardar los cambios. Intenta nuevamente.",
          variant: "destructive"
        })
      }
    }
  })

  // Debounced database update to prevent spam
  const debouncedUpdate = useCallback(
    debounce((updatedPlan: FinancialCoachPlan) => {
      updatePlanMutation.mutate(updatedPlan)
    }, 1000),
    [updatePlanMutation]
  )

  // Update big goal with optimistic updates
  const updateBigGoal = useCallback(async (goalId: string, updates: Partial<BigGoal>): Promise<void> => {
    if (!planQuery.data) throw new Error('No plan data available')

    setLoadingStates(prev => ({ ...prev, updatingBigGoal: true }))
    setLastOperation(() => () => updateBigGoal(goalId, updates))

    try {
      // Optimistic update
      const optimisticUpdate = (plan: FinancialCoachPlan): FinancialCoachPlan => ({
        ...plan,
        bigGoals: plan.bigGoals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                ...updates, 
                updatedAt: new Date().toISOString(),
                status: updates.progress && updates.progress >= 100 ? 'completed' : goal.status
              }
            : goal
        ),
        updatedAt: new Date().toISOString()
      })

      performOptimisticUpdate(optimisticUpdate)
      
      // Debounced database update
      const updatedPlan = optimisticUpdate(planQuery.data)
      debouncedUpdate(updatedPlan)
      
      toast({
        title: "Progreso actualizado! 📈",
        description: "Tu avance ha sido guardado exitosamente.",
      })

    } catch (error) {
      console.error('Error updating big goal:', error)
      throw error
    } finally {
      setLoadingStates(prev => ({ ...prev, updatingBigGoal: false }))
    }
  }, [planQuery.data, performOptimisticUpdate, debouncedUpdate, toast])

  // Complete mini goal with celebration
  const completeMiniGoal = useCallback(async (goalId: string): Promise<void> => {
    if (!planQuery.data) throw new Error('No plan data available')

    setLoadingStates(prev => ({ ...prev, updatingMiniGoal: true }))
    setLastOperation(() => () => completeMiniGoal(goalId))

    try {
      const optimisticUpdate = (plan: FinancialCoachPlan): FinancialCoachPlan => ({
        ...plan,
        miniGoals: plan.miniGoals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                isCompleted: true,
                completedAt: new Date().toISOString(),
                currentValue: goal.targetValue
              }
            : goal
        ),
        stats: {
          ...plan.stats,
          completedMiniGoals: plan.stats.completedMiniGoals + 1,
          totalPoints: plan.stats.totalPoints + (plan.miniGoals.find(g => g.id === goalId)?.points || 0)
        },
        updatedAt: new Date().toISOString()
      })

      performOptimisticUpdate(optimisticUpdate)
      
      const updatedPlan = optimisticUpdate(planQuery.data)
      debouncedUpdate(updatedPlan)
      
      const completedGoal = planQuery.data.miniGoals.find(g => g.id === goalId)
      
      toast({
        title: "¡Mini-meta completada! 🎉",
        description: completedGoal ? `${completedGoal.completionReward}` : "¡Excelente trabajo!",
      })

    } catch (error) {
      console.error('Error completing mini goal:', error)
      throw error
    } finally {
      setLoadingStates(prev => ({ ...prev, updatingMiniGoal: false }))
    }
  }, [planQuery.data, performOptimisticUpdate, debouncedUpdate, toast])

  // Complete immediate action
  const completeAction = useCallback(async (actionId: string): Promise<void> => {
    if (!planQuery.data) throw new Error('No plan data available')

    setLoadingStates(prev => ({ ...prev, completingAction: true }))
    setLastOperation(() => () => completeAction(actionId))

    try {
      const optimisticUpdate = (plan: FinancialCoachPlan): FinancialCoachPlan => ({
        ...plan,
        immediateAction: {
          ...plan.immediateAction,
          isCompleted: true,
          completedAt: new Date().toISOString()
        },
        stats: {
          ...plan.stats,
          completedActions: plan.stats.completedActions + 1
        },
        updatedAt: new Date().toISOString()
      })

      performOptimisticUpdate(optimisticUpdate)
      
      const updatedPlan = optimisticUpdate(planQuery.data)
      debouncedUpdate(updatedPlan)
      
      toast({
        title: "¡Acción completada! ✅",
        description: `Impacto: ${planQuery.data.immediateAction.impact}`,
      })

    } catch (error) {
      console.error('Error completing action:', error)
      throw error
    } finally {
      setLoadingStates(prev => ({ ...prev, completingAction: false }))
    }
  }, [planQuery.data, performOptimisticUpdate, debouncedUpdate, toast])

  // Refresh plan data
  const refreshPlan = useCallback(async (): Promise<void> => {
    setLoadingStates(prev => ({ ...prev, refreshing: true }))
    
    try {
      await planQuery.refetch()
      toast({
        title: "Plan actualizado",
        description: "Datos sincronizados con el servidor.",
      })
    } catch (error) {
      console.error('Error refreshing plan:', error)
      toast({
        title: "Error actualizando",
        description: "No se pudo actualizar el plan. Intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }))
    }
  }, [planQuery, toast])

  // Retry last failed operation
  const retryLastOperation = useCallback(async (): Promise<void> => {
    if (!lastOperation) return
    
    try {
      await lastOperation()
      setLastOperation(null)
    } catch (error) {
      console.error('Retry failed:', error)
      throw error
    }
  }, [lastOperation])

  // Cache invalidation
  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: planQueryKey })
  }, [queryClient, planQueryKey])

  // Real-time subscriptions
  useEffect(() => {
    if (!config.enableRealtime || !effectiveUserId) return

    console.log('Setting up real-time subscription for financial plans')
    
    const channel = supabase
      .channel(`financial-plans-${effectiveUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_plans',
          filter: `user_id=eq.${effectiveUserId}`
        },
        (payload) => {
          console.log('Real-time update received:', payload)
          queryClient.invalidateQueries({ queryKey: planQueryKey })
        }
      )
      .subscribe()

    return () => {
      console.log('Cleaning up real-time subscription')
      supabase.removeChannel(channel)
    }
  }, [config.enableRealtime, effectiveUserId, queryClient, planQueryKey])

  // Calculate if data is stale
  const isStale = planQuery.isStale || 
    (planQuery.dataUpdatedAt && Date.now() - planQuery.dataUpdatedAt > config.cacheTimeout)

  return {
    // Core data
    plan: planQuery.data || null,
    loading: planQuery.isLoading,
    error: planQuery.error?.message || null,
    
    // Granular loading states
    loadingStates,
    
    // Update methods
    updateBigGoal,
    completeMiniGoal,
    completeAction,
    refreshPlan,
    
    // Utility methods
    invalidateCache,
    retryLastOperation,
    
    // Metrics
    isStale: isStale || false,
    lastUpdated: planQuery.dataUpdatedAt ? new Date(planQuery.dataUpdatedAt).toISOString() : null
  }
}

// Export hook options for external configuration
export type { UseFinancialPlanOptions, UseFinancialPlanReturn }
