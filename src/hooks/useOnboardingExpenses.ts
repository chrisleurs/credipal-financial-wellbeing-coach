
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingExpense {
  id: string;
  user_id: string;
  category: string;
  subcategory: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export const useOnboardingExpenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's onboarding expenses
  const {
    data: expenses = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['onboarding-expenses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching onboarding expenses for user:', user.id);
      // Use type assertion to bypass TypeScript strict typing
      const { data, error } = await (supabase as any)
        .from('onboarding_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('category', { ascending: true })
        .order('subcategory', { ascending: true });

      if (error) {
        console.error('Error fetching onboarding expenses:', error);
        throw error;
      }
      
      console.log('Fetched onboarding expenses:', data?.length || 0);
      return (data as OnboardingExpense[]) || [];
    },
    enabled: !!user,
  });

  // Handle query errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Could not load expenses",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const addExpense = async (expenseData: {
    category: string;
    subcategory: string;
    amount: number;
  }) => {
    if (!user) return { success: false };

    try {
      console.log('Adding expense:', expenseData);
      // Use type assertion to bypass TypeScript strict typing
      const { data, error } = await (supabase as any)
        .from('onboarding_expenses')
        .insert({
          ...expenseData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['onboarding-expenses', user.id] });
      
      console.log('Expense added successfully:', data);
      toast({
        title: "Expense added",
        description: `Added $${expenseData.amount} for ${expenseData.subcategory}`
      });
      return { success: true, data: data as OnboardingExpense };
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Could not add expense",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const updateExpense = async (id: string, expenseData: {
    category: string;
    subcategory: string;
    amount: number;
  }) => {
    try {
      console.log('Updating expense:', id, expenseData);
      // Use type assertion to bypass TypeScript strict typing
      const { data, error } = await (supabase as any)
        .from('onboarding_expenses')
        .update(expenseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['onboarding-expenses', user?.id] });
      
      console.log('Expense updated successfully:', data);
      toast({
        title: "Expense updated",
        description: "Expense updated successfully"
      });
      return { success: true, data: data as OnboardingExpense };
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Could not update expense",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      console.log('Deleting expense:', id);
      // Use type assertion to bypass TypeScript strict typing
      const { error } = await (supabase as any)
        .from('onboarding_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['onboarding-expenses', user?.id] });
      
      console.log('Expense deleted successfully');
      toast({
        title: "Expense deleted",
        description: "Expense deleted successfully"
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Could not delete expense",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const clearAllExpenses = async () => {
    if (!user) return { success: false };

    try {
      console.log('Clearing all expenses for user:', user.id);
      // Use type assertion to bypass TypeScript strict typing
      const { error } = await (supabase as any)
        .from('onboarding_expenses')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      // Invalidate the query to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['onboarding-expenses', user.id] });
      
      console.log('All expenses cleared successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error clearing expenses:', error);
      return { success: false };
    }
  };

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllExpenses,
    refetch
  };
};
