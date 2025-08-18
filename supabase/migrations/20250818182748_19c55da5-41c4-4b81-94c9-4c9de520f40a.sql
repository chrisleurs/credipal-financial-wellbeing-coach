
-- Create function to calculate user financial summary
CREATE OR REPLACE FUNCTION public.calculate_user_financial_summary(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
  monthly_income DECIMAL := 0;
  monthly_expenses DECIMAL := 0;
  total_debt_amount DECIMAL := 0;
  debt_payments DECIMAL := 0;
  capacity DECIMAL := 0;
BEGIN
  -- Calculate total monthly income from active income sources
  SELECT COALESCE(SUM(
    CASE 
      WHEN frequency = 'monthly' THEN amount
      WHEN frequency = 'biweekly' THEN amount * 2
      WHEN frequency = 'weekly' THEN amount * 4
      WHEN frequency = 'yearly' THEN amount / 12
      ELSE amount
    END
  ), 0) INTO monthly_income
  FROM public.income_sources 
  WHERE user_id = target_user_id AND is_active = true;

  -- Calculate monthly expenses (average from last 30 days)
  SELECT COALESCE(AVG(daily_total) * 30, 0) INTO monthly_expenses
  FROM (
    SELECT DATE(date) as expense_date, SUM(amount) as daily_total
    FROM public.expenses 
    WHERE user_id = target_user_id 
      AND date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(date)
  ) daily_averages;

  -- Calculate total debt and monthly payments from active debts
  SELECT 
    COALESCE(SUM(current_balance), 0),
    COALESCE(SUM(monthly_payment), 0)
  INTO total_debt_amount, debt_payments
  FROM public.debts 
  WHERE user_id = target_user_id AND status = 'active';

  -- Calculate savings capacity
  capacity := monthly_income - monthly_expenses - debt_payments;

  -- Upsert financial summary
  INSERT INTO public.financial_summary (
    user_id, 
    total_monthly_income, 
    total_monthly_expenses, 
    total_debt, 
    monthly_debt_payments, 
    savings_capacity,
    emergency_fund,
    last_calculated
  ) VALUES (
    target_user_id, 
    monthly_income, 
    monthly_expenses, 
    total_debt_amount, 
    debt_payments, 
    capacity,
    0, -- Initialize emergency fund to 0
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_monthly_income = EXCLUDED.total_monthly_income,
    total_monthly_expenses = EXCLUDED.total_monthly_expenses,
    total_debt = EXCLUDED.total_debt,
    monthly_debt_payments = EXCLUDED.monthly_debt_payments,
    savings_capacity = EXCLUDED.savings_capacity,
    last_calculated = EXCLUDED.last_calculated,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to update financial summary
CREATE OR REPLACE FUNCTION public.trigger_calculate_financial_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Update for the affected user
  PERFORM public.calculate_user_financial_summary(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_summary_on_income_change ON public.income_sources;
DROP TRIGGER IF EXISTS update_summary_on_expense_change ON public.expenses;
DROP TRIGGER IF EXISTS update_summary_on_debt_change ON public.debts;

-- Create triggers to automatically update financial summary
CREATE TRIGGER update_summary_on_income_change
  AFTER INSERT OR UPDATE OR DELETE ON public.income_sources
  FOR EACH ROW EXECUTE FUNCTION public.trigger_calculate_financial_summary();

CREATE TRIGGER update_summary_on_expense_change
  AFTER INSERT OR UPDATE OR DELETE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.trigger_calculate_financial_summary();

CREATE TRIGGER update_summary_on_debt_change
  AFTER INSERT OR UPDATE OR DELETE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION public.trigger_calculate_financial_summary();

-- Create comprehensive dashboard view
CREATE OR REPLACE VIEW public.user_financial_dashboard AS
SELECT 
  p.user_id,
  p.first_name,
  p.last_name,
  p.email,
  p.onboarding_completed,
  p.onboarding_step,
  
  -- Financial summary data
  COALESCE(fs.total_monthly_income, 0) as total_monthly_income,
  COALESCE(fs.total_monthly_expenses, 0) as total_monthly_expenses,
  COALESCE(fs.total_debt, 0) as total_debt,
  COALESCE(fs.monthly_debt_payments, 0) as monthly_debt_payments,
  COALESCE(fs.savings_capacity, 0) as savings_capacity,
  COALESCE(fs.emergency_fund, 0) as emergency_fund,
  fs.last_calculated,
  
  -- Goal statistics
  COALESCE(goal_stats.active_goals_count, 0) as active_goals_count,
  COALESCE(goal_stats.total_target_amount, 0) as total_target_amount,
  COALESCE(goal_stats.total_current_amount, 0) as total_current_amount,
  
  -- Latest financial plan
  fp.id as latest_plan_id,
  fp.plan_type as latest_plan_type,
  fp.status as latest_plan_status,
  fp.created_at as latest_plan_created,
  
  -- Calculated metrics
  CASE 
    WHEN COALESCE(fs.total_monthly_income, 0) > 0 
    THEN ROUND((COALESCE(fs.monthly_debt_payments, 0) / fs.total_monthly_income) * 100, 2)
    ELSE 0 
  END as debt_to_income_ratio,
  
  CASE 
    WHEN COALESCE(fs.total_monthly_income, 0) > 0 
    THEN ROUND((COALESCE(fs.savings_capacity, 0) / fs.total_monthly_income) * 100, 2)
    ELSE 0 
  END as savings_rate,
  
  CASE 
    WHEN COALESCE(fs.total_monthly_expenses, 0) > 0 
    THEN ROUND(COALESCE(fs.emergency_fund, 0) / fs.total_monthly_expenses, 1)
    ELSE 0 
  END as emergency_fund_months

FROM public.profiles p
LEFT JOIN public.financial_summary fs ON p.user_id = fs.user_id
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as active_goals_count,
    SUM(target_amount) as total_target_amount,
    SUM(current_amount) as total_current_amount
  FROM public.goals 
  WHERE status = 'active'
  GROUP BY user_id
) goal_stats ON p.user_id = goal_stats.user_id
LEFT JOIN (
  SELECT DISTINCT ON (user_id) 
    user_id, id, plan_type, status, created_at
  FROM public.financial_plans
  ORDER BY user_id, created_at DESC
) fp ON p.user_id = fp.user_id;

-- Grant permissions to authenticated users
GRANT SELECT ON public.user_financial_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_user_financial_summary(UUID) TO authenticated;
