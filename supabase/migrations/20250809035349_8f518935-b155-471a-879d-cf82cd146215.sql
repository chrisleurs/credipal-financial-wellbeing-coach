
-- Actualizar la tabla user_financial_data para incluir los campos faltantes
ALTER TABLE public.user_financial_data 
ADD COLUMN IF NOT EXISTS gastos_totales numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS ahorros_actuales numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS capacidad_ahorro numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS metas_financieras jsonb DEFAULT '[]'::jsonb;

-- Comentario: Los campos ingresos, gastos_categorizados, deudas ya existen
-- El campo user_id ya existe, solo necesitamos estos campos adicionales
