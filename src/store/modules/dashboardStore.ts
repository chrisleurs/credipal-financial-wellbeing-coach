
import { StateCreator } from 'zustand'
import type { AIPlan, ActionTask } from '@/types'

export interface DashboardSlice {
  // State
  aiPlan: AIPlan | null
  actionTasks: ActionTask[]
  isLoading: boolean
  error: string | null
  
  // Actions
  generateAIPlan: (financialData: any) => Promise<void>
  generateActionPlan: () => Promise<void>
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const createDashboardSlice: StateCreator<DashboardSlice> = (set, get) => ({
  // Initial state
  aiPlan: null,
  actionTasks: [],
  isLoading: false,
  error: null,

  // Actions
  generateAIPlan: async (financialData) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const balance = financialData.monthlyIncome + financialData.extraIncome - financialData.monthlyExpenses
      
      const mockPlan: AIPlan = {
        id: Date.now().toString(),
        recommendations: [
          'Crea un presupuesto 50/30/20: 50% gastos esenciales, 30% gastos personales, 20% ahorros',
          'Establece un fondo de emergencia equivalente a 3-6 meses de gastos',
          'Paga primero las deudas con mayor tasa de interés',
          'Automatiza tus ahorros para que se transfieran automáticamente',
          'Revisa tus gastos mensuales para identificar áreas de mejora'
        ],
        monthlyBalance: balance,
        savingsSuggestion: Math.max(balance * 0.2, 0),
        budgetBreakdown: {
          fixedExpenses: financialData.monthlyExpenses * 0.6,
          variableExpenses: financialData.monthlyExpenses * 0.4,
          savings: Math.max(balance * 0.2, 0),
          emergency: Math.max(balance * 0.1, 0)
        },
        timeEstimate: '6-12 meses para ver resultados significativos',
        motivationalMessage: '¡Estás en el camino correcto! Con disciplina y estos ajustes, mejorarás tu situación financiera.',
        createdAt: new Date().toISOString()
      }
      
      set({ aiPlan: mockPlan })
    } catch (error) {
      set({ error: 'Error generando tu plan financiero. Intenta nuevamente.' })
    } finally {
      set({ isLoading: false })
    }
  },

  generateActionPlan: async () => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockTasks: ActionTask[] = [
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
      ]
      
      set({ actionTasks: mockTasks })
    } catch (error) {
      set({ error: 'Error generando plan de acción' })
    } finally {
      set({ isLoading: false })
    }
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ isLoading: loading }),

  reset: () => set({
    aiPlan: null,
    actionTasks: [],
    isLoading: false,
    error: null
  })
})
