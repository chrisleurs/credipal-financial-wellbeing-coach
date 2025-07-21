
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FinancialData, AIPlan, ActionTask, Debt } from '@/types'

interface FinancialStore {
  // Data
  currentStep: number
  financialData: FinancialData
  aiPlan: AIPlan | null
  actionTasks: ActionTask[]
  
  // States
  isLoading: boolean
  isOnboardingComplete: boolean
  error: string | null
  
  // Onboarding Actions
  setCurrentStep: (step: number) => void
  updateIncome: (monthly: number, extra: number) => void
  updateExpenses: (categories: Record<string, number>, total: number) => void
  updateDebts: (debts: Debt[]) => void
  updateSavings: (current: number, monthly: number) => void
  updateGoals: (goals: string[]) => void
  setWhatsAppOptIn: (optin: boolean) => void
  completeOnboarding: () => void
  
  // Dashboard Actions
  generateAIPlan: () => Promise<void>
  generateActionTasks: () => Promise<void>
  addExpense: (name: string, amount: number) => void
  
  // Utils
  reset: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

const initialFinancialData: FinancialData = {
  monthlyIncome: 0,
  extraIncome: 0,
  monthlyExpenses: 0,
  expenseCategories: {},
  debts: [],
  currentSavings: 0,
  monthlySavingsCapacity: 0,
  financialGoals: [],
  whatsappOptin: false
}

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      financialData: initialFinancialData,
      aiPlan: null,
      actionTasks: [],
      isLoading: false,
      isOnboardingComplete: false,
      error: null,

      // Onboarding actions
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateIncome: (monthly, extra) => set((state) => ({
        financialData: { ...state.financialData, monthlyIncome: monthly, extraIncome: extra }
      })),

      updateExpenses: (categories, total) => set((state) => ({
        financialData: { ...state.financialData, expenseCategories: categories, monthlyExpenses: total }
      })),

      updateDebts: (debts) => set((state) => ({
        financialData: { ...state.financialData, debts }
      })),

      updateSavings: (current, monthly) => set((state) => ({
        financialData: { ...state.financialData, currentSavings: current, monthlySavingsCapacity: monthly }
      })),

      updateGoals: (goals) => set((state) => ({
        financialData: { ...state.financialData, financialGoals: goals }
      })),

      setWhatsAppOptIn: (optin) => set((state) => ({
        financialData: { ...state.financialData, whatsappOptin: optin }
      })),

      completeOnboarding: () => set({ isOnboardingComplete: true }),

      // Dashboard actions
      generateAIPlan: async () => {
        set({ isLoading: true, error: null })
        try {
          // Simulate OpenAI call
          await new Promise(resolve => setTimeout(resolve, 3000))
          
          const { financialData } = get()
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

      generateActionTasks: async () => {
        set({ isLoading: true, error: null })
        try {
          console.log('Generating action tasks...')
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
          set({ error: 'Error generando tareas' })
        } finally {
          set({ isLoading: false })
        }
      },

      addExpense: (name, amount) => {
        const current = get().financialData
        const newCategories = { ...current.expenseCategories }
        newCategories[name] = (newCategories[name] || 0) + amount
        
        set((state) => ({
          financialData: {
            ...state.financialData,
            expenseCategories: newCategories,
            monthlyExpenses: state.financialData.monthlyExpenses + amount
          }
        }))
      },

      // Utils
      reset: () => set({
        currentStep: 0,
        financialData: initialFinancialData,
        aiPlan: null,
        actionTasks: [],
        isLoading: false,
        isOnboardingComplete: false,
        error: null
      }),

      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'credipal-financial-store',
    }
  )
)
