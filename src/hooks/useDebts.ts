
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'
import type { Debt } from '@/types/database'

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
      return (data || []) as Debt[]
    },
    enabled: !!user?.id,
  })

  // Create debt mutation
  const createDebtMutation = useMutation({
    mutationFn: async (debtData: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('debts')
        .insert({
          user_id: user.id,
          creditor: debtData.creditor,
          original_amount: debtData.original_amount,
          current_balance: debtData.current_balance,
          monthly_payment: debtData.monthly_payment,
          interest_rate: debtData.interest_rate,
          due_date: debtData.due_date,
          status: debtData.status || 'active'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
      toast({
        title: "Deuda agregada",
        description: "La deuda se ha registrado exitosamente.",
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
    mutationFn: async ({ id, ...updates }: Partial<Debt> & { id: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
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
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
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

  // Mock payment registration (since we don't have payments table yet)
  const registerPaymentMutation = useMutation({
    mutationFn: async (paymentData: {
      debt_id: string
      amount: number
      payment_date: string
      notes?: string
    }) => {
      // For now, just update the debt balance
      const debt = debts.find(d => d.id === paymentData.debt_id)
      if (!debt) throw new Error('Debt not found')
      
      const newBalance = Math.max(0, debt.current_balance - paymentData.amount)
      
      const { data, error } = await supabase
        .from('debts')
        .update({ current_balance: newBalance })
        .eq('id', paymentData.debt_id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
      toast({
        title: "Pago registrado",
        description: "El pago se ha registrado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar el pago.",
        variant: "destructive",
      })
    },
  })

  const activeDebts = debts.filter(debt => debt.status === 'active')
  const totalDebt = activeDebts.reduce((sum, debt) => sum + debt.current_balance, 0)
  const totalMonthlyPayments = activeDebts.reduce((sum, debt) => sum + debt.monthly_payment, 0)

  return {
    debts,
    activeDebts,
    totalDebt,
    totalMonthlyPayments,
    payments: [], // Mock empty payments array
    isLoading,
    isLoadingDebts: isLoading,
    error,
    createDebt: createDebtMutation.mutate,
    updateDebt: updateDebtMutation.mutate,
    deleteDebt: deleteDebtMutation.mutate,
    registerPayment: registerPaymentMutation.mutate,
    isCreating: createDebtMutation.isPending,
    isUpdating: updateDebtMutation.isPending,
    isDeleting: deleteDebtMutation.isPending,
    isRegisteringPayment: registerPaymentMutation.isPending,
  }
}
