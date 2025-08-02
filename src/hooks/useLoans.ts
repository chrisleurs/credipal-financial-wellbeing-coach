
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Loan {
  id: string;
  user_id: string;
  lender: string;
  amount: number;
  currency: string;
  payment_amount: number;
  payment_dates: number[];
  total_payments: number;
  remaining_payments: number;
  next_payment_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useLoans = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: loans = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['loans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching loans for user:', user.id);
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loans:', error);
        throw error;
      }
      
      console.log('Fetched loans:', data);
      return data as Loan[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Could not load loan information",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const kueskiLoan = loans.find(loan => loan.lender === 'Kueski');

  return {
    loans,
    activeLoans,
    kueskiLoan,
    isLoading,
    refetch
  };
};
