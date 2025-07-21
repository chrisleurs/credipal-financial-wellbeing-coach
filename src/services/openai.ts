import type { OnboardingData, AIRecommendation, ActionPlan } from '@/types';

// Note: OpenAI API integration would require a secret key
// For now, this simulates the AI responses with realistic data

export interface AIAnalysisResult {
  recommendations: AIRecommendation[];
  actionPlan: ActionPlan;
  budgetAnalysis: {
    totalIncome: number;
    totalExpenses: number;
    recommendedSavings: number;
    debtToIncomeRatio: number;
    emergencyFundMonths: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  financialHealthScore: number;
}

// Simulated AI analysis function
export const generateFinancialPlan = async (
  userId: string,
  onboardingData: OnboardingData
): Promise<AIAnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const totalIncome = onboardingData.income + onboardingData.extraIncome;
  const totalExpenses = Object.values(onboardingData.expenses).reduce((sum, expense) => sum + expense, 0);
  const totalDebt = onboardingData.debts.reduce((sum, debt) => sum + debt.amount, 0);
  const monthlyDebtPayments = onboardingData.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  
  const monthlyBalance = totalIncome - totalExpenses - monthlyDebtPayments;
  const debtToIncomeRatio = (monthlyDebtPayments / totalIncome) * 100;
  const emergencyFundMonths = onboardingData.savings.current / totalExpenses;

  // Calculate financial health score
  let healthScore = 100;
  if (debtToIncomeRatio > 36) healthScore -= 30;
  if (monthlyBalance < totalIncome * 0.1) healthScore -= 25;
  if (emergencyFundMonths < 3) healthScore -= 20;
  if (onboardingData.savings.monthly < totalIncome * 0.1) healthScore -= 15;

  healthScore = Math.max(0, healthScore);

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (healthScore < 40) riskLevel = 'high';
  else if (healthScore < 70) riskLevel = 'medium';

  // Generate recommendations
  const recommendations: AIRecommendation[] = [];
  
  if (emergencyFundMonths < 6) {
    recommendations.push({
      user_id: userId,
      recommendation_text: `Tu fondo de emergencia cubre solo ${emergencyFundMonths.toFixed(1)} meses de gastos. Te recomiendo aumentarlo a 6 meses (${(totalExpenses * 6).toLocaleString()} MXN).`,
      recommendation_type: 'emergency_fund',
      priority: emergencyFundMonths < 3 ? 1 : 2,
      is_implemented: false
    });
  }

  if (debtToIncomeRatio > 28) {
    recommendations.push({
      user_id: userId,
      recommendation_text: `Tu ratio de deuda-ingresos es del ${debtToIncomeRatio.toFixed(1)}%. Considera la estrategia de "bola de nieve" para pagar deudas más rápido.`,
      recommendation_type: 'debt_management',
      priority: 1,
      is_implemented: false
    });
  }

  if (onboardingData.savings.monthly < totalIncome * 0.2) {
    const recommendedSavings = totalIncome * 0.2;
    recommendations.push({
      user_id: userId,
      recommendation_text: `Intenta ahorrar al menos el 20% de tus ingresos (${recommendedSavings.toLocaleString()} MXN mensuales) para mejorar tu estabilidad financiera.`,
      recommendation_type: 'savings_increase',
      priority: 2,
      is_implemented: false
    });
  }

  // Check for high expense categories
  const expenseThresholds = {
    housing: 0.30,
    food: 0.15,
    transport: 0.15,
    entertainment: 0.10
  };

  Object.entries(expenseThresholds).forEach(([category, threshold]) => {
    const categoryExpense = onboardingData.expenses[category as keyof typeof onboardingData.expenses] || 0;
    const percentage = categoryExpense / totalIncome;
    
    if (percentage > threshold) {
      recommendations.push({
        user_id: userId,
        recommendation_text: `Tus gastos en ${category} representan el ${(percentage * 100).toFixed(1)}% de tus ingresos. Considera reducirlos al ${(threshold * 100)}% máximo.`,
        recommendation_type: 'expense_optimization',
        priority: 3,
        is_implemented: false
      });
    }
  });

  // Generate action plan
  const actions = [
    {
      id: 'action_1',
      title: 'Revisar y categorizar gastos',
      description: 'Analiza tus gastos de los últimos 3 meses para identificar áreas de optimización',
      category: 'budgeting',
      priority: 'high' as const,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      id: 'action_2',
      title: 'Automatizar ahorros',
      description: 'Configura una transferencia automática a tu cuenta de ahorros cada mes',
      category: 'savings',
      priority: 'high' as const,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  ];

  if (emergencyFundMonths < 6) {
    actions.push({
      id: 'action_emergency',
      title: 'Construir fondo de emergencia',
      description: `Ahorra ${((totalExpenses * 6 - onboardingData.savings.current) / 12).toLocaleString()} MXN mensuales para completar tu fondo de emergencia en un año`,
      category: 'emergency_fund',
      priority: 'high' as const,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  if (onboardingData.debts.length > 0) {
    actions.push({
      id: 'action_debt',
      title: 'Estrategia de pago de deudas',
      description: 'Implementa la estrategia de avalancha de deudas, pagando primero las de mayor interés',
      category: 'debt_management',
      priority: 'high' as const,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  const actionPlan: ActionPlan = {
    user_id: userId,
    actions,
    whatsapp_reminders: onboardingData.whatsapp.enabled,
    next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active'
  };

  return {
    recommendations,
    actionPlan,
    budgetAnalysis: {
      totalIncome,
      totalExpenses: totalExpenses + monthlyDebtPayments,
      recommendedSavings: Math.max(totalIncome * 0.2, 2000),
      debtToIncomeRatio,
      emergencyFundMonths
    },
    riskLevel,
    financialHealthScore: healthScore
  };
};

// Function to get AI chat response (would integrate with OpenAI API)
export const getChatResponse = async (message: string, context: any = {}): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulated responses based on common financial questions
  const responses = [
    "Te recomiendo revisar tu presupuesto mensual y identificar gastos que puedas reducir.",
    "Una buena estrategia es automatizar tus ahorros el mismo día que recibes tu salario.",
    "Considera crear un fondo de emergencia que cubra 6 meses de gastos básicos.",
    "Para pagar deudas más rápido, usa la estrategia de avalancha: paga primero las de mayor interés.",
    "Diversificar tus ingresos puede ayudarte a mejorar tu situación financiera."
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};