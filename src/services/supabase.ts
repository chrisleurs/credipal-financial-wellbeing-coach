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