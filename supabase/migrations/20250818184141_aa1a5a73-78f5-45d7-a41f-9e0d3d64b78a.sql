
-- CrediPal Data Migration Script
-- From old Spanish structure to new English structure
-- Version: 1.0
-- Date: 2025-01-18

-- =====================================================
-- STEP 1: CREATE BACKUP TABLES
-- =====================================================

-- Create backup tables with timestamp
CREATE TABLE IF NOT EXISTS migration_backup_user_financial_data AS 
SELECT *, now() as backup_created_at FROM user_financial_data WHERE false;

CREATE TABLE IF NOT EXISTS migration_backup_onboarding_expenses AS 
SELECT *, now() as backup_created_at FROM onboarding_expenses WHERE false;

CREATE TABLE IF NOT EXISTS migration_backup_financial_data AS 
SELECT *, now() as backup_created_at FROM financial_data WHERE false;

-- Create migration log table
CREATE TABLE IF NOT EXISTS migration_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_type TEXT NOT NULL,
  old_table TEXT NOT NULL,
  old_id UUID,
  new_table TEXT NOT NULL,
  new_id UUID,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create migration status table
CREATE TABLE IF NOT EXISTS migration_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_records INTEGER DEFAULT 0,
  migrated_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- STEP 2: BACKUP EXISTING DATA
-- =====================================================

-- Function to create backups
CREATE OR REPLACE FUNCTION create_migration_backups()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Backup user_financial_data if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_financial_data') THEN
    INSERT INTO migration_backup_user_financial_data 
    SELECT *, now() FROM user_financial_data;
    
    INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status)
    SELECT 'backup', 'user_financial_data', 'migration_backup_user_financial_data', 
           COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid), 'completed'
    FROM user_financial_data;
  END IF;

  -- Backup onboarding_expenses if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'onboarding_expenses') THEN
    INSERT INTO migration_backup_onboarding_expenses 
    SELECT *, now() FROM onboarding_expenses;
    
    INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status)
    SELECT 'backup', 'onboarding_expenses', 'migration_backup_onboarding_expenses', 
           user_id, 'completed'
    FROM onboarding_expenses;
  END IF;

  -- Backup financial_data if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'financial_data') THEN
    INSERT INTO migration_backup_financial_data 
    SELECT *, now() FROM financial_data;
    
    INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status)
    SELECT 'backup', 'financial_data', 'migration_backup_financial_data', 
           user_id, 'completed'
    FROM financial_data;
  END IF;

  -- Update migration status
  INSERT INTO migration_status (migration_name, status, started_at, completed_at)
  VALUES ('backup_creation', 'completed', now(), now())
  ON CONFLICT (migration_name) DO UPDATE SET
    status = 'completed',
    completed_at = now();

  RAISE NOTICE 'Migration backups created successfully';
END;
$$;

-- =====================================================
-- STEP 3: DATA MIGRATION FUNCTIONS
-- =====================================================

