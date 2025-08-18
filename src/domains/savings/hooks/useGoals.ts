
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { SavingsGoal, CreateSavingsGoalData, UpdateSavingsGoalData } from '../types/savings.types'

export const useGoals = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch goals
  const goalsQuery = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<SavingsGoal[]> => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id,
  })

  // Create goal mutation
  const createMutation = useMutation({
    mutationFn: async (goalData: CreateSavingsGoalData) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          ...goalData
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] })
    },
  })

  // Update goal mutation
  const updateMutation = useMutation({
    mutationFn: async (goalData: UpdateSavingsGoalData) => {
      const { data, error } = await supabase
        .from('goals')
        .update(goalData)
        .eq('id', goalData.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] })
    },
  })

  // Delete goal mutation
  const deleteMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] })
    },
  })

  const goals = goalsQuery.data || []
  const activeGoals = goals.filter(goal => goal.status === 'active')
  const completedGoals = goals.filter(goal => goal.status === 'completed')

  return {
    goals,
    activeGoals,
    completedGoals,
    isLoading: goalsQuery.isLoading,
    error: goalsQuery.error,
    createGoal: createMutation.mutate,
    updateGoal: updateMutation.mutate,
    deleteGoal: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
