
/**
 * Coach Types Index - Exports centralizados
 */

export * from './financialCoach'

// Re-exports para compatibilidad con tipos existentes
export type { AIGeneratedFinancialPlan } from '../aiPlan'
export type { ConsolidatedFinancialData } from '../../hooks/useConsolidatedFinancialData'
export type { OptimizedFinancialData } from '../../hooks/useOptimizedFinancialData'
