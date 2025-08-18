
import { StateCreator } from 'zustand'
import { supabase } from '@/integrations/supabase/client'
import type { FinancialData, OnboardingDebt } from '@/types/unified'

export interface OnboardingSlice {
  // State
  currentStep: number
  financialData: FinancialData
  isOnboardingComplete: boolean
  
  // Actions
  setCurrentStep: (step: number) => void
  updateFinancialData: (data: Partial<FinancialData>) => void
  updateIncome: (monthly: number, extra: number) => void
  updateExpenses: (categories: Record<string, number>, total: number) => void
  updateDebts: (debts: OnboardingDebt[]) => void
  updateSavings: (current: number, monthly: number) => void
  updateGoals: (goals: string[]) => void
  setWhatsAppOptIn: (optin: boolean) => void
  completeOnboarding: () => void
  
  // Persistence
  saveOnboardingProgress: () => Promise<void>
  loadOnboardingProgress: () => Promise<void>
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

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set, get) => ({
  // Initial state
  currentStep: 0,
  financialData: initialFinancialData,
  isOnboardingComplete: false,

  // Actions
  setCurrentStep: (step) => {
    set({ currentStep: step })
    get().saveOnboardingProgress()
  },
  
  updateFinancialData: (data) => {
    set((state) => ({
      financialData: { ...state.financialData, ...data }
    }))
    get().saveOnboardingProgress()
  },
  
  updateIncome: (monthly, extra) => {
    set((state) => ({
      financialData: { ...state.financialData, monthlyIncome: monthly, extraIncome: extra }
    }))
    get().saveOnboardingProgress()
  },

  updateExpenses: (categories, total) => {
    set((state) => ({
      financialData: { ...state.financialData, expenseCategories: categories, monthlyExpenses: total }
    }))
    get().saveOnboardingProgress()
  },

  updateDebts: (debts) => {
    set((state) => ({
      financialData: { ...state.financialData, debts }
    }))
    get().saveOnboardingProgress()
  },

  updateSavings: (current, monthly) => {
    set((state) => ({
      financialData: { ...state.financialData, currentSavings: current, monthlySavingsCapacity: monthly }
    }))
    get().saveOnboardingProgress()
  },

  updateGoals: (goals) => {
    set((state) => ({
      financialData: { ...state.financialData, financialGoals: goals }
    }))
    get().saveOnboardingProgress()
  },

  setWhatsAppOptIn: (optin) => {
    set((state) => ({
      financialData: { ...state.financialData, whatsappOptin: optin }
    }))
    get().saveOnboardingProgress()
  },

  completeOnboarding: () => set({ isOnboardingComplete: true }),

  // Persistence methods
  saveOnboardingProgress: async () => {
    const { currentStep, financialData } = get()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
    } catch (error) {
      console.error('Error saving onboarding progress:', error)
    }
  },

  loadOnboardingProgress: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
        if (data.onboarding_completed) {
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
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error)
    }
  }
})
