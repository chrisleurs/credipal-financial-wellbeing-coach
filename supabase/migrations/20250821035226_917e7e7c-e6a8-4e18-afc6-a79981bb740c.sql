
-- Eliminar todos los registros de la tabla profiles
DELETE FROM public.profiles;

-- Eliminar todos los registros de la tabla user_profiles si existe
DELETE FROM public.user_profiles;

-- Eliminar todos los registros de la tabla user_financial_dashboard si existe
DELETE FROM public.user_financial_dashboard;

-- Resetear cualquier dato financiero asociado a usuarios
DELETE FROM public.financial_summary;
DELETE FROM public.expenses;
DELETE FROM public.debts;
DELETE FROM public.goals;
DELETE FROM public.income_sources;
DELETE FROM public.incomes;
DELETE FROM public.transactions;
DELETE FROM public.financial_plans;
DELETE FROM public.user_action_plans;
DELETE FROM public.ai_recommendations;
DELETE FROM public.budget;
DELETE FROM public.user_categories;
DELETE FROM public.loans;

-- Verificar que las tablas estén vacías
SELECT 'profiles' as tabla, count(*) as registros FROM public.profiles
UNION ALL
SELECT 'user_profiles' as tabla, count(*) as registros FROM public.user_profiles
UNION ALL
SELECT 'financial_summary' as tabla, count(*) as registros FROM public.financial_summary;
