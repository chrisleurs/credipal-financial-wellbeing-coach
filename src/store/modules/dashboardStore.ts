
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AIFinancialPlan, ActionItem } from '@/types'

interface DashboardState {
  // AI Plan state
  aiPlan: AIFinancialPlan | null
  isGeneratingPlan: boolean
  planError: string | null
  
  // Action items state  
  actionItems: ActionItem[]
  isLoadingActions: boolean
  
  // UI state
  selectedTimeframe: 'week' | 'month' | 'quarter' | 'year'
  showAIPanel: boolean
  
  // Actions
  setAIPlan: (plan: AIFinancialPlan | null) => void
  setIsGeneratingPlan: (loading: boolean) => void
  setPlanError: (error: string | null) => void
  setActionItems: (items: ActionItem[]) => void
  setIsLoadingActions: (loading: boolean) => void
  setSelectedTimeframe: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void
  setShowAIPanel: (show: boolean) => void
  completeActionItem: (id: string) => void
  addActionItem: (item: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      aiPlan: {
        id: 'default',
        userId: 'demo',
        planType: 'comprehensive',
        status: 'active',  
        title: 'Plan Financiero Personalizado',
        description: 'Tu roadmap hacia la libertad financiera',
        motivationalMessage: '¡Estás en el camino correcto! Cada pequeño paso cuenta hacia tu libertad financiera.',
        recommendations: [
          'Reduce gastos en entretenimiento en un 15%',
          'Considera aumentar tu pago mínimo de deudas',
          'Establece un fondo de emergencia de $10,000'
        ],
        currentBalance: { amount: 2500, currency: 'MXN' },
        monthlyBalance: { amount: 2500, currency: 'MXN' },
        projectedSavings: { amount: 30000, currency: 'MXN' },
        savingsSuggestion: 'Podrías ahorrar $500 más al mes optimizando gastos',
        timelineMonths: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      isGeneratingPlan: false,
      planError: null,
      actionItems: [
        {
          id: '1',
          planId: 'default',
          userId: 'demo',
          title: 'Reducir gastos en entretenimiento',
          description: 'Disminuir gastos en entretenimiento en 15% este mes',
          category: 'expense',
          priority: 'high',
          status: 'pending',
          targetAmount: { amount: 300, currency: 'MXN' },
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2', 
          planId: 'default',
          userId: 'demo',
          title: 'Pago extra de deuda',
          description: 'Hacer un pago adicional de $500 a la tarjeta de crédito',
          category: 'debt',
          priority: 'medium',
          status: 'pending',
          targetAmount: { amount: 500, currency: 'MXN' },
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      isLoadingActions: false,
      selectedTimeframe: 'month',
      showAIPanel: true,

      // Actions
      setAIPlan: (plan) => set({ aiPlan: plan }),
      setIsGeneratingPlan: (loading) => set({ isGeneratingPlan: loading }),
      setPlanError: (error) => set({ planError: error }),
      setActionItems: (items) => set({ actionItems: items }),
      setIsLoadingActions: (loading) => set({ isLoadingActions: loading }),
      setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
      setShowAIPanel: (show) => set({ showAIPanel: show }),
      
      completeActionItem: (id: string) => {
        const items = get().actionItems.map(item => 
          item.id === id 
            ? { 
                ...item, 
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : item
        )
        set({ actionItems: items })
      },
      
      addActionItem: (newItem) => {
        const item: ActionItem = {
          ...newItem,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        set({ actionItems: [...get().actionItems, item] })
      }
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        selectedTimeframe: state.selectedTimeframe,
        showAIPanel: state.showAIPanel
      })
    }
  )
)
