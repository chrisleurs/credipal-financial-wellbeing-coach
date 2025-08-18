
/**
 * Core Types - Tipos base compartidos en toda la aplicación
 */

export type Currency = 'MXN' | 'USD'

export interface Money {
  amount: number
  currency: Currency
}

export interface MoneyRange {
  min: Money
  max: Money
}

export type Status = 'active' | 'inactive' | 'completed'
export type Priority = 'high' | 'medium' | 'low'

// Date types
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

// Utility functions for Money operations
export const createMoney = (amount: number, currency: Currency = 'MXN'): Money => ({
  amount,
  currency
})

export const addMoney = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) {
    throw new Error('Cannot add money with different currencies')
  }
  return { amount: a.amount + b.amount, currency: a.currency }
}

export const subtractMoney = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) {
    throw new Error('Cannot subtract money with different currencies')
  }
  return { amount: a.amount - b.amount, currency: a.currency }
}

export const multiplyMoney = (money: Money, factor: number): Money => ({
  amount: money.amount * factor,
  currency: money.currency
})

export const formatMoney = (money: Money): string => {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
  return formatter.format(money.amount)
}
