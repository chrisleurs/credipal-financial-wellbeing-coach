import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface FinancialData {
  id?: string;
  user_id: string;
  monthly_income: number;
  monthly_expenses: number;
  savings_goal: number;
  emergency_fund_goal: number;
  monthly_balance: number;
  loan_amount: number;
  monthly_payment: number;
}

export interface Goal {
  id?: string;
  user_id: string;
  goal_name: string;
  goal_type: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  status: string;
  priority: string;
}

export interface Transaction {
  id?: string;
  user_id: string;
  amount: number;
  description?: string;
  transaction_type: string;
  category?: string;
  transaction_date: string;
}

interface FinancialStore {
  // State
  financialData: FinancialData | null;
  goals: Goal[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setFinancialData: (data: FinancialData) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
  fetchFinancialData: (userId: string) => Promise<void>;
  fetchGoals: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  saveFinancialData: (data: FinancialData) => Promise<void>;
  saveGoal: (goal: Goal) => Promise<void>;
  saveTransaction: (transaction: Transaction) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFinancialStore = create<FinancialStore>((set, get) => ({
  // Initial state
  financialData: null,
  goals: [],
  transactions: [],
  isLoading: false,
  error: null,

  // Actions
  setFinancialData: (data) => set({ financialData: data }),
  
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(goal => goal.id === id ? { ...goal, ...updates } : goal)
  })),
  
  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter(goal => goal.id !== id)
  })),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // Async actions
  fetchFinancialData: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('financial_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      set({ financialData: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchGoals: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ goals: data || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTransactions: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      set({ transactions: data || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveFinancialData: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('financial_data')
        .upsert(data);

      if (error) throw error;
      set({ financialData: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveGoal: async (goal) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('goals')
        .insert(goal)
        .select()
        .single();

      if (error) throw error;
      get().addGoal(data);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveTransaction: async (transaction) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;
      get().addTransaction(data);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));