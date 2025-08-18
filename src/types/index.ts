// Re-export unified types as the main types
export * from './unified'

// Keep legacy exports for backward compatibility
export type { FinancialPlan } from './financialPlan'
export type { 
  Debt as LegacyDebt,
  DebtPayment as LegacyDebtPayment,
  DebtReminder,
  DebtScenario,
  AIMotivationalMessage 
} from './debt'
export type {
  IncomeSource as DatabaseIncomeSource,
  Expense as DatabaseExpense,
  Debt as DatabaseDebt,
  Goal as DatabaseGoal,
  FinancialSummary as DatabaseFinancialSummary,
  FinancialPlan as DatabaseFinancialPlan
} from './database'
