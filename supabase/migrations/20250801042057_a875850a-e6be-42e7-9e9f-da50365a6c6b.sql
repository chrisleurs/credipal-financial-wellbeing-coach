
-- Create a table for user's custom categories
CREATE TABLE public.user_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  main_category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name, main_category)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for user_categories
CREATE POLICY "Users can view their own categories" 
  ON public.user_categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
  ON public.user_categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON public.user_categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON public.user_categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create a table for individual expenses during onboarding
CREATE TABLE public.onboarding_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.onboarding_expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding_expenses
CREATE POLICY "Users can view their own onboarding expenses" 
  ON public.onboarding_expenses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding expenses" 
  ON public.onboarding_expenses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding expenses" 
  ON public.onboarding_expenses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own onboarding expenses" 
  ON public.onboarding_expenses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.onboarding_expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
