
-- Create the incomes table
CREATE TABLE IF NOT EXISTS incomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  frequency VARCHAR(50) DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT true,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index and enable RLS
CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON incomes(user_id);
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage own incomes" ON incomes
  FOR ALL USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER handle_updated_at_incomes
  BEFORE UPDATE ON incomes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
