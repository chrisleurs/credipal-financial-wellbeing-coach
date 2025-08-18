
/**
 * Store Types - Tipos para el estado global de la aplicación
 */

import { Money } from '../../shared/types/core.types'

export interface FinancialData {
  monthlyIncome: number
  extraIncome: number
  monthlyExpenses: number
  currentSavings: number
  monthlySavingsCapacity: number
  whatsappOptin: boolean
  debts: OnboardingDebt[]
  financialGoals: string[]
  expenseCategories: Record<string, number>
}

export interface OnboardingDebt {
  id: string
  name: string
  amount: number
  monthlyPayment: number
  paymentDueDate?: number
  termInMonths?: number
  estimatedPayoffDate?: string
}
