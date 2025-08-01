
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/integrations/supabase/client'
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
  updateFinancialData: (data: Partial<FinancialData>) => void
  updateIncome: (monthly: number, extra: number) => void
  updateExpenses: (categories: Record<string, number>, total: number) => void
  updateDebts: (debts: Debt[]) => void
  updateSavings: (current: number, monthly: number) => void
  updateGoals: (goals: string[]) => void
  setWhatsAppOptIn: (optin: boolean) => void
  completeOnboarding: () => void
  
  // New persistence actions
  saveOnboardingProgress: () => Promise<void>
  loadOnboardingProgress: () => Promise<void>
  
  // Dashboard Actions
  generateAIPlan: () => Promise<void>
  generateActionPlan: () => Promise<void>
  addExpense: (name: string, amount: number) => void
  loadFromSupabase: () => Promise<void>
  
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
      // Initial state - completely fresh after database cleanup
      currentStep: 0,
      financialData: initialFinancialData,
      aiPlan: null,
      actionTasks: [],
      isLoading: false,
      isOnboardingComplete: false,
      error: null,

      // Onboarding actions
      setCurrentStep: (step) => {
        set({ currentStep: step })
        // Auto-save progress when step changes
        const store = get()
        store.saveOnboardingProgress()
      },
      
      updateFinancialData: (data) => {
        set((state) => ({
          financialData: { ...state.financialData, ...data }
        }))
        // Auto-save progress when data changes
        const store = get()
        store.saveOnboardingProgress()
      },
      
      updateIncome: (monthly, extra) => {
        set((state) => ({
          financialData: { ...state.financialData, monthlyIncome: monthly, extraIncome: extra }
        }))
        const store = get()
        store.saveOnboardingProgress()
      },

      updateExpenses: (categories, total) => {
        set((state) => ({
          financialData: { ...state.financialData, expenseCategories: categories, monthlyExpenses: total }
        }))
        const store = get()
        store.saveOnboardingProgress()
      },

      updateDebts: (debts) => {
        set((state) => ({
          financialData: { ...state.financialData, debts }
        }))
        const store = get()
        store.saveOnboardingProgress()
      },

      updateSavings: (current, monthly) => {
        set((state) => ({
          financialData: { ...state.financialData, currentSavings: current, monthlySavingsCapacity: monthly }
        }))
        const store = get()
        store.saveOnboardingProgress()
      },

      updateGoals: (goals) => {
        set((state) => ({
          financialData: { ...state.financialData, financialGoals: goals }
        }))
        const store = get()
        store.saveOnboardingProgress()
      },

      setWhatsAppOptIn: (optin) => {
        set((state) => ({
          financialData: { ...state.financialData, whatsappOptin: optin }
        }))
        const store = get()
        store.saveOnboardingProgress()
      },

      completeOnboarding: () => set({ isOnboardingComplete: true }),

      // Persistence methods - updated for fresh database
      saveOnboardingProgress: async () => {
        const { currentStep, financialData } = get()
        
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          console.log('Saving onboarding progress to clean database:', { currentStep, financialData })

          // Convert FinancialData to a plain object that matches Json type
          const financialDataJson = JSON.parse(JSON.stringify(financialData))

          await supabase
            .from('profiles')
            .upsert({
              user_id: user.id,
              onboarding_step: currentStep,
              onboarding_data: financialDataJson,
              email: user.email,
              first_name: user.user_metadata?.first_name || null,
              last_name: user.user_metadata?.last_name || null
            })

          console.log('Progress saved successfully to clean database')
        } catch (error) {
          console.error('Error saving onboarding progress:', error)
        }
      },

      loadOnboardingProgress: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          console.log('Loading onboarding progress from clean database for user:', user.id)

          const { data, error } = await supabase
            .from('profiles')
            .select('onboarding_step, onboarding_data, onboarding_completed')
            .eq('user_id', user.id)
            .maybeSingle()

          if (error) {
            console.error('Error loading onboarding progress:', error)
            return
          }

          if (data) {
            console.log('Loaded progress from clean database:', data)
            
            // Since database was cleaned, all users start fresh
            if (data.onboarding_completed) {
              console.log('User had completed onboarding before cleanup, resetting to start fresh')
              // Reset to start fresh after cleanup
              set({ 
                currentStep: 0,
                financialData: initialFinancialData,
                isOnboardingComplete: false 
              })
              return
            }

            // Load any existing progress
            if (data.onboarding_step && data.onboarding_step > 0) {
              set({ currentStep: data.onboarding_step })
            }

            // Safely handle onboarding_data 
            if (data.onboarding_data && typeof data.onboarding_data === 'object' && Object.keys(data.onboarding_data).length > 0) {
              const savedData = data.onboarding_data as unknown as Partial<FinancialData>
              set({ financialData: { ...initialFinancialData, ...savedData } })
            }

            console.log('Progress restored successfully from clean database')
          } else {
            console.log('No existing profile found in clean database - user will start fresh')
          }
        } catch (error) {
          console.error('Error loading onboarding progress:', error)
        }
      },

      // Dashboard actions
      generateAIPlan: async () => {
        set({ isLoading: true, error: null })
        try {
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

      generateActionPlan: async () => {
        set({ isLoading: true, error: null })
        try {
          console.log('Generating action plan...')
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

      loadFromSupabase: async () => {
        console.log('Loading from clean Supabase database...')
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

      // Reset to completely clean state
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
