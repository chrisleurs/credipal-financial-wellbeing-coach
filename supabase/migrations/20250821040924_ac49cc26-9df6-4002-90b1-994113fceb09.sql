
-- Crear tabla para gastos del onboarding
CREATE TABLE public.onboarding_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.onboarding_expenses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para que los usuarios solo vean sus propios gastos
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

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_onboarding_expenses_updated_at
  BEFORE UPDATE ON public.onboarding_expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Índices para mejorar rendimiento
CREATE INDEX idx_onboarding_expenses_user_id ON public.onboarding_expenses(user_id);
CREATE INDEX idx_onboarding_expenses_category ON public.onboarding_expenses(user_id, category);