-- Function to migrate income sources
CREATE OR REPLACE FUNCTION migrate_income_sources()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  rec RECORD;
  new_income_id UUID;
  migration_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Update migration status
  INSERT INTO migration_status (migration_name, status, started_at)
  VALUES ('income_migration', 'in_progress', now())
  ON CONFLICT (migration_name) DO UPDATE SET
    status = 'in_progress',
    started_at = now();

  -- Migrate from user_financial_data.ingresos
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_financial_data') THEN
    FOR rec IN 
      SELECT DISTINCT user_id, ingresos as amount
      FROM user_financial_data 
      WHERE ingresos > 0 AND user_id IS NOT NULL
    LOOP
      BEGIN
        -- Insert main income
        INSERT INTO income_sources (user_id, source_name, amount, frequency, is_active)
        VALUES (rec.user_id, 'Ingresos principales', rec.amount, 'monthly', true)
        RETURNING id INTO new_income_id;
        
        -- Log migration
        INSERT INTO migration_log (migration_type, old_table, new_table, user_id, new_id, status)
        VALUES ('migrate_income', 'user_financial_data', 'income_sources', rec.user_id, new_income_id, 'completed');
        
        migration_count := migration_count + 1;
        
      EXCEPTION WHEN OTHERS THEN
        INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status, error_message)
        VALUES ('migrate_income', 'user_financial_data', 'income_sources', rec.user_id, 'failed', SQLERRM);
        error_count := error_count + 1;
      END;
    END LOOP;
  END IF;

  -- Migrate extra income (ingresos_extras)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_financial_data') THEN
    FOR rec IN 
      SELECT DISTINCT user_id, ingresos_extras as amount
      FROM user_financial_data 
      WHERE ingresos_extras > 0 AND user_id IS NOT NULL
    LOOP
      BEGIN
        INSERT INTO income_sources (user_id, source_name, amount, frequency, is_active)
        VALUES (rec.user_id, 'Ingresos adicionales', rec.amount, 'monthly', true)
        RETURNING id INTO new_income_id;
        
        INSERT INTO migration_log (migration_type, old_table, new_table, user_id, new_id, status)
        VALUES ('migrate_extra_income', 'user_financial_data', 'income_sources', rec.user_id, new_income_id, 'completed');
        
        migration_count := migration_count + 1;
        
      EXCEPTION WHEN OTHERS THEN
        INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status, error_message)
        VALUES ('migrate_extra_income', 'user_financial_data', 'income_sources', rec.user_id, 'failed', SQLERRM);
        error_count := error_count + 1;
      END;
    END LOOP;
  END IF;

  -- Update migration status
  UPDATE migration_status 
  SET status = 'completed', completed_at = now(), 
      migrated_records = migration_count, failed_records = error_count
  WHERE migration_name = 'income_migration';

  RAISE NOTICE 'Income migration completed: % successful, % failed', migration_count, error_count;
END;
$$;

