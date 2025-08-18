
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Income, CreateIncomeData } from '../types/income.types'

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
      
      // Convert to domain type
      return (data || []).map(dbIncome => ({
        id: dbIncome.id,
        userId: dbIncome.user_id,
        source: dbIncome.source,
        amount: { amount: dbIncome.amount, currency: 'MXN' as const },
        frequency: dbIncome.frequency as 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly',
        isActive: dbIncome.is_active,
        description: dbIncome.description || '',
        createdAt: dbIncome.created_at,
        updatedAt: dbIncome.updated_at
      })) as Income[]
    },
    enabled: !!user?.id,
  })

  // Create income mutation
  const createIncomeMutation = useMutation({
    mutationFn: async (incomeData: CreateIncomeData) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('incomes')
        .insert({
          user_id: user.id,
          source: incomeData.source,
          amount: incomeData.amount.amount,
          frequency: incomeData.frequency,
          is_active: incomeData.isActive ?? true
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
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
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CreateIncomeData>) => {
      const { data, error } = await supabase
        .from('incomes')
        .update({
          source: updates.source,
          amount: updates.amount?.amount,
          frequency: updates.frequency,
          is_active: updates.isActive
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
      toast({
        title: "Ingreso actualizado",
        description: "Los cambios se han guardado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el ingreso.",
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
      queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
      toast({
        title: "Ingreso eliminado",
        description: "La fuente de ingresos se ha eliminado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el ingreso.",
        variant: "destructive",
      })
    },
  })

  // Calculate totals
  const totalMonthlyIncome = incomes.reduce((sum, income) => {
    if (!income.isActive) return sum
    
    const amount = income.amount.amount
    switch (income.frequency) {
      case 'daily':
        return sum + (amount * 30)
      case 'weekly':
        return sum + (amount * 4)
      case 'biweekly':
        return sum + (amount * 2)
      case 'yearly':
        return sum + (amount / 12)
      case 'monthly':
      default:
        return sum + amount
    }
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
