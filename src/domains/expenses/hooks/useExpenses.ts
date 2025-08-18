
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Expense, CreateExpenseData } from '../types/expense.types'

export const useExpenses = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch expenses
  const {
    data: expenses = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      
      if (error) throw error
      
      // Convert to domain type
      return (data || []).map(dbExpense => ({
        id: dbExpense.id,
        user_id: dbExpense.user_id,
        amount: dbExpense.amount,
        category: dbExpense.category,
        subcategory: dbExpense.subcategory,
        description: dbExpense.description || '',
        date: dbExpense.date,
        is_recurring: dbExpense.is_recurring || false,
        tags: [], // Empty array since tags column doesn't exist in DB
        created_at: dbExpense.created_at,
        updated_at: dbExpense.updated_at
      })) as Expense[]
    },
    enabled: !!user?.id,
  })

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: async (expenseData: CreateExpenseData) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: expenseData.amount,
          category: expenseData.category,
          subcategory: expenseData.subcategory,
          description: expenseData.description,
          date: expenseData.date,
          is_recurring: expenseData.is_recurring
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
      toast({
        title: "Gasto agregado",
        description: "El gasto se ha agregado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar el gasto.",
        variant: "destructive",
      })
    },
  })

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CreateExpenseData>) => {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: updates.amount,
          category: updates.category,
          subcategory: updates.subcategory,
          description: updates.description,
          date: updates.date,
          is_recurring: updates.is_recurring
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
      toast({
        title: "Gasto actualizado",
        description: "Los cambios se han guardado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el gasto.",
        variant: "destructive",
      })
    },
  })

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
      toast({
        title: "Gasto eliminado",
        description: "El gasto se ha eliminado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el gasto.",
        variant: "destructive",
      })
    },
  })

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const recurringExpenses = expenses.filter(expense => expense.is_recurring)

  return {
    expenses,
    totalExpenses,
    recurringExpenses,
    isLoading,
    error,
    createExpense: createExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    isCreating: createExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
  }
}
