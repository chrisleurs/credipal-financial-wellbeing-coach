import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Using direct URLs instead of VITE_ variables (not supported in Lovable)
const supabaseUrl = "https://rvyvqgtwlwbaurcooypk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2eXZxZ3R3bHdiYXVyY29veXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDY0MjYsImV4cCI6MjA2NjMyMjQyNn0.U72JYxP3gJdgdEJCiywapQVCODq3JH8sn9s5qP77754";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper functions
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, userData?: { 
  first_name?: string; 
  last_name?: string; 
}) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: userData
    }
  });
  return { data, error };
};

// Database helpers
export const insertFinancialData = async (data: any) => {
  const { data: result, error } = await supabase
    .from('financial_data')
    .upsert(data)
    .select()
    .single();
  return { data: result, error };
};

export const getFinancialData = async (userId: string) => {
  const { data, error } = await supabase
    .from('financial_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data, error };
};

export const insertGoal = async (goal: any) => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single();
  return { data, error };
};

export const getGoals = async (userId: string) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const insertTransaction = async (transaction: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  return { data, error };
};

export const getTransactions = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('transaction_date', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const insertUserFinancialData = async (data: any) => {
  const { data: result, error } = await supabase
    .from('user_financial_data')
    .upsert(data)
    .select()
    .single();
  return { data: result, error };
};

export const getUserFinancialData = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_financial_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data, error };
};

export const insertActionPlan = async (plan: any) => {
  const { data, error } = await supabase
    .from('user_action_plans')
    .insert(plan)
    .select()
    .single();
  return { data, error };
};

export const getActionPlan = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_action_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .maybeSingle();
  return { data, error };
};

// Add new expense helpers
export const insertExpense = async (expense: {
  user_id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
}) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();
  return { data, error };
};

export const getExpenses = async (userId: string) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('expense_date', { ascending: false });
  return { data, error };
};

export const updateExpense = async (id: string, updates: {
  amount?: number;
  category?: string;
  description?: string;
  expense_date?: string;
}) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
  return { error };
};

// Add new debt helpers
export const insertDebt = async (debt: {
  user_id: string;
  creditor_name: string;
  total_amount: number;
  current_balance: number;
  annual_interest_rate: number;
  minimum_payment: number;
  due_day: number;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('debts')
    .insert(debt)
    .select()
    .single();
  return { data, error };
};

export const getDebts = async (userId: string) => {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateDebt = async (id: string, updates: {
  creditor_name?: string;
  total_amount?: number;
  current_balance?: number;
  annual_interest_rate?: number;
  minimum_payment?: number;
  due_day?: number;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('debts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteDebt = async (id: string) => {
  const { error } = await supabase
    .from('debts')
    .delete()
    .eq('id', id);
  return { error };
};

export const insertDebtPayment = async (payment: {
  user_id: string;
  debt_id: string;
  amount: number;
  payment_date: string;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('debt_payments')
    .insert(payment)
    .select()
    .single();
  return { data, error };
};

export const getDebtPayments = async (userId: string) => {
  const { data, error } = await supabase
    .from('debt_payments')
    .select('*')
    .eq('user_id', userId)
    .order('payment_date', { ascending: false });
  return { data, error };
};

export const insertDebtReminder = async (reminder: {
  user_id: string;
  debt_id: string;
  days_before: number;
  is_active: boolean;
  reminder_type: string;
}) => {
  const { data, error } = await supabase
    .from('debt_reminders')
    .insert(reminder)
    .select()
    .single();
  return { data, error };
};

export const getDebtReminders = async (userId: string) => {
  const { data, error } = await supabase
    .from('debt_reminders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getLoans = async (userId: string) => {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getLoanById = async (loanId: string) => {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('id', loanId)
    .single();
  return { data, error };
};

export const updateLoan = async (loanId: string, updates: any) => {
  const { data, error } = await supabase
    .from('loans')
    .update(updates)
    .eq('id', loanId)
    .select()
    .single();
  return { data, error };
};
