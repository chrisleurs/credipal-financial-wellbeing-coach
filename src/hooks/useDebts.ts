
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'
import type { Debt, DebtPayment, DebtReminder } from '@/types/debt'

export const useDebts = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch debts
  const {
    data: debts = [],
    isLoading: isLoadingDebts,
    error: debtsError
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

  // Fetch debt payments
  const {
    data: payments = [],
    isLoading: isLoadingPayments
  } = useQuery({
    queryKey: ['debt-payments', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('debt_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false })
      
      if (error) throw error
      return data as DebtPayment[]
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
          ...debtData,
          user_id: user.id,
          current_balance: debtData.total_amount // Initialize balance to total amount
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
        description: "La deuda se ha registrado exitosamente.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo agregar la deuda. Intenta de nuevo.",
        variant: "destructive",
      })
      console.error('Error creating debt:', error)
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
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] })
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

  // Register payment mutation
  const registerPaymentMutation = useMutation({
    mutationFn: async (paymentData: Omit<DebtPayment, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('debt_payments')
        .insert({
          ...paymentData,
          user_id: user.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      queryClient.invalidateQueries({ queryKey: ['debt-payments'] })
      toast({
        title: "¡Pago registrado!",
        description: "¡Excelente trabajo! Cada pago te acerca más a tu libertad financiera.",
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

  return {
    debts,
    payments,
    isLoadingDebts,
    isLoadingPayments,
    debtsError,
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
