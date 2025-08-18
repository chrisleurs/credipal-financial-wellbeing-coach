
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Debt, CreateDebtData, UpdateDebtData } from '../types/debt.types'

export const useDebts = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch debts
  const debtsQuery = useQuery({
    queryKey: ['debts', user?.id],
    queryFn: async (): Promise<Debt[]> => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user?.id,
  })

  // Create debt mutation
  const createMutation = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['debts', user?.id] })
    },
  })

  // Update debt mutation
  const updateMutation = useMutation({
    mutationFn: async (debtData: UpdateDebtData) => {
      const { data, error } = await supabase
        .from('debts')
        .update(debtData)
        .eq('id', debtData.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', user?.id] })
    },
  })

  // Delete debt mutation
  const deleteMutation = useMutation({
    mutationFn: async (debtId: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', debtId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts', user?.id] })
    },
  })

  const debts = debtsQuery.data || []
  const totalDebt = debts.reduce((sum, debt) => sum + debt.current_balance, 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthly_payment, 0)

  return {
    debts,
    totalDebt,
    totalMonthlyPayments,
    isLoading: debtsQuery.isLoading,
    error: debtsQuery.error,
    createDebt: createMutation.mutate,
    updateDebt: updateMutation.mutate,
    deleteDebt: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
