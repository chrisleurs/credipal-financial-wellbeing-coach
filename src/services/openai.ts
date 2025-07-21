import { FinancialData, AIGeneratedPlan, ActionPlan } from '@/types';

export const generateFinancialPlan = async (data: FinancialData): Promise<AIGeneratedPlan> => {
  console.log('Generating financial plan with data:', data);
  
  const totalIncome = data.monthlyIncome + (data.extraIncome || 0);
  const totalExpenses = data.monthlyExpenses;
  const totalDebts = data.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  const monthlyBalance = totalIncome - totalExpenses - totalDebts;

  return {
    recommendations: [
      'Crear un fondo de emergencia',
      'Reducir gastos variables en 15%',
      'Pagar deudas de mayor interés primero'
    ],
    monthlyBalance,
    savingsSuggestion: Math.max(0, monthlyBalance * 0.2),
    budgetBreakdown: {
      fixedExpenses: totalExpenses * 0.6,
      variableExpenses: totalExpenses * 0.4,
      savings: Math.max(0, monthlyBalance * 0.2),
      emergency: totalExpenses * 0.5
    },
    timeEstimate: '6-12 meses',
    motivationalMessage: '¡Estás en el camino correcto hacia la estabilidad financiera!'
  };
};

export const generateActionPlan = async (
  financialPlan: AIGeneratedPlan, 
  userData: FinancialData
): Promise<ActionPlan> => {
  console.log('Generating action plan:', financialPlan, userData);
  
  return {
    tasks: [
      {
        id: '1',
        title: 'Registrar gastos diarios',
        description: 'Anota todos tus gastos durante una semana',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        steps: [
          'Descarga una app de gastos',
          'Anota cada compra',
          'Revisa al final del día'
        ]
      }
    ],
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    whatsappReminders: userData.whatsappOptin
  };
};