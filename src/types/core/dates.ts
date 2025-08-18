
/**
 * Core Date Types - Date handling and recurrence patterns
 */

export type FrequencyType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'

export interface DateRange {
  start: string // ISO date string
  end?: string  // ISO date string
}

export interface RecurrencePattern {
  frequency: FrequencyType
  interval: number // every N frequency units
  dayOfMonth?: number // for monthly recurrence
  dayOfWeek?: number // for weekly recurrence (0-6, Sunday is 0)
  endDate?: string
}

export interface ScheduledDate {
  date: string
  isOverdue: boolean
  daysUntil: number
}

// Utility functions
export const createDateRange = (start: string, end?: string): DateRange => ({
  start,
  end
})

export const isDateInRange = (date: string, range: DateRange): boolean => {
  const checkDate = new Date(date)
  const startDate = new Date(range.start)
  const endDate = range.end ? new Date(range.end) : new Date('9999-12-31')
  
  return checkDate >= startDate && checkDate <= endDate
}

export const calculateNextDate = (lastDate: string, pattern: RecurrencePattern): string => {
  const date = new Date(lastDate)
  
  switch (pattern.frequency) {
    case 'daily':
      date.setDate(date.getDate() + pattern.interval)
      break
    case 'weekly':
      date.setDate(date.getDate() + (pattern.interval * 7))
      break
    case 'biweekly':
      date.setDate(date.getDate() + (pattern.interval * 14))
      break
    case 'monthly':
      date.setMonth(date.getMonth() + pattern.interval)
      if (pattern.dayOfMonth) {
        date.setDate(pattern.dayOfMonth)
      }
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + pattern.interval)
      break
  }
  
  return date.toISOString().split('T')[0]
}
