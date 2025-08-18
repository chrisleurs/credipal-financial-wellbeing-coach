
/**
 * Domains Index - Exporta todos los tipos de dominios
 */

// Shared types
export * from '../shared/types/core.types'
export * from '../shared/types/database.types'

// Domain exports
export * from './debts/types/debt.types'
export * from './debts/mappers/debt.mappers'
export * from './expenses/types/expense.types'
export * from './income/types/income.types'
export * from './savings/types/savings.types'
export * from './planning/types/planning.types'
export * from './analytics/types/analytics.types'

// Utilities
export * from '../shared/utils/money.utils'
