import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { 
  FinancialData, 
  Goal, 
  Transaction, 
  OnboardingData, 
  ActionPlan,
  AIRecommendation 
} from '@/types';

export const useFinancial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all financial data when user changes
  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      // Clear data when user logs out
      setFinancialData(null);
      setGoals([]);
      setTransactions([]);
      setOnboardingData(null);
      setActionPlan(null);
      setRecommendations([]);
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [
        financialResult,
        goalsResult,
        transactionsResult,
        onboardingResult,
        actionPlanResult,
        recommendationsResult
      ] = await Promise.all([
        ApiService.getFinancialData(user.id),
        ApiService.getGoals(user.id),
        ApiService.getTransactions(user.id),
        ApiService.getOnboardingData(user.id),
        ApiService.getActionPlan(user.id),
        ApiService.getRecommendations(user.id)
      ]);

      setFinancialData(financialResult);
      setGoals(goalsResult);
      setTransactions(transactionsResult);
      setOnboardingData(onboardingResult);
      setActionPlan(actionPlanResult);
      setRecommendations(recommendationsResult);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos financieros",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Financial Data methods
  const saveFinancialData = async (data: FinancialData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await ApiService.saveFinancialData({ ...data, user_id: user.id });
      setFinancialData(result);
      
      toast({
        title: "Datos guardados",
        description: "Información financiera actualizada exitosamente"
      });
      
      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudieron guardar los datos",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Goals methods
  const createGoal = async (goal: Omit<Goal, 'user_id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await ApiService.createGoal({ ...goal, user_id: user.id });
      setGoals(prev => [result, ...prev]);
      
      toast({
        title: "Meta creada",
        description: "Tu nueva meta ha sido añadida exitosamente"
      });
      
      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo crear la meta",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      setLoading(true);
      const result = await ApiService.updateGoal(goalId, updates);
      setGoals(prev => prev.map(goal => goal.id === goalId ? result : goal));
      
      toast({
        title: "Meta actualizada",
        description: "Los cambios han sido guardados"
      });
      
      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo actualizar la meta",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      setLoading(true);
      await ApiService.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: "Meta eliminada",
        description: "La meta ha sido eliminada exitosamente"
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo eliminar la meta",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Transaction methods
  const createTransaction = async (transaction: Omit<Transaction, 'user_id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await ApiService.createTransaction({ ...transaction, user_id: user.id });
      setTransactions(prev => [result, ...prev]);
      
      toast({
        title: "Transacción registrada",
        description: "La transacción ha sido añadida exitosamente"
      });
      
      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo registrar la transacción",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Onboarding methods
  const saveOnboarding = async (data: OnboardingData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await ApiService.saveOnboardingData(user.id, data);
      setOnboardingData(data);
      
      toast({
        title: "Configuración guardada",
        description: "Tus datos de configuración inicial han sido guardados"
      });
      
      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudieron guardar los datos de configuración",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Action Plan methods
  const saveActionPlan = async (plan: ActionPlan) => {
    try {
      setLoading(true);
      const result = await ApiService.saveActionPlan(plan);
      setActionPlan(result);
      
      toast({
        title: "Plan de acción guardado",
        description: "Tu plan de acción ha sido guardado exitosamente"
      });
      
      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo guardar el plan de acción",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateActionPlan = async (planId: string, updates: Partial<ActionPlan>) => {
    try {
      setLoading(true);
      const result = await ApiService.updateActionPlan(planId, updates);
      setActionPlan(result);
      
      toast({
        title: "Plan actualizado",
        description: "Los cambios han sido guardados"
      });
      
      return result;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo actualizar el plan",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Recommendation methods
  const saveRecommendations = async (recs: AIRecommendation[]) => {
    try {
      setLoading(true);
      const result = await ApiService.saveRecommendations(recs);
      setRecommendations(result);
      
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRecommendation = async (recommendationId: string, updates: Partial<AIRecommendation>) => {
    try {
      setLoading(true);
      const result = await ApiService.updateRecommendation(recommendationId, updates);
      setRecommendations(prev => 
        prev.map(rec => rec.id === recommendationId ? result : rec)
      );
      
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    financialData,
    goals,
    transactions,
    onboardingData,
    actionPlan,
    recommendations,
    loading,
    error,
    
    // Methods
    loadAllData,
    saveFinancialData,
    createGoal,
    updateGoal,
    deleteGoal,
    createTransaction,
    saveOnboarding,
    saveActionPlan,
    updateActionPlan,
    saveRecommendations,
    updateRecommendation,
    
    // Computed values
    hasFinancialData: !!financialData,
    hasOnboardingData: !!onboardingData,
    hasActionPlan: !!actionPlan,
    activeGoals: goals.filter(goal => goal.status === 'active'),
    completedGoals: goals.filter(goal => goal.status === 'completed'),
    recentTransactions: transactions.slice(0, 10),
    highPriorityRecommendations: recommendations.filter(rec => rec.priority <= 2 && !rec.is_implemented)
  };
};