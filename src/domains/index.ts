
/**
 * Domain Index - Central export hub for all domain modules
 */

// Domain hooks
export * from './debts/hooks/useDebts'
export * from './expenses/hooks/useExpenses'
export * from './income/hooks/useIncomes'
export * from './savings/hooks/useGoals'

// Domain types
export * from './debts/types/debt.types'
export * from './expenses/types/expense.types'
export * from './income/types/income.types'
export * from './savings/types/savings.types'
