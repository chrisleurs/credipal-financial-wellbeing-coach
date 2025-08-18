
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Income, CreateIncomeData, UpdateIncomeData } from '../types/income.types'

export const useIncomes = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch incomes
  const {
    data: incomes = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['incomes', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Income[]
    },
    enabled: !!user?.id,
  })

  // Calculate monthly income
  const totalMonthlyIncome = incomes.reduce((sum, income) => {
    if (!income.is_active) return sum
    
    const multiplier = income.frequency === 'weekly' ? 4.33 :
                      income.frequency === 'biweekly' ? 2.17 :
                      income.frequency === 'yearly' ? 1/12 :
                      1 // monthly
    
    return sum + (income.amount * multiplier)
  }, 0)

  // Create income mutation
  const createIncomeMutation = useMutation({
    mutationFn: async (incomeData: CreateIncomeData) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('incomes')
        .insert({
          user_id: user.id,
          ...incomeData
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      toast({
        title: "Ingreso agregado",
        description: "La fuente de ingresos se ha agregado exitosamente.",
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
    mutationFn: async ({ id, ...updates }: UpdateIncomeData) => {
      const { data, error } = await supabase
        .from('incomes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
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
        .from('incomes')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
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
