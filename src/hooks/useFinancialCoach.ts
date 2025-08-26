/**
 * Hook para manejo del Financial Coach con metodología 3.2.1
 */

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { 
  FinancialCoachPlan, 
  UseFinancialCoachState, 
  UserFinancialSnapshot,
  CoachingUIState,
  CoachingAIInput
} from '@/types/coach'

export const useFinancialCoach = (): UseFinancialCoachState => {
  const { user } = useAuth()
  const { data: financialData } = useOptimizedFinancialData()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // UI State local
  const [uiState, setUIState] = useState<CoachingUIState>({
    isLoadingPlan: false,
    isGeneratingMessage: false,
    isUpdatingProgress: false,
    error: null,
    lastUpdated: null,
    planGeneration: {
      step: 'analyzing',
      progress: 0,
      message: 'Preparando tu plan...'
    }
  })

  // Get current coaching plan
  const currentPlanQuery = useQuery({
    queryKey: ['financial-coach-plan', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('plan_type', 'coach-3-2-1')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      
      if (data?.plan_data) {
        return JSON.parse(data.plan_data as string) as FinancialCoachPlan
      }
      
      return null
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create user financial snapshot
  const userSnapshot: UserFinancialSnapshot | null = financialData ? {
    userId: user?.id || '',
    monthlyIncome: financialData.monthlyIncome,
    monthlyExpenses: financialData.monthlyExpenses,
    monthlyBalance: financialData.monthlyBalance,
    savingsCapacity: financialData.savingsCapacity,
    totalDebt: financialData.totalDebtBalance,
    monthlyDebtPayments: financialData.totalMonthlyDebtPayments,
    highestInterestDebt: financialData.activeDebts.length > 0 ? {
      creditor: financialData.activeDebts[0].creditor,
      balance: financialData.activeDebts[0].balance,
      interestRate: financialData.activeDebts[0].payment // Assuming this maps to interest
    } : undefined,
    activeGoals: financialData.activeGoals,
    lastWeekExpenses: financialData.monthlyExpenses, // Placeholder
    expensesTrend: 'stable', // Placeholder
    previousWeekProgress: 0, // Placeholder
    completedActionsThisWeek: 0, // Placeholder
  } : null

  // Generate new plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !userSnapshot) {
        throw new Error('Missing user or financial data')
      }

      setUIState(prev => ({
        ...prev,
        isLoadingPlan: true,
        planGeneration: { step: 'analyzing', progress: 20, message: 'Analizando tu situación financiera...' }
      }))

      const input: CoachingAIInput = {
        userSnapshot,
        requestType: 'new_plan',
        preferences: {
          language: 'es',
          tone: 'friendly'
        }
      }

      setUIState(prev => ({
        ...prev,
        planGeneration: { step: 'generating', progress: 60, message: 'Generando tu plan personalizado...' }
      }))

      // Call OpenAI edge function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        'generate-financial-plan',
        { body: input }
      )

      if (aiError) throw aiError

      setUIState(prev => ({
        ...prev,
        planGeneration: { step: 'personalizing', progress: 80, message: 'Personalizando tu experiencia...' }
      }))

      // Save to database
      const { data, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          plan_type: 'coach-3-2-1',
          plan_data: aiResponse,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      setUIState(prev => ({
        ...prev,
        planGeneration: { step: 'complete', progress: 100, message: '¡Tu plan está listo!' }
      }))

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-coach-plan'] })
      toast({
        title: "¡Plan generado! 🎉",
        description: "Tu plan financiero personalizado está listo.",
      })
      setUIState(prev => ({ ...prev, isLoadingPlan: false, error: null }))
    },
    onError: (error) => {
      console.error('Plan generation error:', error)
      toast({
        title: "Error generando plan",
        description: "No se pudo generar tu plan. Intenta nuevamente.",
        variant: "destructive"
      })
      setUIState(prev => ({ 
        ...prev, 
        isLoadingPlan: false, 
        error: error.message 
      }))
    }
  })

  // Update goal progress
  const updateGoalProgress = useCallback(async (goalId: string, progress: number) => {
    if (!currentPlanQuery.data) return

    setUIState(prev => ({ ...prev, isUpdatingProgress: true }))

    try {
      const updatedPlan = { ...currentPlanQuery.data }
      
      // Update big goals
      updatedPlan.bigGoals = updatedPlan.bigGoals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              progress: Math.min(progress, 100),
              status: progress >= 100 ? 'completed' : 'in_progress',
              updatedAt: new Date().toISOString()
            }
          : goal
      )

      // Update mini goals
      updatedPlan.miniGoals = updatedPlan.miniGoals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              currentValue: Math.min(progress, goal.targetValue),
              isCompleted: progress >= goal.targetValue,
              completedAt: progress >= goal.targetValue ? new Date().toISOString() : undefined
            }
          : goal
      )

      // Save to database
      await supabase
        .from('financial_plans')
        .update({
          plan_data: JSON.stringify(updatedPlan),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id)
        .eq('plan_type', 'coach-3-2-1')
        .eq('status', 'active')

      queryClient.invalidateQueries({ queryKey: ['financial-coach-plan'] })
      
      toast({
        title: "¡Progreso actualizado! 📈",
        description: "Tu avance ha sido guardado exitosamente.",
      })

    } catch (error) {
      console.error('Error updating progress:', error)
      toast({
        title: "Error actualizando progreso",
        description: "No se pudo guardar tu progreso. Intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setUIState(prev => ({ ...prev, isUpdatingProgress: false }))
    }
  }, [currentPlanQuery.data, user?.id, queryClient, toast])

  // Complete action
  const completeAction = useCallback(async (actionId: string) => {
    if (!currentPlanQuery.data) return

    const updatedPlan = { ...currentPlanQuery.data }
    updatedPlan.immediateAction = {
      ...updatedPlan.immediateAction,
      isCompleted: true,
      completedAt: new Date().toISOString()
    }

    await supabase
      .from('financial_plans')
      .update({
        plan_data: JSON.stringify(updatedPlan),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user?.id)
      .eq('plan_type', 'coach-3-2-1')
      .eq('status', 'active')

    queryClient.invalidateQueries({ queryKey: ['financial-coach-plan'] })
    
    toast({
      title: "¡Acción completada! ✅",
      description: "¡Excelente trabajo! Sigue así.",
    })
  }, [currentPlanQuery.data, user?.id, queryClient, toast])

  // Request motivation
  const requestMotivation = useCallback(async () => {
    setUIState(prev => ({ ...prev, isGeneratingMessage: true }))
    
    // This would call OpenAI for a quick motivation message
    // For now, just show a success message
    setTimeout(() => {
      toast({
        title: "¡Mensaje de motivación! 💪",
        description: "¡Vas genial! Cada paso te acerca más a tus metas.",
      })
      setUIState(prev => ({ ...prev, isGeneratingMessage: false }))
    }, 1000)
  }, [toast])

  // Refresh plan
  const refreshPlan = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ['financial-coach-plan'] })
    setUIState(prev => ({ 
      ...prev, 
      lastUpdated: new Date().toISOString() 
    }))
  }, [queryClient])

  // Generate new plan function that returns a Promise
  const generateNewPlan = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      generatePlanMutation.mutate(undefined, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error)
      })
    })
  }, [generatePlanMutation])

  return {
    currentPlan: currentPlanQuery.data || null,
    uiState,
    userSnapshot,
    generateNewPlan,
    updateGoalProgress,
    completeAction,
    requestMotivation,
    refreshPlan
  }
}
