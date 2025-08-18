
import { AIGeneratedPlan, ActionPlan, ActionTask } from '@/types/unified'

export const generateFinancialPlan = async (userData: any): Promise<AIGeneratedPlan> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))

  return {
    id: `plan_${Date.now()}`,
    recommendations: [
      "Focus on paying off high-interest debt first",
      "Build an emergency fund of 3-6 months expenses",
      "Automate your savings to reach your goals faster"
    ],
    monthlyBalance: userData.monthlyIncome - userData.monthlyExpenses,
    savingsSuggestion: Math.max(0, (userData.monthlyIncome - userData.monthlyExpenses) * 0.2),
    budgetBreakdown: {
      fixedExpenses: userData.monthlyExpenses * 0.6,
      variableExpenses: userData.monthlyExpenses * 0.3,
      savings: userData.monthlyExpenses * 0.1,
      emergency: userData.monthlyExpenses * 0.05
    },
    timeEstimate: "6-12 months to see significant progress",
    motivationalMessage: "You're taking the right steps towards financial freedom!"
  }
}

export const generateActionPlan = async (financialData: any): Promise<ActionPlan> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  const tasks: ActionTask[] = [
    {
      id: `task_${Date.now()}_1`,
      title: "Set up automatic savings transfer",
      description: "Automate $200 monthly transfer to savings account",
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    },
    {
      id: `task_${Date.now()}_2`,
      title: "Review and optimize subscriptions",
      description: "Cancel unused subscriptions to save $50/month",
      priority: 'medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    },
    {
      id: `task_${Date.now()}_3`,
      title: "Research high-yield savings accounts",
      description: "Find better interest rates for emergency fund",
      priority: 'low',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    }
  ]

  return {
    id: `action_plan_${Date.now()}`,
    tasks,
    timeframe: "30 days",
    priority: 'high'
  }
}
