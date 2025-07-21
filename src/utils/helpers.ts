import { CURRENCY_FORMAT, PERCENTAGE_FORMAT } from './constants';

export const formatCurrency = (amount: number): string => {
  return CURRENCY_FORMAT.format(amount);
};

export const formatPercentage = (value: number): string => {
  return PERCENTAGE_FORMAT.format(value / 100);
};

export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+52|52)?[\s\-]?[1-9][\d\s\-]{8,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const calculateMonthlyBalance = (income: number, expenses: number): number => {
  return income - expenses;
};

export const calculateTotalExpenses = (expenses: Record<string, number>): number => {
  return Object.values(expenses).reduce((total, amount) => total + amount, 0);
};

export const calculateEmergencyFundGoal = (monthlyExpenses: number, months: number = 6): number => {
  return monthlyExpenses * months;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatRelativeDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.ceil(diffDays / 30)} meses`;
  return `Hace ${Math.ceil(diffDays / 365)} años`;
};

export const calculateDebtToIncomeRatio = (totalDebt: number, monthlyIncome: number): number => {
  if (monthlyIncome === 0) return 0;
  return (totalDebt / monthlyIncome) * 100;
};

export const calculateSavingsRate = (savings: number, income: number): number => {
  if (income === 0) return 0;
  return (savings / income) * 100;
};

export const getFinancialHealthScore = (
  debtToIncomeRatio: number,
  savingsRate: number,
  emergencyFundRatio: number
): { score: number; level: string; color: string } => {
  let score = 100;

  // Penalizar ratio deuda/ingreso alto
  if (debtToIncomeRatio > 36) score -= 30;
  else if (debtToIncomeRatio > 28) score -= 20;
  else if (debtToIncomeRatio > 20) score -= 10;

  // Penalizar tasa de ahorro baja
  if (savingsRate < 10) score -= 25;
  else if (savingsRate < 15) score -= 15;
  else if (savingsRate < 20) score -= 10;

  // Penalizar fondo de emergencia insuficiente
  if (emergencyFundRatio < 3) score -= 25;
  else if (emergencyFundRatio < 6) score -= 15;

  score = Math.max(0, Math.min(100, score));

  let level: string;
  let color: string;

  if (score >= 80) {
    level = 'Excelente';
    color = 'text-green-600';
  } else if (score >= 60) {
    level = 'Bueno';
    color = 'text-yellow-600';
  } else if (score >= 40) {
    level = 'Regular';
    color = 'text-orange-600';
  } else {
    level = 'Necesita Mejora';
    color = 'text-red-600';
  }

  return { score, level, color };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};