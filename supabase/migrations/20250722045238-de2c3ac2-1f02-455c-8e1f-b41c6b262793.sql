
-- Create debts table with comprehensive fields
CREATE TABLE public.debts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creditor_name text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  current_balance numeric NOT NULL CHECK (current_balance >= 0),
  annual_interest_rate numeric NOT NULL DEFAULT 0 CHECK (annual_interest_rate >= 0),
  minimum_payment numeric NOT NULL CHECK (minimum_payment > 0),
  due_day integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create debt payments history table
CREATE TABLE public.debt_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id uuid NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create debt reminders table
CREATE TABLE public.debt_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id uuid NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  days_before integer NOT NULL CHECK (days_before > 0),
  is_active boolean NOT NULL DEFAULT true,
  reminder_type text NOT NULL DEFAULT 'email',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for debts
CREATE POLICY "Users can view their own debts" 
  ON public.debts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debts" 
  ON public.debts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debts" 
  ON public.debts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debts" 
  ON public.debts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for debt payments
CREATE POLICY "Users can view their own debt payments" 
  ON public.debt_payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debt payments" 
  ON public.debt_payments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debt payments" 
  ON public.debt_payments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debt payments" 
  ON public.debt_payments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for debt reminders
CREATE POLICY "Users can view their own debt reminders" 
  ON public.debt_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debt reminders" 
  ON public.debt_reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debt reminders" 
  ON public.debt_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debt reminders" 
  ON public.debt_reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER handle_debts_updated_at
  BEFORE UPDATE ON public.debts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_debt_reminders_updated_at
  BEFORE UPDATE ON public.debt_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically update debt balance after payment
CREATE OR REPLACE FUNCTION public.update_debt_balance_after_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the current balance of the debt
  UPDATE public.debts 
  SET current_balance = current_balance - NEW.amount,
      updated_at = now()
  WHERE id = NEW.debt_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_debt_balance_trigger
  AFTER INSERT ON public.debt_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_debt_balance_after_payment();
