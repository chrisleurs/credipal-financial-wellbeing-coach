
-- Create user_categories table for custom expense subcategories
CREATE TABLE public.user_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name varchar(50) NOT NULL,
  main_category varchar(20) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at_user_categories
  BEFORE UPDATE ON public.user_categories
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add unique constraint to prevent duplicate category names per user
ALTER TABLE public.user_categories 
ADD CONSTRAINT unique_user_category UNIQUE (user_id, name, main_category);

-- Insert some default custom subcategories for better UX
INSERT INTO public.user_categories (user_id, name, main_category) VALUES 
-- We'll populate these via the app instead to respect RLS
-- This is just the structure
