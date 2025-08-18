
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData';

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
  const { data: consolidatedData, isLoading: isConsolidatedLoading } = useConsolidatedFinancialData();

  // Convert consolidated data to legacy format for compatibility
  const userFinancialData: UserFinancialData | null = consolidatedData ? {
    id: user?.id || '',
    user_id: user?.id || '',
    ingresos: consolidatedData.monthlyIncome,
    ingresos_extras: 0,
    gastos_categorizados: Object.entries(consolidatedData.expenseCategories).map(([category, amount]) => ({
      category,
      amount
    })),
    deudas: consolidatedData.debts,
    ahorros: {
      actual: consolidatedData.currentSavings
    },
    metas: consolidatedData.financialGoals.map(goal => ({ name: goal })),
    user_data: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    gastos_totales: consolidatedData.monthlyExpenses,
    ahorros_actuales: consolidatedData.currentSavings,
    capacidad_ahorro: consolidatedData.savingsCapacity,
    metas_financieras: consolidatedData.financialGoals.map(goal => ({ name: goal }))
  } : null;

  const refetch = () => {
    console.log('Refetching user financial data...');
  };

  return {
    userFinancialData,
    isLoading: isConsolidatedLoading,
    error: null,
    refetch
  };
};
