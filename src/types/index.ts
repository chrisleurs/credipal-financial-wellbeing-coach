
export interface Debt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}

export interface FinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  expenseCategories: Record<string, number>
  debts: Debt[]
  currentSavings: number
  monthlySavingsCapacity: number
  financialGoals: string[]
}

export interface User {
  id: string;
  email: string | null;
  created_at: string;
  user_metadata: {
    [key: string]: any;
    avatar_url?: string;
    email?: string;
    email_confirm?: boolean;
    full_name?: string;
    iss?: string;
    name?: string;
    picture?: string;
    provider_id?: string;
    sub?: string;
  } | null;
}

export interface Expense {
  id?: string;
  user_id: string;
  amount: number;
  category: string;
  description?: string;
  expense_date: string;
}

export interface Goal {
  id?: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  status: string;
  priority: string;
}

export interface CrediMessage {
  id: string;
  text: string;
  type: 'celebration' | 'suggestion' | 'reminder' | 'default';
}

// AI-related types
export interface AIGeneratedPlan {
  recommendations: string[];
  monthlyBalance: number;
  savingsSuggestion: number;
  budgetBreakdown: {
    fixedExpenses: number;
    variableExpenses: number;
    savings: number;
    emergency: number;
  };
  timeEstimate: string;
  motivationalMessage: string;
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
}

export interface ActionPlan {
  tasks: ActionTask[];
  nextReviewDate: string;
}

export interface AIPlan {
  id: string;
  recommendations: string[];
  monthlyBalance: number;
  savingsSuggestion: number;
  budgetBreakdown: {
    fixedExpenses: number;
    variableExpenses: number;
    savings: number;
    emergency: number;
  };
  timeEstimate: string;
  motivationalMessage: string;
  createdAt: string;
}