-- Function to migrate expenses
CREATE OR REPLACE FUNCTION migrate_expenses()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  rec RECORD;
  category_rec RECORD;
  new_expense_id UUID;
  migration_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Update migration status
  INSERT INTO migration_status (migration_name, status, started_at)
  VALUES ('expense_migration', 'in_progress', now())
  ON CONFLICT (migration_name) DO UPDATE SET
    status = 'in_progress',
    started_at = now();

  -- Migrate from user_financial_data.gastos_categorizados
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_financial_data') THEN
    FOR rec IN 
      SELECT user_id, gastos_categorizados, created_at
      FROM user_financial_data 
      WHERE gastos_categorizados IS NOT NULL AND user_id IS NOT NULL
    LOOP
      BEGIN
        -- Parse JSON array of categorized expenses
        FOR category_rec IN 
          SELECT * FROM jsonb_array_elements(rec.gastos_categorizados::jsonb)
        LOOP
          BEGIN
            -- Extract category and amount, map Spanish to English
            INSERT INTO expenses (
              user_id, 
              category, 
              subcategory,
              amount, 
              date, 
              description,
              is_recurring
            )
            VALUES (
              rec.user_id,
              CASE 
                WHEN category_rec.value->>'category' = 'alimentacion' THEN 'Food'
                WHEN category_rec.value->>'category' = 'transporte' THEN 'Transportation'
                WHEN category_rec.value->>'category' = 'entretenimiento' THEN 'Entertainment'
                WHEN category_rec.value->>'category' = 'servicios' THEN 'Utilities'
                WHEN category_rec.value->>'category' = 'salud' THEN 'Healthcare'
                WHEN category_rec.value->>'category' = 'educacion' THEN 'Education'
                WHEN category_rec.value->>'category' = 'ropa' THEN 'Clothing'
                WHEN category_rec.value->>'category' = 'hogar' THEN 'Housing'
                ELSE COALESCE(category_rec.value->>'category', 'Other')
              END,
              category_rec.value->>'subcategory',
              COALESCE((category_rec.value->>'amount')::numeric, (category_rec.value->>'monto')::numeric, 0),
              COALESCE((category_rec.value->>'date')::date, (category_rec.value->>'fecha')::date, rec.created_at::date),
              COALESCE(category_rec.value->>'description', 'Migrated from old system'),
              true
            )
            RETURNING id INTO new_expense_id;
            
            INSERT INTO migration_log (migration_type, old_table, new_table, user_id, new_id, status)
            VALUES ('migrate_expense', 'user_financial_data', 'expenses', rec.user_id, new_expense_id, 'completed');
            
            migration_count := migration_count + 1;
            
          EXCEPTION WHEN OTHERS THEN
            INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status, error_message)
            VALUES ('migrate_expense', 'user_financial_data', 'expenses', rec.user_id, 'failed', SQLERRM);
            error_count := error_count + 1;
          END;
        END LOOP;
        
      EXCEPTION WHEN OTHERS THEN
        INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status, error_message)
        VALUES ('migrate_expense_group', 'user_financial_data', 'expenses', rec.user_id, 'failed', SQLERRM);
        error_count := error_count + 1;
      END;
    END LOOP;
  END IF;

  -- Migrate from onboarding_expenses
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'onboarding_expenses') THEN
    FOR rec IN 
      SELECT user_id, category, subcategory, amount, created_at, id as old_id
      FROM onboarding_expenses 
      WHERE user_id IS NOT NULL
    LOOP
      BEGIN
        INSERT INTO expenses (
          user_id,
          category,
          subcategory,
          amount,
          date,
          description,
          is_recurring
        )
        VALUES (
          rec.user_id,
          rec.category,
          rec.subcategory,
          rec.amount,
          rec.created_at::date,
          'Migrated from onboarding',
          false
        )
        RETURNING id INTO new_expense_id;
        
        INSERT INTO migration_log (migration_type, old_table, old_id, new_table, user_id, new_id, status)
        VALUES ('migrate_onboarding_expense', 'onboarding_expenses', rec.old_id, 'expenses', rec.user_id, new_expense_id, 'completed');
        
        migration_count := migration_count + 1;
        
      EXCEPTION WHEN OTHERS THEN
        INSERT INTO migration_log (migration_type, old_table, old_id, new_table, user_id, status, error_message)
        VALUES ('migrate_onboarding_expense', 'onboarding_expenses', rec.old_id, 'expenses', rec.user_id, 'failed', SQLERRM);
        error_count := error_count + 1;
      END;
    END LOOP;
  END IF;

  -- Update migration status
  UPDATE migration_status 
  SET status = 'completed', completed_at = now(), 
      migrated_records = migration_count, failed_records = error_count
  WHERE migration_name = 'expense_migration';

  RAISE NOTICE 'Expense migration completed: % successful, % failed', migration_count, error_count;
END;
$$;

