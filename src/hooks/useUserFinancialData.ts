
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useOptimizedFinancialData } from './useOptimizedFinancialData';

export interface UserFinancialData {
  id: string;
  user_id: string;
  ingresos: number;
  ingresos_extras: number;
  gastos_categorizados: any[];
  deudas: any[];
  ahorros: any;
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
  const { data: optimizedData, isLoading } = useOptimizedFinancialData();

  // Convert optimized data to legacy format for compatibility
  const userFinancialData: UserFinancialData | null = optimizedData && user ? {
    id: user.id,
    user_id: user.id,
    ingresos: optimizedData.monthlyIncome,
    ingresos_extras: 0, // This could be extracted from incomeBreakdown if needed
    gastos_categorizados: Object.entries(optimizedData.expenseCategories || {}).map(([category, amount]) => ({
      category,
      amount
    })),
    deudas: optimizedData.activeDebts || [],
    ahorros: {
      actual: optimizedData.currentSavings
    },
    metas: optimizedData.activeGoals?.map(goal => ({ name: goal.title })) || [],
    user_data: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    gastos_totales: optimizedData.monthlyExpenses,
    ahorros_actuales: optimizedData.currentSavings,
    capacidad_ahorro: optimizedData.savingsCapacity,
    metas_financieras: optimizedData.activeGoals?.map(goal => ({ name: goal.title })) || []
  } : null;

  const refetch = () => {
    console.log('🔄 Refetching user financial data from optimized source...');
  };

  return {
    userFinancialData,
    isLoading,
    error: null,
    refetch
  };
};
