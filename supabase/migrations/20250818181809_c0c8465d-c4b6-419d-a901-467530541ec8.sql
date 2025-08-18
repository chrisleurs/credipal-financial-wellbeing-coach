
-- Drop existing tables that will be replaced
DROP TABLE IF EXISTS user_financial_data CASCADE;
DROP TABLE IF EXISTS financial_data CASCADE;
DROP TABLE IF EXISTS onboarding_expenses CASCADE;
DROP TABLE IF EXISTS user_loans CASCADE;

-- Create enum types
CREATE TYPE frequency_type AS ENUM ('monthly', 'biweekly', 'weekly', 'yearly');
CREATE TYPE debt_status AS ENUM ('active', 'paid', 'delinquent');
CREATE TYPE goal_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE plan_status AS ENUM ('draft', 'active', 'completed');

-- 1. Income Sources Table
CREATE TABLE public.income_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  amount DECIMAL NOT NULL DEFAULT 0,
  frequency frequency_type NOT NULL DEFAULT 'monthly',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Recreate expenses table with proper structure
DROP TABLE IF EXISTS public.expenses CASCADE;
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  amount DECIMAL NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Recreate debts table with proper structure
DROP TABLE IF EXISTS public.debts CASCADE;
DROP TABLE IF EXISTS public.debt_payments CASCADE;
DROP TABLE IF EXISTS public.debt_reminders CASCADE;

CREATE TABLE public.debts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creditor TEXT NOT NULL,
  original_amount DECIMAL NOT NULL DEFAULT 0,
  current_balance DECIMAL NOT NULL DEFAULT 0,
  monthly_payment DECIMAL NOT NULL DEFAULT 0,
  interest_rate DECIMAL NOT NULL DEFAULT 0,
  due_date DATE,
  status debt_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Recreate goals table with proper structure  
DROP TABLE IF EXISTS public.goals CASCADE;
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL NOT NULL DEFAULT 0,
  current_amount DECIMAL NOT NULL DEFAULT 0,
  deadline DATE,
  priority goal_priority NOT NULL DEFAULT 'medium',
  status goal_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Financial Summary Table (consolidated view)
CREATE TABLE public.financial_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_monthly_income DECIMAL NOT NULL DEFAULT 0,
  total_monthly_expenses DECIMAL NOT NULL DEFAULT 0,
  total_debt DECIMAL NOT NULL DEFAULT 0,
  monthly_debt_payments DECIMAL NOT NULL DEFAULT 0,
  savings_capacity DECIMAL NOT NULL DEFAULT 0,
  emergency_fund DECIMAL NOT NULL DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Recreate financial_plans table with cleaner structure
DROP TABLE IF EXISTS public.financial_plans CASCADE;
DROP TABLE IF EXISTS public.user_financial_plans CASCADE;
CREATE TABLE public.financial_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT '3-2-1',
  plan_data JSONB NOT NULL DEFAULT '{}',
  status plan_status NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for income_sources
CREATE POLICY "Users can view their own income sources" ON public.income_sources FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own income sources" ON public.income_sources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own income sources" ON public.income_sources FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own income sources" ON public.income_sources FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for debts
CREATE POLICY "Users can view their own debts" ON public.debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own debts" ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debts" ON public.debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debts" ON public.debts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for financial_summary
CREATE POLICY "Users can view their own financial summary" ON public.financial_summary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own financial summary" ON public.financial_summary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financial summary" ON public.financial_summary FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for financial_plans
CREATE POLICY "Users can view their own financial plans" ON public.financial_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own financial plans" ON public.financial_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financial plans" ON public.financial_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own financial plans" ON public.financial_plans FOR DELETE USING (auth.uid() = user_id);

-- Create function to calculate financial summary
CREATE OR REPLACE FUNCTION public.calculate_financial_summary(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
  monthly_income DECIMAL := 0;
  monthly_expenses DECIMAL := 0;
  total_debt_amount DECIMAL := 0;
  debt_payments DECIMAL := 0;
  capacity DECIMAL := 0;
BEGIN
  -- Calculate total monthly income
  SELECT COALESCE(SUM(
    CASE 
      WHEN frequency = 'monthly' THEN amount
      WHEN frequency = 'biweekly' THEN amount * 2
      WHEN frequency = 'weekly' THEN amount * 4
      WHEN frequency = 'yearly' THEN amount / 12
      ELSE amount
    END
  ), 0) INTO monthly_income
  FROM public.income_sources 
  WHERE user_id = target_user_id AND is_active = true;

  -- Calculate monthly expenses (average from last 3 months)
  SELECT COALESCE(AVG(monthly_total), 0) INTO monthly_expenses
  FROM (
    SELECT DATE_TRUNC('month', date) as month, SUM(amount) as monthly_total
    FROM public.expenses 
    WHERE user_id = target_user_id 
      AND date >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY DATE_TRUNC('month', date)
  ) monthly_averages;

  -- Calculate total debt and monthly payments
  SELECT 
    COALESCE(SUM(current_balance), 0),
    COALESCE(SUM(monthly_payment), 0)
  INTO total_debt_amount, debt_payments
  FROM public.debts 
  WHERE user_id = target_user_id AND status = 'active';

  -- Calculate savings capacity
  capacity := monthly_income - monthly_expenses - debt_payments;

  -- Upsert financial summary
  INSERT INTO public.financial_summary (
    user_id, 
    total_monthly_income, 
    total_monthly_expenses, 
    total_debt, 
    monthly_debt_payments, 
    savings_capacity,
    last_calculated
  ) VALUES (
    target_user_id, 
    monthly_income, 
    monthly_expenses, 
    total_debt_amount, 
    debt_payments, 
    capacity,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_monthly_income = EXCLUDED.total_monthly_income,
    total_monthly_expenses = EXCLUDED.total_monthly_expenses,
    total_debt = EXCLUDED.total_debt,
    monthly_debt_payments = EXCLUDED.monthly_debt_payments,
    savings_capacity = EXCLUDED.savings_capacity,
    last_calculated = EXCLUDED.last_calculated,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to update financial summary
CREATE OR REPLACE FUNCTION public.trigger_update_financial_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Update for the affected user
  PERFORM public.calculate_financial_summary(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add triggers to relevant tables
CREATE TRIGGER update_summary_on_income_change
  AFTER INSERT OR UPDATE OR DELETE ON public.income_sources
  FOR EACH ROW EXECUTE FUNCTION public.trigger_update_financial_summary();

CREATE TRIGGER update_summary_on_expense_change
  AFTER INSERT OR UPDATE OR DELETE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.trigger_update_financial_summary();

CREATE TRIGGER update_summary_on_debt_change
  AFTER INSERT OR UPDATE OR DELETE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION public.trigger_update_financial_summary();

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_income_sources_updated_at
  BEFORE UPDATE ON public.income_sources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_debts_updated_at
  BEFORE UPDATE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_financial_summary_updated_at
  BEFORE UPDATE ON public.financial_summary
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_financial_plans_updated_at
  BEFORE UPDATE ON public.financial_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