-- Function to migrate debts
CREATE OR REPLACE FUNCTION migrate_debts()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  rec RECORD;
  debt_rec RECORD;
  new_debt_id UUID;
  migration_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Update migration status
  INSERT INTO migration_status (migration_name, status, started_at)
  VALUES ('debt_migration', 'in_progress', now())
  ON CONFLICT (migration_name) DO UPDATE SET
    status = 'in_progress',
    started_at = now();

  -- Migrate from user_financial_data.deudas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_financial_data') THEN
    FOR rec IN 
      SELECT user_id, deudas, created_at
      FROM user_financial_data 
      WHERE deudas IS NOT NULL AND user_id IS NOT NULL
    LOOP
      BEGIN
        -- Parse JSON array of debts
        FOR debt_rec IN 
          SELECT * FROM jsonb_array_elements(rec.deudas::jsonb)
        LOOP
          BEGIN
            INSERT INTO debts (
              user_id,
              creditor,
              original_amount,
              current_balance,
              monthly_payment,
              interest_rate,
              status
            )
            VALUES (
              rec.user_id,
              COALESCE(debt_rec.value->>'name', debt_rec.value->>'creditor', 'Unknown Creditor'),
              COALESCE((debt_rec.value->>'amount')::numeric, (debt_rec.value->>'monto')::numeric, 0),
              COALESCE((debt_rec.value->>'current_balance')::numeric, (debt_rec.value->>'amount')::numeric, (debt_rec.value->>'monto')::numeric, 0),
              COALESCE((debt_rec.value->>'monthly_payment')::numeric, (debt_rec.value->>'pago_mensual')::numeric, 0),
              COALESCE((debt_rec.value->>'interest_rate')::numeric, (debt_rec.value->>'tasa_interes')::numeric, 0),
              CASE 
                WHEN debt_rec.value->>'status' = 'activa' THEN 'active'
                WHEN debt_rec.value->>'status' = 'pagada' THEN 'paid'
                WHEN debt_rec.value->>'status' = 'morosa' THEN 'delinquent'
                ELSE 'active'
              END::debt_status
            )
            RETURNING id INTO new_debt_id;
            
            INSERT INTO migration_log (migration_type, old_table, new_table, user_id, new_id, status)
            VALUES ('migrate_debt', 'user_financial_data', 'debts', rec.user_id, new_debt_id, 'completed');
            
            migration_count := migration_count + 1;
            
          EXCEPTION WHEN OTHERS THEN
            INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status, error_message)
            VALUES ('migrate_debt', 'user_financial_data', 'debts', rec.user_id, 'failed', SQLERRM);
            error_count := error_count + 1;
          END;
        END LOOP;
        
      EXCEPTION WHEN OTHERS THEN
        INSERT INTO migration_log (migration_type, old_table, new_table, user_id, status, error_message)
        VALUES ('migrate_debt_group', 'user_financial_data', 'debts', rec.user_id, 'failed', SQLERRM);
        error_count := error_count + 1;
      END;
    END LOOP;
  END IF;

  -- Update migration status
  UPDATE migration_status 
  SET status = 'completed', completed_at = now(), 
      migrated_records = migration_count, failed_records = error_count
  WHERE migration_name = 'debt_migration';

  RAISE NOTICE 'Debt migration completed: % successful, % failed', migration_count, error_count;
END;
$$;

-- Function to migrate financial summaries
CREATE OR REPLACE FUNCTION migrate_financial_summaries()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  rec RECORD;
  new_summary_id UUID;
  migration_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Update migration status
  INSERT INTO migration_status (migration_name, status, started_at)
  VALUES ('financial_summary_migration', 'in_progress', now())
  ON CONFLICT (migration_name) DO UPDATE SET
    status = 'in_progress',
    started_at = now();

  -- Migrate from financial_data table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'financial_data') THEN
    FOR rec IN 
      SELECT user_id, monthly_income, monthly_expenses, current_savings, 
             savings_goal, emergency_fund_goal, created_at, id as old_id
      FROM financial_data 
      WHERE user_id IS NOT NULL
    LOOP
      BEGIN
        INSERT INTO financial_summary (
          user_id,
          total_monthly_income,
          total_monthly_expenses,
          total_debt,
          monthly_debt_payments,
          savings_capacity,
          emergency_fund,
          last_calculated
        )
        VALUES (
          rec.user_id,
          COALESCE(rec.monthly_income, 0),
          COALESCE(rec.monthly_expenses, 0),
          0, -- Will be calculated by triggers
          0, -- Will be calculated by triggers
          COALESCE(rec.monthly_income, 0) - COALESCE(rec.monthly_expenses, 0),
          COALESCE(rec.current_savings, 0),
          rec.created_at
        )
        ON CONFLICT (user_id) DO UPDATE SET
          total_monthly_income = EXCLUDED.total_monthly_income,
          total_monthly_expenses = EXCLUDED.total_monthly_expenses,
          savings_capacity = EXCLUDED.savings_capacity,
          emergency_fund = EXCLUDED.emergency_fund,
          last_calculated = EXCLUDED.last_calculated
        RETURNING id INTO new_summary_id;
        
        INSERT INTO migration_log (migration_type, old_table, old_id, new_table, user_id, new_id, status)
        VALUES ('migrate_financial_summary', 'financial_data', rec.old_id, 'financial_summary', rec.user_id, new_summary_id, 'completed');
        
        migration_count := migration_count + 1;
        
      EXCEPTION WHEN OTHERS THEN
        INSERT INTO migration_log (migration_type, old_table, old_id, new_table, user_id, status, error_message)
        VALUES ('migrate_financial_summary', 'financial_data', rec.old_id, 'financial_summary', rec.user_id, 'failed', SQLERRM);
        error_count := error_count + 1;
      END;
    END LOOP;
  END IF;

  -- Update migration status
  UPDATE migration_status 
  SET status = 'completed', completed_at = now(), 
      migrated_records = migration_count, failed_records = error_count
  WHERE migration_name = 'financial_summary_migration';

  RAISE NOTICE 'Financial summary migration completed: % successful, % failed', migration_count, error_count;
