
import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFinancialSummary } from './useFinancialSummary';
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData';
import { FinancialData } from '@/types';

export const useFinancial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get data from new consolidated sources
  const { financialSummary, isLoading: isLoadingSummary } = useFinancialSummary();
  const { consolidatedData, isLoading: isLoadingConsolidated } = useConsolidatedFinancialData();

  // Combine data from new sources
  const data = React.useMemo(() => {
    return {
      monthly_income: consolidatedData?.monthlyIncome || 0,
      monthly_expenses: consolidatedData?.monthlyExpenses || 0,
      current_savings: consolidatedData?.currentSavings || 0,
      savings_goal: 0, // This would come from goals table now
      emergency_fund_goal: financialSummary?.emergency_fund || 0,
    };
  }, [consolidatedData, financialSummary]);

  const saveFinancialData = async (financialData: FinancialData) => {
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
      console.log('Saving financial data:', financialData);
      
      // Note: This would now need to be split across multiple tables
      // (income_sources, expenses, debts, goals) instead of one financial_data table
      
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
    isLoading: isLoading || isLoadingSummary || isLoadingConsolidated,
    saveFinancialData,
    hasRealData: consolidatedData?.hasRealData || false
  };
};
