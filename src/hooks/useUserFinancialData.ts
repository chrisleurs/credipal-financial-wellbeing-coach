
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface UserFinancialData {
  id: string;
  user_id: string;
  ingresos: number;
  ingresos_extras: number;
  gastos_categorizados: any[];
  deudas: any[];
  ahorros: any; // Changed from specific type to any to match database Json type
  metas: any[];
  user_data: any;
  created_at: string;
  updated_at: string;
  gastos_totales: number;
  ahorros_actuales: number;
  capacidad_ahorro: number;
  metas_financieras: any[];
}

export const useUserFinancialData = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: userFinancialData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-financial-data', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching user financial data for:', user.id);
      const { data, error } = await supabase
        .from('user_financial_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user financial data:', error);
        throw error;
      }
      
      console.log('Fetched user financial data:', data);
      return data as UserFinancialData | null;
    },
    enabled: !!user,
  });

  return {
    userFinancialData,
    isLoading,
    error,
    refetch
  };
};
