
-- Agregar campo para trackear si el onboarding está completo
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- Actualizar usuarios existentes que ya tienen datos financieros
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE user_id IN (
  SELECT DISTINCT user_id 
  FROM public.user_financial_data 
  WHERE user_id IS NOT NULL
);
