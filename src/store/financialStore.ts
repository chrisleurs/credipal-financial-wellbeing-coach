
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createOnboardingSlice, type OnboardingSlice } from './modules/onboardingStore'
import { createDashboardSlice, type DashboardSlice } from './modules/dashboardStore'

// Combined store interface
interface FinancialStore extends OnboardingSlice, DashboardSlice {
  addExpense: (name: string, amount: number) => void
  loadFromSupabase: () => Promise<void>
}

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get) => ({
      // Combine slices
      ...createOnboardingSlice(set, get),
      ...createDashboardSlice(set, get),

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

      loadFromSupabase: async () => {
        console.log('Loading from Supabase database...')
      }
    }),
    {
      name: 'credipal-financial-store',
    }
  )
)
