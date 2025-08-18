
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { SavingsGoal, CreateSavingsGoalData, SavingsGoalStatus } from '../types/savings.types'

export const useGoals = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch goals
  const {
    data: goals = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Convert to domain type
      return (data || []).map(dbGoal => ({
        id: dbGoal.id,
        userId: dbGoal.user_id,
        title: dbGoal.title,
        description: dbGoal.description,
        targetAmount: { amount: dbGoal.target_amount || 0, currency: 'MXN' as const },
        currentAmount: { amount: dbGoal.current_amount || 0, currency: 'MXN' as const },
        targetDate: dbGoal.deadline, // Map deadline to targetDate
        priority: (dbGoal.priority || 'medium') as 'high' | 'medium' | 'low',
        status: dbGoal.status as SavingsGoalStatus,
        createdAt: dbGoal.created_at,
        updatedAt: dbGoal.updated_at
      })) as SavingsGoal[]
    },
    enabled: !!user?.id,
  })

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: CreateSavingsGoalData) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description,
          target_amount: goalData.targetAmount.amount,
          current_amount: goalData.currentAmount?.amount || 0,
          deadline: goalData.targetDate, // Map targetDate to deadline
          priority: goalData.priority || 'medium',
          status: goalData.status || 'active'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast({
        title: "Meta creada",
        description: "La meta se ha creado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la meta.",
        variant: "destructive",
      })
    },
  })

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CreateSavingsGoalData>) => {
      const { data, error } = await supabase
        .from('goals')
        .update({
          title: updates.title,
          description: updates.description,
          target_amount: updates.targetAmount?.amount,
          current_amount: updates.currentAmount?.amount,
          deadline: updates.targetDate,
          priority: updates.priority,
          status: updates.status
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast({
        title: "Meta actualizada",
        description: "Los cambios se han guardado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la meta.",
        variant: "destructive",
      })
    },
  })

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast({
        title: "Meta eliminada",
        description: "La meta se ha eliminado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la meta.",
        variant: "destructive",
      })
    },
  })

  const activeGoals = goals.filter(goal => goal.status === 'active')
  const completedGoals = goals.filter(goal => goal.status === 'completed')

  return {
    goals,
    activeGoals,
    completedGoals,
    isLoading,
    error,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
  }
}
