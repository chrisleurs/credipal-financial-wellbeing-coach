
// Mock OpenAI service for demonstration
import { AIGeneratedPlan, ActionPlan, ActionTask } from '@/types/unified'

export const generateFinancialPlan = async (financialData: any): Promise<AIGeneratedPlan> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    id: 'plan-' + Date.now(),
    recommendations: [
      'Reduce gastos discrecionales en un 15%',
      'Incrementa tu fondo de emergencia',
      'Considera consolidar deudas de alto interés'
    ],
    projectedSavings: financialData.monthlySavingsCapacity * 12,
    timeline: '12 meses'
  }
}

export const generateActionPlan = async (financialData: any): Promise<ActionPlan> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const tasks: ActionTask[] = [
    {
      id: 'task-1',
      title: 'Revisar gastos mensuales',
      description: 'Analizar gastos de entretenimiento y encontrar áreas de reducción',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task-2',
      title: 'Establecer fondo de emergencia',
      description: 'Ahorrar $5,000 para emergencias',
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task-3',
      title: 'Pago extra de deuda',
      description: 'Hacer un pago adicional de $500 a la tarjeta de crédito',
      status: 'pending',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  return {
    id: 'action-plan-' + Date.now(),
    tasks,
    timeline: '6 meses'
  }
}