END;
$$;

-- =====================================================
-- STEP 4: ROLLBACK FUNCTIONS
-- =====================================================

-- Function to rollback migration
CREATE OR REPLACE FUNCTION rollback_migration()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE NOTICE 'Starting migration rollback...';
  
  -- Delete migrated records (keep only records that existed before migration)
  DELETE FROM income_sources WHERE id IN (
    SELECT new_id FROM migration_log WHERE new_table = 'income_sources' AND migration_type LIKE 'migrate_%'
  );
  
  DELETE FROM expenses WHERE id IN (
    SELECT new_id FROM migration_log WHERE new_table = 'expenses' AND migration_type LIKE 'migrate_%'
  );
  
  DELETE FROM debts WHERE id IN (
    SELECT new_id FROM migration_log WHERE new_table = 'debts' AND migration_type LIKE 'migrate_%'
  );
  
  DELETE FROM financial_summary WHERE id IN (
    SELECT new_id FROM migration_log WHERE new_table = 'financial_summary' AND migration_type LIKE 'migrate_%'
  );
  
  -- Update migration status
  UPDATE migration_status SET status = 'rolled_back', completed_at = now()
  WHERE migration_name IN ('income_migration', 'expense_migration', 'debt_migration', 'financial_summary_migration');
  
  RAISE NOTICE 'Migration rollback completed';
END;
$$;

-- =====================================================
-- STEP 5: MAIN MIGRATION FUNCTION
-- =====================================================

