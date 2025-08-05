
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface FinancialDataRecord {
  id: string;
  user_id: string;
  monthly_income: number;
  monthly_expenses: number;
  monthly_balance: number;
  loan_amount: number;
  monthly_payment: number;
  savings_goal: number;
  emergency_fund_goal: number;
  created_at: string;
  updated_at: string;
}

export const useFinancialData = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: financialDataRecord,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['financial-data', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching financial data for:', user.id);
      const { data, error } = await supabase
        .from('financial_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching financial data:', error);
        throw error;
      }
      
      console.log('Fetched financial data:', data);
      return data as FinancialDataRecord | null;
    },
    enabled: !!user,
  });

  return {
    financialDataRecord,
    isLoading,
    error,
    refetch
  };
};
