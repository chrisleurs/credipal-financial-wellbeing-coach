
import { StateCreator } from 'zustand'
import { create } from 'zustand'
import { supabase } from '@/integrations/supabase/client'
import type { FinancialData, Debt } from '@/types'

export interface OnboardingSlice {
  // State
  currentStep: number
  financialData: FinancialData
  isOnboardingComplete: boolean
  
  // Actions
  setCurrentStep: (step: number) => void
  updateStep: (stepName: string, data: any) => void
  completeOnboarding: () => void
  resetOnboardingData: () => void
  
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
  financialGoals: []
}

// Debounced save function
let saveTimeout: NodeJS.Timeout | null = null

const debouncedSave = (saveFunction: () => Promise<void>) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  
  saveTimeout = setTimeout(() => {
    saveFunction()
  }, 1000) // 1 second debounce
}

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set, get) => ({
  // Initial state
  currentStep: 0,
  financialData: initialFinancialData,
  isOnboardingComplete: false,

  // Actions
  setCurrentStep: (step) => {
    set({ currentStep: step })
    debouncedSave(get().saveOnboardingProgress)
  },
  
  updateStep: (stepName, data) => {
    console.log(`📝 Updating step: ${stepName}`, data)
    
    switch (stepName) {
      case 'income':
        set((state) => ({
          financialData: { 
            ...state.financialData, 
            monthlyIncome: data.monthly || 0, 
            extraIncome: data.extra || 0 
          }
        }))
        break
        
      case 'expenses':
        set((state) => ({
          financialData: { 
            ...state.financialData, 
            expenseCategories: data.categories || {}, 
            monthlyExpenses: data.total || 0 
          }
        }))
        break
        
      case 'debts':
        set((state) => ({
          financialData: { 
            ...state.financialData, 
            debts: data.debts || [] 
          }
        }))
        break
        
      case 'savings':
        set((state) => ({
          financialData: { 
            ...state.financialData, 
            currentSavings: data.current || 0, 
            monthlySavingsCapacity: data.monthly || 0 
          }
        }))
        break
        
      case 'goals':
        set((state) => ({
          financialData: { 
            ...state.financialData, 
            financialGoals: data.goals || [] 
          }
        }))
        break
        
      case 'financialData':
        set((state) => ({
          financialData: { ...state.financialData, ...data }
        }))
        break
        
      default:
        console.warn(`Unknown step name: ${stepName}`)
        return
    }
    
    // Trigger debounced save
    debouncedSave(get().saveOnboardingProgress)
  },

  completeOnboarding: () => set({ isOnboardingComplete: true }),

  resetOnboardingData: () => {
    console.log('🔄 Resetting onboarding data to initial state')
    
    // Clear any pending saves
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }
    
    set({
      currentStep: 0,
      financialData: { ...initialFinancialData },
      isOnboardingComplete: false
    })
  },

  // Persistence methods
  saveOnboardingProgress: async () => {
    const { currentStep, financialData } = get()
    
    try {
      console.log('💾 Saving onboarding progress...', { currentStep, financialData })
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ No user found, skipping save')
        return
      }

      const financialDataJson = JSON.parse(JSON.stringify(financialData))

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          onboarding_step: currentStep,
          onboarding_data: financialDataJson,
          email: user.email,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null
        })
        
      if (error) {
        console.error('❌ Error saving onboarding progress:', error)
      } else {
        console.log('✅ Onboarding progress saved successfully')
      }
    } catch (error) {
      console.error('❌ Exception saving onboarding progress:', error)
    }
  },

  loadOnboardingProgress: async () => {
    try {
      console.log('📚 Loading onboarding progress...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ No user found, skipping load')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_step, onboarding_data, onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('❌ Error loading onboarding progress:', error)
        return
      }

      if (data) {
        console.log('📖 Loaded onboarding data:', data)
        
        if (data.onboarding_completed) {
          console.log('✅ Onboarding already completed')
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
      } else {
        console.log('📭 No existing onboarding data found')
      }
    } catch (error) {
      console.error('❌ Exception loading onboarding progress:', error)
    }
  }
})

// Create and export the store hook
export const useOnboardingStore = create<OnboardingSlice>()(createOnboardingSlice)
