
-- Actualizar el perfil del usuario con datos de onboarding de ejemplo
UPDATE profiles 
SET onboarding_data = '{
  "monthlyIncome": 25000,
  "extraIncome": 5000,
  "monthlyExpenses": 15000,
  "expenseCategories": {
    "food": 5000,
    "transport": 3000,
    "housing": 4000,
    "bills": 2000,
    "entertainment": 1000
  },
  "debts": [
    {
      "name": "Tarjeta de crédito BBVA",
      "amount": 50000,
      "monthlyPayment": 2500
    },
    {
      "name": "Préstamo personal",
      "amount": 80000,
      "monthlyPayment": 3200
    }
  ],
  "currentSavings": 15000,
  "monthlySavingsCapacity": 4300,
  "financialGoals": [
    "Crear un fondo de emergencia",
    "Pagar todas mis deudas",
    "Ahorrar para vacaciones"
  ],
  "whatsappOptin": true
}',
onboarding_completed = true
WHERE user_id = (
  SELECT id FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- También insertar algunos gastos de onboarding para que aparezcan en las categorías
INSERT INTO onboarding_expenses (user_id, category, subcategory, amount) 
SELECT 
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  'Food & Dining',
  'Groceries',
  3000
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_expenses 
  WHERE user_id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1)
);

INSERT INTO onboarding_expenses (user_id, category, subcategory, amount) 
SELECT 
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  'Food & Dining',
  'Restaurants',
  2000
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_expenses 
  WHERE user_id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1)
  AND category = 'Food & Dining' 
  AND subcategory = 'Restaurants'
);

INSERT INTO onboarding_expenses (user_id, category, subcategory, amount) 
SELECT 
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  'Transportation',
  'Gas',
  2000
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_expenses 
  WHERE user_id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1)
  AND category = 'Transportation'
);

INSERT INTO onboarding_expenses (user_id, category, subcategory, amount) 
SELECT 
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  'Transportation',
  'Public transport',
  1000
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_expenses 
  WHERE user_id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1)
  AND category = 'Transportation'
  AND subcategory = 'Public transport'
);

INSERT INTO onboarding_expenses (user_id, category, subcategory, amount) 
SELECT 
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  'Housing & Utilities',
  'Rent',
  4000
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_expenses 
  WHERE user_id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1)
  AND category = 'Housing & Utilities'
);
