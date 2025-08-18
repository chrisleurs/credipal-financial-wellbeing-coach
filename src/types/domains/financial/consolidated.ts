
/**
 * Consolidated Financial Data - Single source of truth
 */

import { Money } from '../../core/money'
import { IncomeSource, IncomeSummary } from '../income/income'
import { Expense, ExpensesByCategory, ExpenseSummary } from '../expenses/expense'
import { Debt, DebtSummary } from '../debts/debt'
import { FinancialGoal, GoalsSummary } from '../goals/goal'
import { AIFinancialPlan } from '../plans/plan'

export interface ConsolidatedFinancialData {
  // Core financial data
  income: {
    monthly: Money
    sources: IncomeSource[]
    summary: IncomeSummary
  }
  
  expenses: {
    monthly: Money
    byCategory: ExpensesByCategory
    recent: Expense[]
    summary: ExpenseSummary
  }
  
  debts: {
    total: Money
    monthlyPayments: Money
    list: Debt[]
    summary: DebtSummary
  }
  
  goals: {
    savings: Money
    targets: FinancialGoal[]
    summary: GoalsSummary
  }
  
  // Calculated summaries
  summary: {
    availableBalance: Money
    savingsCapacity: Money
    debtToIncomeRatio: number
    savingsRate: number
    emergencyFundMonths: number
    netWorth: Money
  }
  
  // Metadata
  lastCalculated: string
  dataCompleteness: number
  hasRealData: boolean
}

export interface FinancialMetrics {
  // Income metrics
  monthlyIncome: Money
  annualIncome: Money
  incomeGrowthRate: number
  
  // Expense metrics
  monthlyExpenses: Money
  expenseRatio: number // expenses / income
  largestExpenseCategory: string
  
  // Debt metrics
  totalDebt: Money
  monthlyDebtPayments: Money
  debtToIncomeRatio: number
  averageInterestRate: number
  debtPayoffProjection: string
  
  // Savings metrics
  monthlySavings: Money
  savingsRate: number
  emergencyFundRatio: number
  
  // Overall health
  financialHealthScore: number // 0-100
  creditUtilization: number
  liquidityRatio: number
}

export interface FinancialSnapshot {
  data: ConsolidatedFinancialData
  metrics: FinancialMetrics
  timestamp: string
  userId: string
}

// Utility function to calculate financial health
export const calculateFinancialHealth = (data: ConsolidatedFinancialData): number => {
  let score = 0
  
  // Income stability (20 points)
  if (data.income.monthly.amount > 0) score += 20
  
  // Expense control (20 points)
  const expenseRatio = data.expenses.monthly.amount / data.income.monthly.amount
  if (expenseRatio < 0.5) score += 20
  else if (expenseRatio < 0.7) score += 15
  else if (expenseRatio < 0.9) score += 10
  
  // Debt management (25 points)
  const debtRatio = data.summary.debtToIncomeRatio
  if (debtRatio === 0) score += 25
  else if (debtRatio < 0.2) score += 20
  else if (debtRatio < 0.4) score += 15
  else if (debtRatio < 0.6) score += 10
  
  // Savings rate (25 points)
  if (data.summary.savingsRate > 0.2) score += 25
  else if (data.summary.savingsRate > 0.1) score += 20
  else if (data.summary.savingsRate > 0.05) score += 15
  else if (data.summary.savingsRate > 0) score += 10
  
  // Emergency fund (10 points)
  if (data.summary.emergencyFundMonths >= 6) score += 10
  else if (data.summary.emergencyFundMonths >= 3) score += 7
  else if (data.summary.emergencyFundMonths >= 1) score += 5
  
  return Math.min(100, Math.max(0, score))
}
