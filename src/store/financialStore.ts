import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialData, AIGeneratedPlan, ActionPlan } from '@/types';


interface FinancialStore {
  // Data
  currentStep: number;
  financialData: FinancialData;
  aiPlan: AIGeneratedPlan | null;
  actionPlan: ActionPlan | null;
  
  // States
  isLoading: boolean;
  isOnboardingComplete: boolean;
  error: string | null;
  
  // Onboarding Actions
  setCurrentStep: (step: number) => void;
  updateFinancialData: (data: Partial<FinancialData>) => void;
  
  // API Actions
  generateAIPlan: () => Promise<void>;
  generateActionPlan: () => Promise<void>;
  saveToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  
  // Dashboard Actions
  addExpense: (name: string, amount: number) => void;
  updateGoal: (progress: number) => void;
  
  // Utils
  reset: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
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
};

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      financialData: initialFinancialData,
      aiPlan: null,
      actionPlan: null,
      isLoading: false,
      isOnboardingComplete: false,
      error: null,

      // Onboarding actions
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateFinancialData: (data) => set((state) => ({
        financialData: { ...state.financialData, ...data }
      })),

      // API actions (placeholders for now)
      generateAIPlan: async () => {
        set({ isLoading: true, error: null })
        try {
          // TODO: Implement OpenAI integration
          console.log('Generating AI plan...')
          await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
          
          const mockPlan: AIGeneratedPlan = {
            recommendations: [
              'Crear un fondo de emergencia',
              'Reducir gastos variables en 15%',
              'Pagar deudas de mayor interés primero'
            ],
            monthlyBalance: get().financialData.monthlyIncome - get().financialData.monthlyExpenses,
            savingsSuggestion: 500,
            budgetBreakdown: {
              fixedExpenses: get().financialData.monthlyExpenses * 0.6,
              variableExpenses: get().financialData.monthlyExpenses * 0.4,
              savings: 500,
              emergency: 200
            },
            timeEstimate: '6-12 meses',
            motivationalMessage: '¡Estás en el camino correcto hacia la estabilidad financiera!'
          }
          
          set({ aiPlan: mockPlan })
        } catch (error) {
          set({ error: 'Error generando plan financiero' })
        } finally {
          set({ isLoading: false })
        }
      },

      generateActionPlan: async () => {
        set({ isLoading: true, error: null })
        try {
          // TODO: Implement action plan generation
          console.log('Generating action plan...')
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          const mockActionPlan: ActionPlan = {
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
              },
              {
                id: '2',
                title: 'Abrir cuenta de ahorros',
                description: 'Separa tus ahorros en una cuenta dedicada',
                priority: 'medium',
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                completed: false,
                steps: [
                  'Investigar opciones de cuentas',
                  'Comparar tasas de interés',
                  'Abrir la cuenta'
                ]
              }
            ],
            nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            whatsappReminders: get().financialData.whatsappOptin
          }
          
          set({ actionPlan: mockActionPlan })
        } catch (error) {
          set({ error: 'Error generando plan de acción' })
        } finally {
          set({ isLoading: false })
        }
      },

      saveToSupabase: async () => {
        // TODO: Implement Supabase save
        console.log('Saving to Supabase...', get().financialData)
      },

      loadFromSupabase: async () => {
        // TODO: Implement Supabase load
        console.log('Loading from Supabase...')
      },

      completeOnboarding: async () => {
        set({ isLoading: true, error: null })
        try {
          await get().saveToSupabase()
          set({ isOnboardingComplete: true })
        } catch (error) {
          set({ error: 'Error completando onboarding' })
        } finally {
          set({ isLoading: false })
        }
      },

      // Dashboard actions
      addExpense: (name, amount) => {
        const current = get().financialData;
        const newCategories = { ...current.expenseCategories };
        newCategories[name] = (newCategories[name] || 0) + Number(amount)
        
        set((state) => ({
          financialData: {
            ...state.financialData,
            expenseCategories: newCategories,
            monthlyExpenses: state.financialData.monthlyExpenses + amount
          }
        }));
      },

      updateGoal: (progress) => {
        console.log('Updating goal progress:', progress);
      },

      // Utils
      reset: () => set({
        currentStep: 0,
        financialData: initialFinancialData,
        aiPlan: null,
        actionPlan: null,
        isLoading: false,
        isOnboardingComplete: false,
        error: null
      }),

      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'credipal-financial-store',
      partialize: (state) => ({
        financialData: state.financialData,
        aiPlan: state.aiPlan,
        actionPlan: state.actionPlan,
        isOnboardingComplete: state.isOnboardingComplete
      })
    }
  )
);
