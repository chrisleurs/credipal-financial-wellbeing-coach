
-- Add Karen's income data directly to income_sources table
INSERT INTO public.income_sources (user_id, source_name, amount, frequency, is_active)
SELECT 
    p.user_id,
    'Ingreso Fijo',
    30000,
    'monthly',
    true
FROM public.profiles p 
WHERE p.email = 'karen@gmail.com';

INSERT INTO public.income_sources (user_id, source_name, amount, frequency, is_active)
SELECT 
    p.user_id,
    'Ingreso Variable',
    5000,
    'monthly',
    true
FROM public.profiles p 
WHERE p.email = 'karen@gmail.com';

-- Add Karen's additional debt (the $50,000 debt with $500 monthly payment)
INSERT INTO public.debts (user_id, creditor, original_amount, current_balance, monthly_payment, interest_rate, status)
SELECT 
    p.user_id,
    'Deuda Personal',
    50000,
    50000,
    500,
    0,
    'active'
FROM public.profiles p 
WHERE p.email = 'karen@gmail.com';

-- Recalculate financial summary for Karen
SELECT public.calculate_financial_summary(p.user_id)
FROM public.profiles p 
WHERE p.email = 'karen@gmail.com';
