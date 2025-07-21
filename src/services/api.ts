import { supabase } from './supabase';
import type { 
  FinancialData, 
  Goal, 
  Transaction, 
  OnboardingData, 
  ActionPlan,
  AIRecommendation
} from '@/types';

export class ApiService {
  // Financial Data
  static async saveFinancialData(data: FinancialData) {
    const { data: result, error } = await supabase
      .from('financial_data')
      .upsert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  static async getFinancialData(userId: string) {
    const { data, error } = await supabase
      .from('financial_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Goals
  static async createGoal(goal: Goal) {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateGoal(goalId: string, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getGoals(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async deleteGoal(goalId: string) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);
    
    if (error) throw error;
  }

  // Transactions
  static async createTransaction(transaction: Transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  // Onboarding Data
  static async saveOnboardingData(userId: string, data: OnboardingData) {
    const { data: result, error } = await supabase
      .from('user_financial_data')
      .upsert({
        user_id: userId,
        ingresos: data.income,
        ingresos_extras: data.extraIncome,
        gastos_categorizados: data.expenses,
        deudas: data.debts,
        ahorros: data.savings,
        metas: data.goals,
        user_data: {
          whatsapp: data.whatsapp
        }
      })
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  static async getOnboardingData(userId: string): Promise<OnboardingData | null> {
    const { data, error } = await supabase
      .from('user_financial_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;

    return {
      income: data.ingresos,
      extraIncome: data.ingresos_extras,
      expenses: data.gastos_categorizados,
      debts: data.deudas,
      savings: data.ahorros,
      goals: data.metas,
      whatsapp: data.user_data?.whatsapp || { enabled: false, frequency: 'weekly' }
    };
  }

  // Action Plans
  static async saveActionPlan(actionPlan: ActionPlan) {
    const { data, error } = await supabase
      .from('user_action_plans')
      .upsert(actionPlan)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getActionPlan(userId: string) {
    const { data, error } = await supabase
      .from('user_action_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  static async updateActionPlan(planId: string, updates: Partial<ActionPlan>) {
    const { data, error } = await supabase
      .from('user_action_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // AI Recommendations
  static async saveRecommendations(recommendations: AIRecommendation[]) {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .insert(recommendations)
      .select();
    
    if (error) throw error;
    return data;
  }

  static async getRecommendations(userId: string) {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async updateRecommendation(recommendationId: string, updates: Partial<AIRecommendation>) {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .update(updates)
      .eq('id', recommendationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Financial Plans
  static async saveFinancialPlan(userId: string, planData: any) {
    const { data, error } = await supabase
      .from('user_financial_plans')
      .upsert({
        user_id: userId,
        plan_data: planData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getFinancialPlan(userId: string) {
    const { data, error } = await supabase
      .from('user_financial_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
}