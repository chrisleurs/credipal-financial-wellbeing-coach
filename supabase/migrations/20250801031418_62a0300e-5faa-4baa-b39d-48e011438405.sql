
-- Limpiar TODOS los datos de usuarios y financieros para testing completo
-- Manteniendo estructura, RLS policies, funciones y triggers

-- 1. Datos financieros y transacciones
DELETE FROM public.expenses;
DELETE FROM public.debts;
DELETE FROM public.debt_payments;
DELETE FROM public.debt_reminders;
DELETE FROM public.transactions;
DELETE FROM public.user_financial_data;
DELETE FROM public.financial_data;
DELETE FROM public.user_financial_plans;
DELETE FROM public.user_action_plans;
DELETE FROM public.goals;
DELETE FROM public.ai_recommendations;
DELETE FROM public.budget;
DELETE FROM public.user_loans;

-- 2. Perfiles de usuario y datos de onboarding
DELETE FROM public.user_profiles;
DELETE FROM public.profiles;

-- Verificar que las tablas están vacías pero la estructura permanece
SELECT 'expenses' as tabla, count(*) as registros FROM public.expenses
UNION ALL
SELECT 'debts', count(*) FROM public.debts
UNION ALL
SELECT 'debt_payments', count(*) FROM public.debt_payments
UNION ALL
SELECT 'user_profiles', count(*) FROM public.user_profiles
UNION ALL
SELECT 'profiles', count(*) FROM public.profiles
UNION ALL
SELECT 'user_financial_data', count(*) FROM public.user_financial_data
UNION ALL
SELECT 'goals', count(*) FROM public.goals
UNION ALL
SELECT 'transactions', count(*) FROM public.transactions;
