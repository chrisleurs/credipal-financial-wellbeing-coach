
import { useOptimizedFinancialData } from './useOptimizedFinancialData'

export const useCleanFinancialDashboard = () => {
  const { data: financialData, isLoading } = useOptimizedFinancialData()

  if (isLoading) {
    return { isLoading: true, isEmpty: false, summary: {}, quickStats: {}, recentActivity: {} }
  }

  if (!financialData || !financialData.hasRealData) {
    return { isLoading: false, isEmpty: true, summary: {}, quickStats: {}, recentActivity: {} }
  }

  return {
    isLoading: false,
    isEmpty: false,
    summary: {
      monthlyIncome: financialData.monthlyIncome,
      monthlyExpenses: financialData.monthlyExpenses,
      currentSavings: financialData.currentSavings,
      savingsCapacity: financialData.savingsCapacity,
      lastUpdated: financialData.lastCalculated
    },
    quickStats: {
      expensesThisMonth: financialData.monthlyExpenses,
      debtPaymentsThisMonth: financialData.totalMonthlyDebtPayments,
      savingsThisMonth: financialData.savingsCapacity,
      goalCompletionRate: financialData.activeGoals.length > 0 
        ? (financialData.totalGoalsCurrent / financialData.totalGoalsTarget) * 100 
        : 0
    },
    recentActivity: {
      latestExpenses: Object.entries(financialData.expenseCategories).map(([category, amount], index) => ({
        id: `expense-${index}`,
        category,
        amount: amount as number,
        date: new Date().toLocaleDateString('es-MX')
      })),
      upcomingPayments: financialData.activeDebts.map((debt, index) => ({
        id: `payment-${index}`,
        creditor: debt.creditor,
        amount: debt.payment,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX')
      })),
      activeGoals: financialData.activeGoals.map((goal, index) => ({
        id: `goal-${index}`,
        title: goal.title,
        progress: goal.progress
      }))
    }
  }
}
