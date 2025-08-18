
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useFinancialSummary } from './useFinancialSummary';

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
  const { financialSummary, isLoading: isSummaryLoading } = useFinancialSummary();

  // Convert financial summary to legacy format for compatibility
  const financialDataRecord: FinancialDataRecord | null = financialSummary ? {
    id: financialSummary.id,
    user_id: financialSummary.user_id,
    monthly_income: financialSummary.total_monthly_income,
    monthly_expenses: financialSummary.total_monthly_expenses,
    monthly_balance: financialSummary.savings_capacity,
    loan_amount: financialSummary.total_debt,
    monthly_payment: financialSummary.monthly_debt_payments,
    savings_goal: 0, // This would come from goals table now
    emergency_fund_goal: financialSummary.emergency_fund,
    created_at: financialSummary.last_calculated,
    updated_at: financialSummary.updated_at,
  } : null;

  const refetch = () => {
    // This would trigger a recalculation of the financial summary
    console.log('Refetching financial data...');
  };

  return {
    financialDataRecord,
    isLoading: isSummaryLoading,
    error: null,
    refetch
  };
};
