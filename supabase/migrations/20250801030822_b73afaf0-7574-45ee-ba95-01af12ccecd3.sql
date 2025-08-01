
-- Remove all financial data from existing users
DELETE FROM public.user_financial_data;
DELETE FROM public.financial_data;
DELETE FROM public.user_action_plans;
DELETE FROM public.user_financial_plans;

-- Reset onboarding progress for all users so they can start fresh
UPDATE public.profiles 
SET onboarding_completed = false,
    onboarding_step = 0,
    onboarding_data = '{}'::jsonb;

-- Clear any stored financial goals and AI recommendations
DELETE FROM public.goals;
DELETE FROM public.ai_recommendations;
DELETE FROM public.budget;
