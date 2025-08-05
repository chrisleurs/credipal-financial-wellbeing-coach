
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

  // Combine and prioritize data sources - FIXED to use real data
  const data = React.useMemo(() => {
    // Priority: user_financial_data first (from onboarding), then financial_data table, then defaults
    const monthlyIncome = userFinancialData?.ingresos || 
                         financialDataRecord?.monthly_income || 
                         0;
    
    const monthlyExpenses = userFinancialData?.gastos_categorizados?.reduce((sum: number, gasto: any) => 
                             sum + (gasto.amount || 0), 0) ||
                           financialDataRecord?.monthly_expenses ||
                           0;

    const currentSavings = userFinancialData?.ahorros?.actual || 0;
    const savingsGoal = financialDataRecord?.savings_goal || userFinancialData?.ahorros?.mensual || 0;
    const emergencyFundGoal = financialDataRecord?.emergency_fund_goal || 0;
    
    console.log('Real financial data loaded:', {
      monthlyIncome,
      monthlyExpenses,
      currentSavings,
      hasUserData: !!userFinancialData,
      hasFinancialData: !!financialDataRecord
    });
    
    return {
      monthly_income: monthlyIncome,
      monthly_expenses: monthlyExpenses,
      current_savings: currentSavings,
      savings_goal: savingsGoal,
      emergency_fund_goal: emergencyFundGoal,
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
          savings_goal: data.currentSavings || 0,
          emergency_fund_goal: data.monthlySavingsCapacity || 0,
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
    hasRealData: !!(financialDataRecord || userFinancialData),
    // Helper to get combined financial data for AI plan generation
    getFinancialDataForPlan: (): FinancialData => ({
      monthlyIncome: data.monthly_income,
      extraIncome: 0, // Could be enhanced later
      monthlyExpenses: data.monthly_expenses,
      expenseCategories: userFinancialData?.gastos_categorizados?.reduce((acc: Record<string, number>, gasto: any) => {
        acc[gasto.category || 'other'] = (acc[gasto.category || 'other'] || 0) + (gasto.amount || 0);
        return acc;
      }, {}) || {},
      debts: userFinancialData?.deudas || [],
      currentSavings: data.current_savings,
      monthlySavingsCapacity: data.savings_goal,
      financialGoals: userFinancialData?.metas || [],
      whatsappOptin: false // Could be enhanced later
    })
  };
};
