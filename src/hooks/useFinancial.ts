
import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFinancialData } from './useFinancialData';
import { useUserFinancialData } from './useUserFinancialData';
import { FinancialData } from '@/types';

export const useFinancial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get data from both financial data sources
  const { financialDataRecord, isLoading: isLoadingFinancial } = useFinancialData();
  const { userFinancialData, isLoading: isLoadingUserFinancial } = useUserFinancialData();

  // Combine and prioritize data sources
  const data = React.useMemo(() => {
    // Priority: financial_data table first, then user_financial_data, then defaults
    const monthlyIncome = financialDataRecord?.monthly_income || 
                         userFinancialData?.ingresos || 
                         0;
    
    const monthlyExpenses = financialDataRecord?.monthly_expenses ||
                           (userFinancialData?.gastos_categorizados?.reduce((sum: number, gasto: any) => 
                             sum + (gasto.amount || 0), 0)) ||
                           0;

    const currentSavings = userFinancialData?.ahorros?.actual || 0;
    
    return {
      monthly_income: monthlyIncome,
      monthly_expenses: monthlyExpenses,
      current_savings: currentSavings,
      savings_goal: financialDataRecord?.savings_goal || 0,
      emergency_fund_goal: financialDataRecord?.emergency_fund_goal || 0,
    };
  }, [financialDataRecord, userFinancialData]);

  const saveFinancialData = async (data: FinancialData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para guardar datos",
        variant: "destructive"
      });
      return { success: false };
    }

    setIsLoading(true);
    try {
      console.log('Saving financial data:', data);
      
      // Save to financial_data table
      const { error } = await supabase
        .from('financial_data')
        .upsert({
          user_id: user.id,
          monthly_income: data.monthlyIncome || 0,
          monthly_expenses: data.monthlyExpenses || 0,
          monthly_balance: (data.monthlyIncome || 0) - (data.monthlyExpenses || 0),
          savings_goal: data.currentSavings || 0, // Fixed: use currentSavings instead of savingsGoal
          emergency_fund_goal: data.monthlySavingsCapacity || 0, // Fixed: use monthlySavingsCapacity instead of emergencyFundGoal
        });

      if (error) throw error;
      
      toast({
        title: "Datos guardados",
        description: "Tu información financiera ha sido guardada exitosamente",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudieron guardar los datos",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading: isLoading || isLoadingFinancial || isLoadingUserFinancial,
    saveFinancialData,
    hasRealData: !!(financialDataRecord || userFinancialData)
  };
};
