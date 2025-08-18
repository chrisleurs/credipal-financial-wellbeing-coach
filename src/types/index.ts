/**
 * Main Types Index - Single entry point for all types
 */

// Export new unified domain types as primary
export * from './domains'

// Export mappers
export * from '../utils/mappers'

// Legacy compatibility exports (deprecated - use domain types instead)
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

// Keep unified.ts exports for backward compatibility but marked as deprecated
/**
 * @deprecated Use domain types from src/types/domains instead
 */
export type { FinancialData } from './unified'
