export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

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
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id?: string;
  user_id: string;
  amount: number;
  description?: string;
  transaction_type: string;
  category?: string;
  transaction_date: string;
  created_at?: string;
}

export interface OnboardingData {
  income: number;
  extraIncome: number;
  expenses: {
    housing: number;
    food: number;
    transport: number;
    entertainment: number;
    other: number;
  };
  debts: Array<{
    name: string;
    amount: number;
    monthlyPayment: number;
    interestRate: number;
  }>;
  savings: {
    current: number;
    monthly: number;
  };
  goals: Array<{
    name: string;
    targetAmount: number;
    targetDate: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  whatsapp: {
    enabled: boolean;
    phone?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

export interface AIRecommendation {
  id?: string;
  user_id: string;
  recommendation_text: string;
  recommendation_type: string;
  priority: number;
  is_implemented: boolean;
  created_at?: string;
}

export interface ActionPlan {
  id?: string;
  user_id: string;
  financial_plan_id?: string;
  actions: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    dueDate?: string;
  }>;
  whatsapp_reminders: boolean;
  next_review_date?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialPlan {
  id?: string;
  user_id: string;
  plan_data: {
    budget: {
      income: number;
      expenses: Record<string, number>;
      savings: number;
    };
    goals: Goal[];
    recommendations: AIRecommendation[];
    timeline: Array<{
      month: number;
      goals: string[];
      milestones: string[];
    }>;
  };
  created_at?: string;
  updated_at?: string;
}