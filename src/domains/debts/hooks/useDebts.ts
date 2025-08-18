
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Debt, CreateDebtData, UpdateDebtData } from '../types/debt.types'

export const useDebts = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch debts
  const {
    data: debts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['debts', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Debt[]
    },
    enabled: !!user?.id,
  })

  // Create debt mutation
  const createDebtMutation = useMutation({
    mutationFn: async (debtData: CreateDebtData) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('debts')
        .insert({
          user_id: user.id,
          ...debtData
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      toast({
        title: "Deuda agregada",
        description: "La deuda se ha agregado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar la deuda.",
        variant: "destructive",
      })
    },
  })

  // Update debt mutation
  const updateDebtMutation = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateDebtData) => {
      const { data, error } = await supabase
        .from('debts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      toast({
        title: "Deuda actualizada",
        description: "Los cambios se han guardado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la deuda.",
        variant: "destructive",
      })
    },
  })

  // Delete debt mutation
  const deleteDebtMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      toast({
        title: "Deuda eliminada",
        description: "La deuda se ha eliminado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la deuda.",
        variant: "destructive",
      })
    },
  })

  // Calculate totals
  const totalDebt = debts.reduce((sum, debt) => sum + debt.current_balance, 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthly_payment, 0)

  return {
    debts,
    totalDebt,
    totalMonthlyPayments,
    isLoading,
    error,
    createDebt: createDebtMutation.mutate,
    updateDebt: updateDebtMutation.mutate,
    deleteDebt: deleteDebtMutation.mutate,
    isCreating: createDebtMutation.isPending,
    isUpdating: updateDebtMutation.isPending,
    isDeleting: deleteDebtMutation.isPending,
  }
}
