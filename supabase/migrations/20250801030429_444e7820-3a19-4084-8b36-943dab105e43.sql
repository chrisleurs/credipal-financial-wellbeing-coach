
-- Agregar campos para guardar el progreso del onboarding
ALTER TABLE public.profiles 
ADD COLUMN onboarding_step INTEGER DEFAULT 0,
ADD COLUMN onboarding_data JSONB DEFAULT '{}'::jsonb;

-- Actualizar perfiles existentes para asegurar valores por defecto
UPDATE public.profiles 
SET onboarding_step = 0, onboarding_data = '{}'::jsonb 
WHERE onboarding_step IS NULL OR onboarding_data IS NULL;
