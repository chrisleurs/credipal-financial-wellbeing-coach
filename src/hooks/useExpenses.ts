
import { useState, useEffect } from 'react';
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los gastos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expenseData: {
    amount: number;
    category: string;
    description: string;
    expense_date: string;
  }) => {
    if (!user) return { success: false };

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [data, ...prev]);
      toast({
        title: "Gasto agregado",
        description: `Se agregó el gasto "${expenseData.description}" por $${expenseData.amount.toLocaleString()}`
      });
      return { success: true };
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
      const { data, error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => prev.map(expense => 
        expense.id === id ? data : expense
      ));
      toast({
        title: "Gasto actualizado",
        description: "El gasto se actualizó correctamente"
      });
      return { success: true };
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
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(prev => prev.filter(expense => expense.id !== id));
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

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses
  };
};
