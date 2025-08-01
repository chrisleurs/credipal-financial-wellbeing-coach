
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export const useExpenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query to fetch expenses
  const {
    data: expenses = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching expenses for user:', user.id);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        throw error;
      }
      
      console.log('Fetched expenses:', data?.length || 0);
      return data || [];
    },
    enabled: !!user,
  });

  // Handle query errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los gastos",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const addExpense = async (expenseData: {
    amount: number;
    category: string;
    description: string;
    expense_date: string;
  }) => {
    if (!user) return { success: false };

    try {
      console.log('Adding expense:', expenseData);
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidate the expenses query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['expenses', user.id] });
      
      console.log('Expense added successfully:', data);
      toast({
        title: "Gasto agregado",
        description: `Se agregó el gasto "${expenseData.description}" por $${expenseData.amount.toLocaleString()}`
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el gasto",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const updateExpense = async (id: string, expenseData: {
    amount: number;
    category: string;
    description: string;
    expense_date: string;
  }) => {
    try {
      console.log('Updating expense:', id, expenseData);
      const { data, error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate the expenses query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      
      console.log('Expense updated successfully:', data);
      toast({
        title: "Gasto actualizado",
        description: "El gasto se actualizó correctamente"
      });
      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el gasto",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      console.log('Deleting expense:', id);
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate the expenses query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['expenses', user?.id] });
      
      console.log('Expense deleted successfully');
      toast({
        title: "Gasto eliminado",
        description: "El gasto se eliminó correctamente"
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el gasto",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch
  };
};
