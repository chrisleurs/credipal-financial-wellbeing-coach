
-- Create table for storing AI-generated financial plans
CREATE TABLE public.financial_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_data JSONB NOT NULL DEFAULT '{}',
  plan_type TEXT NOT NULL DEFAULT '3-2-1',
  status TEXT NOT NULL DEFAULT 'active',
  goals JSONB NOT NULL DEFAULT '[]',
  recommendations JSONB NOT NULL DEFAULT '[]',
  monthly_balance NUMERIC NOT NULL DEFAULT 0,
  savings_suggestion NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.financial_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own financial plans" 
  ON public.financial_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own financial plans" 
  ON public.financial_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial plans" 
  ON public.financial_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial plans" 
  ON public.financial_plans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE TRIGGER update_financial_plans_updated_at
  BEFORE UPDATE ON public.financial_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
