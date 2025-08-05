import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/integrations/supabase/client'
import type { FinancialData, ActionTask, Debt, AIGeneratedPlan } from '@/types'

interface FinancialPlan {
  id?: string;
  data: AIGeneratedPlan;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

interface FinancialStore {
  // Data
  currentStep: number
  financialData: FinancialData
  actionTasks: ActionTask[]
  
  // Unified Financial Plan state using AIGeneratedPlan
  currentFinancialPlan: FinancialPlan | null
  planGenerationStatus: 'idle' | 'generating' | 'success' | 'error'
  
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
  
  // Persistence actions
  saveOnboardingProgress: () => Promise<void>
  loadOnboardingProgress: () => Promise<void>
  
  // Dashboard Actions
  generateActionPlan: () => Promise<void>
  
  // Financial Plan Actions using unified types
  setCurrentFinancialPlan: (plan: FinancialPlan | null) => void
  setPlanGenerationStatus: (status: 'idle' | 'generating' | 'success' | 'error') => void
  updateGoalProgress: (goalId: string, progress: number) => void
  
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
      // Initial state
      currentStep: 0,
      financialData: initialFinancialData,
      actionTasks: [],
      currentFinancialPlan: null,
      planGenerationStatus: 'idle',
      isLoading: false,
      isOnboardingComplete: false,
      error: null,

      // Onboarding actions
      setCurrentStep: (step) => {
        set({ currentStep: step })
        const store = get()
        store.saveOnboardingProgress()
      },
      
      updateFinancialData: (data) => {
        set((state) => ({
          financialData: { ...state.financialData, ...data }
        }))
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

          console.log('Saving onboarding progress:', { currentStep, financialData })

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

          console.log('Progress saved successfully')
        } catch (error) {
          console.error('Error saving onboarding progress:', error)
        }
      },

      loadOnboardingProgress: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          console.log('Loading onboarding progress for user:', user.id)

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
            console.log('Loaded progress:', data)
            
            if (data.onboarding_completed) {
              console.log('User completed onboarding, resetting to start fresh')
              set({ 
                currentStep: 0,
                financialData: initialFinancialData,
                isOnboardingComplete: false 
              })
              return
            }

            if (data.onboarding_step && data.onboarding_step > 0) {
              set({ currentStep: data.onboarding_step })
            }

            if (data.onboarding_data && typeof data.onboarding_data === 'object' && Object.keys(data.onboarding_data).length > 0) {
              const savedData = data.onboarding_data as unknown as Partial<FinancialData>
              set({ financialData: { ...initialFinancialData, ...savedData } })
            }

            console.log('Progress restored successfully')
          } else {
            console.log('No existing profile found - user will start fresh')
          }
        } catch (error) {
          console.error('Error loading onboarding progress:', error)
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

      setCurrentFinancialPlan: (plan) => set({ currentFinancialPlan: plan }),
      
      setPlanGenerationStatus: (status) => set({ planGenerationStatus: status }),
      
      updateGoalProgress: (goalId, progress) => {
        set((state) => {
          if (!state.currentFinancialPlan) return state;
          
          // Update goal progress in all goal arrays
          const updateGoals = (goals: any[]) => 
            goals.map(goal => 
              goal.id === goalId ? { ...goal, progress, currentAmount: goal.targetAmount * (progress / 100) } : goal
            );
          
          const updatedPlan = {
            ...state.currentFinancialPlan,
            data: {
              ...state.currentFinancialPlan.data,
              shortTermGoals: updateGoals(state.currentFinancialPlan.data.shortTermGoals),
              mediumTermGoals: updateGoals(state.currentFinancialPlan.data.mediumTermGoals),
              longTermGoals: updateGoals(state.currentFinancialPlan.data.longTermGoals)
            }
          };
          
          return { currentFinancialPlan: updatedPlan };
        });
      },

      loadFromSupabase: async () => {
        console.log('Loading from Supabase database...')
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
        actionTasks: [],
        currentFinancialPlan: null,
        planGenerationStatus: 'idle',
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
