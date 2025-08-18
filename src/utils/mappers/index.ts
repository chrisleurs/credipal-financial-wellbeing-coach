
/**
 * Mappers Index - Export all domain mappers
 */

export * from './debtMappers'

// Re-export common mapper utilities
export const createId = () => crypto.randomUUID()

export const createTimestamp = () => new Date().toISOString()

export const createDateString = (date?: Date) => 
  (date || new Date()).toISOString().split('T')[0]
