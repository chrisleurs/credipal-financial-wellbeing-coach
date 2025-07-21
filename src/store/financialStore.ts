import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiService } from '@/services/api';
import { generateFinancialPlan } from '@/services/openai';
import type { OnboardingData } from '@/types';

interface FinancialData {
  monthlyIncome: number;
  extraIncome: number;
  monthlyExpenses: number;
  expenseCategories: Record<string, number>;
  debts: Array<{
    id: string;
    name: string;
    amount: number;
    monthlyPayment: number;
  }>;
  currentSavings: number;
  monthlySavingsCapacity: number;
  financialGoals: string[];
  whatsappOptin: boolean;
}

interface AIGeneratedPlan {
  recommendations: string[];
  monthlyBalance: number;
  savingsSuggestion: number;
  budgetBreakdown: {
    fixedExpenses: number;
    variableExpenses: number;
    savings: number;
    emergency: number;
  };
  timeEstimate: string;
  motivationalMessage: string;
}

interface ActionPlan {
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    completed: boolean;
    steps: string[];
  }>;
  nextReviewDate: string;
  whatsappReminders: boolean;
}

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
  generateAIPlan: (userId: string) => Promise<void>;
  generateActionPlan: () => Promise<void>;
  saveToSupabase: (userId: string) => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  completeOnboarding: (userId: string) => Promise<void>;
  
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

      // API actions with real Supabase integration
      generateAIPlan: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Generating AI plan...');
          
          // Convert financial data to onboarding format
          const currentData = get().financialData;
          const onboardingData: OnboardingData = {
            income: currentData.monthlyIncome,
            extraIncome: currentData.extraIncome,
            expenses: {
              housing: currentData.expenseCategories.housing || 0,
              food: currentData.expenseCategories.food || 0,
              transport: currentData.expenseCategories.transport || 0,
              entertainment: currentData.expenseCategories.entertainment || 0,
              other: currentData.expenseCategories.other || 0,
            },
            debts: currentData.debts.map(debt => ({
              name: debt.name,
              amount: debt.amount,
              monthlyPayment: debt.monthlyPayment,
              interestRate: 0.15 // Default rate
            })),
            savings: {
              current: currentData.currentSavings,
              monthly: currentData.monthlySavingsCapacity
            },
            goals: currentData.financialGoals.map(goal => ({
              name: goal,
              targetAmount: 10000, // Default amount
              targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              priority: 'medium' as const
            })),
            whatsapp: {
              enabled: currentData.whatsappOptin,
              frequency: 'weekly' as const
            }
          };

          // Generate AI plan using OpenAI service
          const aiResult = await generateFinancialPlan(userId, onboardingData);
          
          const mockPlan: AIGeneratedPlan = {
            recommendations: aiResult.recommendations.map(r => r.recommendation_text),
            monthlyBalance: aiResult.budgetAnalysis.totalIncome - aiResult.budgetAnalysis.totalExpenses,
            savingsSuggestion: aiResult.budgetAnalysis.recommendedSavings,
            budgetBreakdown: {
              fixedExpenses: aiResult.budgetAnalysis.totalExpenses * 0.6,
              variableExpenses: aiResult.budgetAnalysis.totalExpenses * 0.4,
              savings: aiResult.budgetAnalysis.recommendedSavings,
              emergency: aiResult.budgetAnalysis.totalExpenses * 3 // 3 months emergency fund
            },
            timeEstimate: aiResult.riskLevel === 'high' ? '12-18 meses' : '6-12 meses',
            motivationalMessage: `¡Tu puntuación de salud financiera es ${aiResult.financialHealthScore}/100! Estás en el camino correcto.`
          };
          
          set({ aiPlan: mockPlan });
        } catch (error) {
          console.error('Error generating AI plan:', error);
          set({ error: 'Error generando plan financiero' });
        } finally {
          set({ isLoading: false });
        }
      },

      generateActionPlan: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('Generating action plan...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
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
          };
          
          set({ actionPlan: mockActionPlan });
        } catch (error) {
          set({ error: 'Error generando plan de acción' });
        } finally {
          set({ isLoading: false });
        }
      },

      saveToSupabase: async (userId: string) => {
        try {
          console.log('Saving to Supabase...', get().financialData);
          
          // Convert to OnboardingData format for API
          const currentData = get().financialData;
          const onboardingData: OnboardingData = {
            income: currentData.monthlyIncome,
            extraIncome: currentData.extraIncome,
            expenses: {
              housing: currentData.expenseCategories.housing || 0,
              food: currentData.expenseCategories.food || 0,
              transport: currentData.expenseCategories.transport || 0,
              entertainment: currentData.expenseCategories.entertainment || 0,
              other: currentData.expenseCategories.other || 0,
            },
            debts: currentData.debts.map(debt => ({
              name: debt.name,
              amount: debt.amount,
              monthlyPayment: debt.monthlyPayment,
              interestRate: 0.15
            })),
            savings: {
              current: currentData.currentSavings,
              monthly: currentData.monthlySavingsCapacity
            },
            goals: currentData.financialGoals.map(goal => ({
              name: goal,
              targetAmount: 10000,
              targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              priority: 'medium' as const
            })),
            whatsapp: {
              enabled: currentData.whatsappOptin,
              frequency: 'weekly' as const
            }
          };

          await ApiService.saveOnboardingData(userId, onboardingData);
        } catch (error) {
          console.error('Error saving to Supabase:', error);
          throw error;
        }
      },

      loadFromSupabase: async (userId: string) => {
        try {
          console.log('Loading from Supabase...');
          const onboardingData = await ApiService.getOnboardingData(userId);
          
          if (onboardingData) {
            // Convert back to FinancialData format
            const financialData: FinancialData = {
              monthlyIncome: onboardingData.income,
              extraIncome: onboardingData.extraIncome,
              monthlyExpenses: Object.values(onboardingData.expenses).reduce((sum, expense) => sum + expense, 0),
              expenseCategories: onboardingData.expenses,
              debts: onboardingData.debts.map((debt, index) => ({
                id: `debt_${index}`,
                name: debt.name,
                amount: debt.amount,
                monthlyPayment: debt.monthlyPayment
              })),
              currentSavings: onboardingData.savings.current,
              monthlySavingsCapacity: onboardingData.savings.monthly,
              financialGoals: onboardingData.goals.map(goal => goal.name),
              whatsappOptin: onboardingData.whatsapp.enabled
            };

            set({ financialData, isOnboardingComplete: true });
          }
        } catch (error) {
          console.error('Error loading from Supabase:', error);
          throw error;
        }
      },

      completeOnboarding: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          await get().saveToSupabase(userId);
          set({ isOnboardingComplete: true });
        } catch (error) {
          set({ error: 'Error completando onboarding' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Dashboard actions
      addExpense: (name, amount) => {
        const current = get().financialData;
        const newCategories = { ...current.expenseCategories };
        newCategories[name] = (newCategories[name] || 0) + amount;
        
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