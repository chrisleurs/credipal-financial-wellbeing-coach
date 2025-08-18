
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Income } from '../types/income.types'

export const useIncomes = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch income sources
  const {
    data: incomes = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['income-sources', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('income_sources')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Convert to domain type
      return (data || []).map(dbIncome => ({
        id: dbIncome.id,
        userId: dbIncome.user_id,
        source: dbIncome.source,
        amount: { amount: dbIncome.amount, currency: 'MXN' as const },
        frequency: dbIncome.frequency,
        isActive: dbIncome.is_active,
        description: dbIncome.description,
        createdAt: dbIncome.created_at,
        updatedAt: dbIncome.updated_at
      })) as Income[]
    },
    enabled: !!user?.id,
  })

  // Create income mutation
  const createIncomeMutation = useMutation({
    mutationFn: async (incomeData: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('income_sources')
        .insert({
          user_id: user.id,
          source: incomeData.source,
          amount: incomeData.amount.amount,
          frequency: incomeData.frequency,
          is_active: incomeData.isActive,
          description: incomeData.description
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
      toast({
        title: "Ingreso agregado",
        description: "La fuente de ingresos se ha registrado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar la fuente de ingresos.",
        variant: "destructive",
      })
    },
  })

  // Update income mutation
  const updateIncomeMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Income> & { id: string }) => {
      const { data, error } = await supabase
        .from('income_sources')
        .update({
          source: updates.source,
          amount: updates.amount?.amount,
          frequency: updates.frequency,
          is_active: updates.isActive,
          description: updates.description
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
      toast({
        title: "Ingreso actualizado",
        description: "Los cambios se han guardado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la fuente de ingresos.",
        variant: "destructive",
      })
    },
  })

  // Delete income mutation
  const deleteIncomeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('income_sources')
        .update({ is_active: false })
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
      toast({
        title: "Ingreso eliminado",
        description: "La fuente de ingresos se ha eliminado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la fuente de ingresos.",
        variant: "destructive",
      })
    },
  })

  const totalMonthlyIncome = incomes.reduce((sum, income) => {
    const multiplier = income.frequency === 'weekly' ? 4 : 
                      income.frequency === 'biweekly' ? 2 : 
                      income.frequency === 'yearly' ? 1/12 : 1
    return sum + (income.amount.amount * multiplier)
  }, 0)

  return {
    incomes,
    totalMonthlyIncome,
    isLoading,
    error,
    createIncome: createIncomeMutation.mutate,
    updateIncome: updateIncomeMutation.mutate,
    deleteIncome: deleteIncomeMutation.mutate,
    isCreating: createIncomeMutation.isPending,
    isUpdating: updateIncomeMutation.isPending,
    isDeleting: deleteIncomeMutation.isPending,
  }
}
