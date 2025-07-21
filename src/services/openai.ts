
import type { FinancialData, AIGeneratedPlan, ActionPlan } from '@/types'

// Mock OpenAI service for demonstration
export async function generateFinancialPlan(data: FinancialData): Promise<AIGeneratedPlan> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const monthlyBalance = data.monthlyIncome + data.extraIncome - data.monthlyExpenses
  
  return {
    recommendations: [
      'Crea un presupuesto 50/30/20: 50% gastos esenciales, 30% gastos personales, 20% ahorros',
      'Establece un fondo de emergencia equivalente a 3-6 meses de gastos',
      'Paga primero las deudas con mayor tasa de interés',
      'Automatiza tus ahorros para que se transfieran automáticamente'
    ],
    monthlyBalance,
    savingsSuggestion: Math.max(monthlyBalance * 0.2, 0),
    budgetBreakdown: {
      fixedExpenses: data.monthlyExpenses * 0.6,
      variableExpenses: data.monthlyExpenses * 0.4,
      savings: Math.max(monthlyBalance * 0.2, 0),
      emergency: Math.max(monthlyBalance * 0.1, 0)
    },
    timeEstimate: '6-12 meses para ver resultados significativos',
    motivationalMessage: '¡Estás en el camino correcto! Con disciplina y estos ajustes, mejorarás tu situación financiera.'
  }
}

export async function generateActionPlan(data: FinancialData): Promise<ActionPlan> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    tasks: [
      {
        id: '1',
        title: 'Registrar gastos diarios',
        description: 'Anota todos tus gastos durante una semana',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false
      },
      {
        id: '2',
        title: 'Abrir cuenta de ahorros',
        description: 'Separa tus ahorros en una cuenta dedicada',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false
      }
    ],
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    whatsappReminders: data.whatsappOptin
  }
}
