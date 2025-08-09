
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ConsolidatedFinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  totalDebts: number;
  monthlyDebtPayments: number;
  financialGoals: string[];
  expenseCategories: Record<string, number>;
  debts: Array<{
    id: string;
    creditor_name: string;
    current_balance: number;
    minimum_payment: number;
  }>;
}

export const useConsolidatedFinancialData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['consolidated-financial-data', user?.id],
    queryFn: async (): Promise<ConsolidatedFinancialData> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching consolidated financial data for user:', user.id);

      // Inicializar datos por defecto
      let result: ConsolidatedFinancialData = {
        monthlyIncome: 0,
        monthlyExpenses: 0,
        currentSavings: 0,
        totalDebts: 0,
        monthlyDebtPayments: 0,
        financialGoals: [],
        expenseCategories: {},
        debts: []
      };

      try {
        // 1. Obtener datos financieros principales del usuario
        const { data: userFinancialData } = await supabase
          .from('user_financial_data')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (userFinancialData) {
          result.monthlyIncome = (userFinancialData.ingresos || 0) + (userFinancialData.ingresos_extras || 0);
          result.monthlyExpenses = userFinancialData.gastos_totales || 0;
          result.currentSavings = userFinancialData.ahorros_actuales || 0;
          
          // Manejar financialGoals correctamente
          if (userFinancialData.metas_financieras && Array.isArray(userFinancialData.metas_financieras)) {
            result.financialGoals = userFinancialData.metas_financieras;
          } else if (typeof userFinancialData.metas_financieras === 'string') {
            result.financialGoals = [userFinancialData.metas_financieras];
          } else {
            result.financialGoals = [];
          }
          
          // Procesar gastos categorizados
          if (userFinancialData.gastos_categorizados && Array.isArray(userFinancialData.gastos_categorizados)) {
            const categories: Record<string, number> = {};
            userFinancialData.gastos_categorizados.forEach((expense: any) => {
              if (expense.category && expense.amount) {
                categories[expense.category] = (categories[expense.category] || 0) + Number(expense.amount);
              }
            });
            result.expenseCategories = categories;
          }
        }

        // 2. Obtener deudas específicas del usuario
        const { data: debts } = await supabase
          .from('debts')
          .select('id, creditor_name, current_balance, minimum_payment')
          .eq('user_id', user.id);

        if (debts && debts.length > 0) {
          result.debts = debts;
          result.totalDebts = debts.reduce((sum, debt) => sum + (debt.current_balance || 0), 0);
          result.monthlyDebtPayments = debts.reduce((sum, debt) => sum + (debt.minimum_payment || 0), 0);
        }

        // 3. Si no hay datos consolidados, intentar obtener de otras fuentes del usuario
        if (!userFinancialData) {
          console.log('No consolidated data found, checking individual tables for user:', user.id);
          
          // Obtener ingresos del usuario
          const { data: incomes } = await supabase
            .from('incomes')
            .select('amount, frequency')
            .eq('user_id', user.id)
            .eq('is_active', true);

          if (incomes && incomes.length > 0) {
            result.monthlyIncome = incomes.reduce((sum, income) => {
              const amount = income.amount || 0;
              return sum + (income.frequency === 'monthly' ? amount : amount / 12);
            }, 0);
          }

          // Obtener gastos del usuario
          const { data: expenses } = await supabase
            .from('expenses')
            .select('amount, category')
            .eq('user_id', user.id);

          if (expenses && expenses.length > 0) {
            const categories: Record<string, number> = {};
            let totalExpenses = 0;
            
            expenses.forEach(expense => {
              const amount = expense.amount || 0;
              totalExpenses += amount;
              categories[expense.category] = (categories[expense.category] || 0) + amount;
            });
            
            result.monthlyExpenses = totalExpenses;
            result.expenseCategories = categories;
          }

          // Obtener metas del usuario
          const { data: goals } = await supabase
            .from('goals')
            .select('goal_name')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (goals && goals.length > 0) {
            result.financialGoals = goals.map(goal => goal.goal_name);
          }
        }

        console.log('Consolidated financial data for user:', user.id, result);
        return result;

      } catch (error) {
        console.error('Error fetching consolidated financial data:', error);
        return result; // Retornar datos por defecto en caso de error
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
