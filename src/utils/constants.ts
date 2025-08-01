
export const EXPENSE_CATEGORIES = [
  { value: 'housing', label: 'Housing', icon: '🏠' },
  { value: 'food', label: 'Food & Dining', icon: '🍽️' },
  { value: 'transport', label: 'Transportation', icon: '🚗' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'healthcare', label: 'Healthcare', icon: '⚕️' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'utilities', label: 'Bills & Services', icon: '💡' },
  { value: 'other', label: 'Other', icon: '📦' }
];

export const GOAL_TYPES = [
  { value: 'emergency_fund', label: 'Emergency Fund', icon: '🛡️' },
  { value: 'vacation', label: 'Vacation', icon: '🏖️' },
  { value: 'house', label: 'House/Apartment', icon: '🏠' },
  { value: 'car', label: 'Vehicle', icon: '🚗' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'retirement', label: 'Retirement', icon: '🏖️' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'debt_payment', label: 'Debt Payment', icon: '💳' },
  { value: 'other', label: 'Other', icon: '🎯' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-red-600' }
];

export const WHATSAPP_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Income', description: 'Monthly income' },
  { id: 2, title: 'Expenses', description: 'Categorized expenses' },
  { id: 3, title: 'Debts', description: 'Current debts' },
  { id: 4, title: 'Savings', description: 'Savings situation' },
  { id: 5, title: 'Goals', description: 'Financial objectives' },
  { id: 6, title: 'WhatsApp', description: 'Notifications' },
  { id: 7, title: 'AI', description: 'Plan generation' },
  { id: 8, title: 'Summary', description: 'Financial plan' },
  { id: 9, title: 'Actions', description: 'Action plan' }
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const PERCENTAGE_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2
});
