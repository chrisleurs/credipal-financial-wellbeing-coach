
import { useSimplifiedFinancialData } from './useSimplifiedFinancialData'
import { useIncomes } from '@/domains/income/hooks/useIncomes'
import { useExpenses } from '@/domains/expenses/hooks/useExpenses'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { useGoals } from '@/domains/savings/hooks/useGoals'
import { useMemo } from 'react'

export interface CleanDashboardData {
  // Summary data (always up-to-date via triggers)
  summary: {
    monthlyIncome: number
    monthlyExpenses: number
    totalDebt: number
    emergencyFund: number
    savingsCapacity: number
    lastUpdated: string | null
  }
  
  // Recent activity (for dashboard cards)
  recentActivity: {
    latestExpenses: Array<{ id: string; amount: number; category: string; date: string }>
    upcomingPayments: Array<{ id: string; creditor: string; amount: number; dueDate: string }>
    activeGoals: Array<{ id: string; title: string; progress: number; targetAmount: number }>
  }
  
  // Quick stats
  quickStats: {
    expensesThisMonth: number
    debtPaymentsThisMonth: number
    savingsThisMonth: number
    goalCompletionRate: number
  }
  
  // Status
  isLoading: boolean
  hasError: boolean
  isEmpty: boolean
}

export const useCleanFinancialDashboard = () => {
  const { data: summaryData, isLoading: summaryLoading } = useSimplifiedFinancialData()
  const { expenses, isLoading: expensesLoading } = useExpenses()
  const { debts, isLoading: debtsLoading } = useDebts()
  const { activeGoals, isLoading: goalsLoading } = useGoals()

  const dashboardData = useMemo((): CleanDashboardData => {
    const isLoading = summaryLoading || expensesLoading || debtsLoading || goalsLoading
    
    if (isLoading || !summaryData) {
      return {
        summary: {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          totalDebt: 0,
          emergencyFund: 0,
          savingsCapacity: 0,
          lastUpdated: null
        },
        recentActivity: {
          latestExpenses: [],
          upcomingPayments: [],
          activeGoals: []
        },
        quickStats: {
          expensesThisMonth: 0,
          debtPaymentsThisMonth: 0,
          savingsThisMonth: 0,
          goalCompletionRate: 0
        },
        isLoading,
        hasError: false,
        isEmpty: true
      }
    }

    // Get current month expenses
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const thisMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    // Latest 5 expenses
    const latestExpenses = expenses
      .slice(0, 5)
      .map(expense => ({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        date: expense.date
      }))

    // Upcoming debt payments (next 30 days)
    const upcomingPayments = debts
      .filter(debt => debt.status === 'active')
      .map(debt => ({
        id: debt.id,
        creditor: debt.creditor,
        amount: debt.monthly_payment,
        dueDate: debt.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
      .slice(0, 3)

    // Active goals with progress
    const activeGoalsData = activeGoals.map(goal => ({
      id: goal.id,
      title: goal.title,
      progress: goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0,
      targetAmount: goal.target_amount
    }))

    // Calculate quick stats
    const expensesThisMonth = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const goalCompletionRate = activeGoals.length > 0 
      ? activeGoals.filter(goal => (goal.current_amount / goal.target_amount) >= 1).length / activeGoals.length * 100
      : 0

    return {
      summary: {
        monthlyIncome: summaryData.monthlyIncome,
        monthlyExpenses: summaryData.monthlyExpenses,
        totalDebt: summaryData.totalDebt,
        emergencyFund: summaryData.emergencyFund,
        savingsCapacity: summaryData.savingsCapacity,
        lastUpdated: summaryData.lastUpdated
      },
      recentActivity: {
        latestExpenses,
        upcomingPayments,
        activeGoals: activeGoalsData
      },
      quickStats: {
        expensesThisMonth,
        debtPaymentsThisMonth: summaryData.monthlyDebtPayments,
        savingsThisMonth: Math.max(0, summaryData.savingsCapacity),
        goalCompletionRate
      },
      isLoading: false,
      hasError: false,
      isEmpty: !summaryData.hasData
    }
  }, [summaryData, expenses, debts, activeGoals, summaryLoading, expensesLoading, debtsLoading, goalsLoading])

  return dashboardData
}
