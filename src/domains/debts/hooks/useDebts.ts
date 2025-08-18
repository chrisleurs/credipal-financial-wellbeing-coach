
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Debt, DebtPayment } from '../types/debt.types'

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
      
      return (data || []).map(dbDebt => ({
        id: dbDebt.id,
        user_id: dbDebt.user_id,
        creditor: dbDebt.creditor,
        original_amount: dbDebt.original_amount,
        current_balance: dbDebt.current_balance,
        monthly_payment: dbDebt.monthly_payment,
        interest_rate: dbDebt.interest_rate,
        due_date: dbDebt.due_date,
        status: dbDebt.status,
        priority: 'medium',
        description: dbDebt.description,
        created_at: dbDebt.created_at,
        updated_at: dbDebt.updated_at
      })) as Debt[]
    },
    enabled: !!user?.id,
  })

  // Fetch payments
  const {
    data: payments = [],
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
      
      return (data || []).map(payment => ({
        id: payment.id,
        debt_id: payment.debt_id,
        user_id: payment.user_id,
        amount: payment.amount,
        payment_date: payment.payment_date,
        notes: payment.notes,
        created_at: payment.created_at
      })) as DebtPayment[]
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
          status: debtData.status,
          description: debtData.description
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
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      const { data, error } = await supabase
        .from('debts')
        .update({
          creditor: updates.creditor,
          original_amount: updates.original_amount,
          current_balance: updates.current_balance,
          monthly_payment: updates.monthly_payment,
          interest_rate: updates.interest_rate,
          due_date: updates.due_date,
          status: updates.status,
          description: updates.description
        })
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

  // Register payment mutation
  const registerPaymentMutation = useMutation({
    mutationFn: async (paymentData: {
      debt_id: string
      amount: number
      payment_date: string
      notes?: string
    }) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('debt_payments')
        .insert({
          user_id: user.id,
          debt_id: paymentData.debt_id,
          amount: paymentData.amount,
          payment_date: paymentData.payment_date,
          notes: paymentData.notes
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

  // Calculate totals
  const totalDebt = debts.reduce((sum, debt) => sum + debt.current_balance, 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthly_payment, 0)

  return {
    debts,
    payments,
    totalDebt,
    totalMonthlyPayments,
    isLoading,
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
