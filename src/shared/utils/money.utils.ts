
/**
 * Money Utilities - Funciones de utilidad para operaciones monetarias
 */

import { Money } from '../types/core.types'

export const compareMoney = (a: Money, b: Money | number): number => {
  const amountB = typeof b === 'number' ? b : b.amount
  if (a.amount > amountB) return 1
  if (a.amount < amountB) return -1
  return 0
}

export const isGreaterThanOrEqual = (money: Money, amount: number): boolean => {
  return money.amount >= amount
}

export const isLessThan = (money: Money, amount: number): boolean => {
  return money.amount < amount
}

export const convertToNumber = (money: Money): number => {
  return money.amount
}