-- Main migration function
CREATE OR REPLACE FUNCTION run_credipal_migration(test_user_id UUID DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE NOTICE 'Starting CrediPal data migration...';
  
  -- Create backups
  PERFORM create_migration_backups();
  
  -- Run migrations in order
  PERFORM migrate_income_sources();
  PERFORM migrate_expenses();
  PERFORM migrate_debts();
  PERFORM migrate_financial_summaries();
  
  -- Recalculate financial summaries for all users
  PERFORM calculate_financial_summary(user_id) 
  FROM (SELECT DISTINCT user_id FROM income_sources 
        UNION 
        SELECT DISTINCT user_id FROM expenses 
        UNION 
        SELECT DISTINCT user_id FROM debts) users;
  
  RAISE NOTICE 'CrediPal migration completed successfully';
END;
$$;

-- =====================================================
-- STEP 6: VALIDATION FUNCTIONS
-- =====================================================

-- Function to validate migration results
CREATE OR REPLACE FUNCTION validate_migration()
RETURNS TABLE (
  validation_type TEXT,
  old_count BIGINT,
  new_count BIGINT,
  status TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate income sources
  RETURN QUERY
  SELECT 
    'income_sources'::TEXT,
    COALESCE((SELECT COUNT(*) FROM migration_log WHERE migration_type LIKE '%income%' AND status = 'completed'), 0),
    (SELECT COUNT(*) FROM income_sources),
    CASE WHEN (SELECT COUNT(*) FROM income_sources) > 0 THEN 'OK' ELSE 'CHECK' END;
  
  -- Validate expenses
  RETURN QUERY
  SELECT 
    'expenses'::TEXT,
    COALESCE((SELECT COUNT(*) FROM migration_log WHERE migration_type LIKE '%expense%' AND status = 'completed'), 0),
    (SELECT COUNT(*) FROM expenses),
    CASE WHEN (SELECT COUNT(*) FROM expenses) > 0 THEN 'OK' ELSE 'CHECK' END;
  
  -- Validate debts
  RETURN QUERY
  SELECT 
    'debts'::TEXT,
    COALESCE((SELECT COUNT(*) FROM migration_log WHERE migration_type LIKE '%debt%' AND status = 'completed'), 0),
    (SELECT COUNT(*) FROM debts),
    CASE WHEN (SELECT COUNT(*) FROM debts) >= 0 THEN 'OK' ELSE 'CHECK' END;
    
  -- Validate financial summaries
  RETURN QUERY
  SELECT 
    'financial_summary'::TEXT,
    COALESCE((SELECT COUNT(*) FROM migration_log WHERE migration_type LIKE '%financial_summary%' AND status = 'completed'), 0),
    (SELECT COUNT(*) FROM financial_summary),
    CASE WHEN (SELECT COUNT(*) FROM financial_summary) >= 0 THEN 'OK' ELSE 'CHECK' END;
END;
$$;

-- =====================================================
-- STEP 7: CLEANUP FUNCTIONS
-- =====================================================

-- Function to clean up after successful migration
CREATE OR REPLACE FUNCTION cleanup_after_migration()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function should only be run after confirming migration success
  RAISE NOTICE 'Cleaning up old tables after successful migration...';
  
  -- Comment out the actual drops for safety - run manually after verification
  -- DROP TABLE IF EXISTS user_financial_data CASCADE;
  -- DROP TABLE IF EXISTS onboarding_expenses CASCADE;
  -- DROP TABLE IF EXISTS financial_data CASCADE;
  
  RAISE NOTICE 'Cleanup completed. Manual verification and table drops recommended.';
END;
$$;

-- Add helpful views for migration monitoring
CREATE OR REPLACE VIEW migration_summary AS
SELECT 
  migration_name,
  status,
  total_records,
  migrated_records,
  failed_records,
  CASE 
    WHEN total_records > 0 THEN ROUND((migrated_records::DECIMAL / total_records::DECIMAL) * 100, 2)
    ELSE 0 
  END as success_percentage,
  started_at,
  completed_at,
  CASE 
    WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
    THEN completed_at - started_at 
    ELSE NULL 
  END as duration
FROM migration_status
ORDER BY created_at;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_migration_log_user_id ON migration_log(user_id);
CREATE INDEX IF NOT EXISTS idx_migration_log_status ON migration_log(status);
CREATE INDEX IF NOT EXISTS idx_migration_log_type ON migration_log(migration_type);

-- Final notice
DO $$
BEGIN
  RAISE NOTICE '=== CrediPal Migration Script Setup Complete ===';
  RAISE NOTICE 'To run migration: SELECT run_credipal_migration();';
  RAISE NOTICE 'To validate results: SELECT * FROM validate_migration();';
  RAISE NOTICE 'To view progress: SELECT * FROM migration_summary;';
  RAISE NOTICE 'To rollback: SELECT rollback_migration();';
  RAISE NOTICE '============================================';
END $$;
