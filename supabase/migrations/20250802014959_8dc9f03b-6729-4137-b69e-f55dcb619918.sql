
-- PHASE 1: DATABASE CLEANUP - Delete all existing user data
DELETE FROM debt_payments;
DELETE FROM debt_reminders;
DELETE FROM debts;
DELETE FROM expenses;
DELETE FROM onboarding_expenses;
DELETE FROM transactions;
DELETE FROM goals;
DELETE FROM user_categories;
DELETE FROM financial_data;
DELETE FROM user_financial_data;
DELETE FROM user_financial_plans;
DELETE FROM user_action_plans;
DELETE FROM ai_recommendations;
DELETE FROM budget;
DELETE FROM user_profiles;
DELETE FROM profiles;

-- Delete from auth.users (this will cascade delete related data)
DELETE FROM auth.users;

-- PHASE 2: Create loans table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.loans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  lender text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_amount numeric NOT NULL,
  payment_dates integer[] NOT NULL,
  total_payments integer NOT NULL,
  remaining_payments integer NOT NULL,
  next_payment_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on loans table
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for loans
CREATE POLICY "Users can view their own loans" 
  ON public.loans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loans" 
  ON public.loans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loans" 
  ON public.loans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loans" 
  ON public.loans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- PHASE 3: Create trigger function to auto-create Kueski loan on user signup
CREATE OR REPLACE FUNCTION public.create_default_kueski_loan()
RETURNS TRIGGER AS $$
BEGIN
  -- Create Kueski loan for new user
  INSERT INTO public.loans (
    user_id, 
    lender, 
    amount, 
    currency, 
    payment_amount, 
    payment_dates, 
    total_payments, 
    remaining_payments, 
    next_payment_date, 
    status
  ) VALUES (
    NEW.id, 
    'Kueski', 
    500, 
    'USD', 
    100, 
    ARRAY[15, 30], 
    5, 
    5, 
    '2025-08-15'::date, 
    'active'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PHASE 4: Create trigger to automatically create Kueski loan when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_kueski_loan ON auth.users;
CREATE TRIGGER on_auth_user_created_kueski_loan
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.create_default_kueski_loan();

-- Add updated_at trigger for loans table
DROP TRIGGER IF EXISTS handle_updated_at_loans ON public.loans;
CREATE TRIGGER handle_updated_at_loans
  BEFORE UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
