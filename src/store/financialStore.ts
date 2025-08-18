
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createOnboardingSlice, type OnboardingSlice } from './modules/onboardingStore'
import { createDashboardSlice, type DashboardSlice } from './modules/dashboardStore'

// Combined store interface
interface FinancialStore extends OnboardingSlice, DashboardSlice {
  addExpense: (name: string, amount: number) => void
  loadFromSupabase: () => Promise<void>
  reset: () => void
}

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get, api) => ({
      // Combine slices with proper arguments
      ...createOnboardingSlice(set, get, api),
      ...createDashboardSlice(set, get, api),

      // Additional actions
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

      reset: () => {
        set({
          financialData: {
            monthlyIncome: 0,
            extraIncome: 0,
            monthlyExpenses: 0,
            currentSavings: 0,
            debts: [],
            financialGoals: [],
            expenseCategories: {},
            whatsappNumber: '',
            monthlySavingsCapacity: 0,
            whatsappOptin: false
          },
          currentStep: 0,
          isOnboardingComplete: false,
          aiPlan: null,
          isLoading: false,
          error: null
        })
      },

      loadFromSupabase: async () => {
        console.log('Loading from Supabase database...')
      }
    }),
    {
      name: 'credipal-financial-store',
    }
  )
)
