
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { AIGeneratedFinancialPlan } from '@/types/aiPlan'

export const useAIFinancialPlan = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get active AI-generated financial plan
  const activePlan = useQuery({
    queryKey: ['ai-financial-plan', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .in('plan_type', ['openai-enhanced', 'credipal-3-2-1'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Parse plan data helper with proper typing
  const parsedPlan: AIGeneratedFinancialPlan | null = (() => {
    if (!activePlan.data?.plan_data) return null
    
    try {
      // Handle both object and string cases
      const planData = typeof activePlan.data.plan_data === 'string' 
        ? JSON.parse(activePlan.data.plan_data) 
        : activePlan.data.plan_data
      
      // Type guard to ensure it's an object
      if (typeof planData === 'object' && planData !== null && !Array.isArray(planData)) {
        return planData as AIGeneratedFinancialPlan
      }
      
      return null
    } catch (error) {
      console.error('Error parsing plan data:', error)
      return null
    }
  })()

  // Update plan progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (updates: Partial<AIGeneratedFinancialPlan>) => {
      if (!activePlan.data?.id) throw new Error('No active plan found')

      const updatedPlanData = {
        ...parsedPlan,
        ...updates,
        lastUpdated: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updatedPlanData as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', activePlan.data.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-financial-plan'] })
      toast({
        title: "Progreso actualizado",
        description: "Tu avance ha sido guardado exitosamente.",
      })
    },
    onError: (error) => {
      console.error('Error updating plan:', error)
      toast({
        title: "Error actualizando progreso",
        description: "No se pudo guardar tu progreso. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  // Mark goal as completed
  const markGoalCompleted = (goalId: string) => {
    if (!parsedPlan?.goals) return

    const updatedGoals = parsedPlan.goals.map((goal) => 
      goal.id === goalId 
        ? { ...goal, status: 'completed' as const, progress: 100, completedAt: new Date().toISOString() }
        : goal
    )

    updateProgressMutation.mutate({ goals: updatedGoals })
  }

  // Update goal progress
  const updateGoalProgress = (goalId: string, newProgress: number) => {
    if (!parsedPlan?.goals) return

    const updatedGoals = parsedPlan.goals.map((goal) => 
      goal.id === goalId 
        ? { 
            ...goal, 
            progress: Math.min(newProgress, 100),
            status: newProgress >= 100 ? 'completed' as const : 'in_progress' as const,
            lastUpdated: new Date().toISOString()
          }
        : goal
    )

    updateProgressMutation.mutate({ goals: updatedGoals })
  }

  return {
    activePlan: activePlan.data,
    parsedPlan,
    isLoadingPlan: activePlan.isLoading,
    planError: activePlan.error,
    hasActivePlan: !!activePlan.data,
    markGoalCompleted,
    updateGoalProgress,
    updateProgress: updateProgressMutation.mutate,
    isUpdating: updateProgressMutation.isPending,
    refetch: activePlan.refetch
  }
}
