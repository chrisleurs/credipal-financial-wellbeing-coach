
import { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { AIFinancialPlan, ActionItem } from '@/types/domains/plans/plan'

export interface DashboardSlice {
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
  
  // AI Plan generation methods
  generateAIPlan: (financialData: any) => Promise<void>
  generateActionPlan: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export const createDashboardSlice: StateCreator<DashboardSlice> = (set, get) => ({
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
  isLoading: false,
  error: null,

  // Actions
  setAIPlan: (plan) => set({ aiPlan: plan }),
  setIsGeneratingPlan: (loading) => set({ isGeneratingPlan: loading }),
  setPlanError: (error) => set({ planError: error }),
  setActionItems: (items) => set({ actionItems: items }),
  setIsLoadingActions: (loading) => set({ isLoadingActions: loading }),
  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setShowAIPanel: (show) => set({ showAIPanel: show }),
  
  generateAIPlan: async (financialData: any) => {
    set({ isLoading: true, error: null })
    try {
      // Mock AI plan generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      const plan: AIFinancialPlan = {
        id: 'generated-' + Date.now(),
        userId: 'demo',
        planType: 'comprehensive',
        status: 'active',
        title: 'Plan Financiero AI Generado',
        description: 'Plan personalizado basado en tu información financiera',
        motivationalMessage: '¡Excelente! Tu situación financiera tiene gran potencial de mejora.',
        recommendations: [
          'Optimiza tus gastos variables',
          'Incrementa tu capacidad de ahorro',
          'Considera estrategias de inversión'
        ],
        currentBalance: { amount: financialData?.monthlyBalance || 0, currency: 'MXN' },
        monthlyBalance: { amount: financialData?.monthlyBalance || 0, currency: 'MXN' },
        projectedSavings: { amount: (financialData?.monthlyBalance || 0) * 12, currency: 'MXN' },
        savingsSuggestion: 'Podrías mejorar tu capacidad de ahorro optimizando gastos',
        timelineMonths: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      set({ aiPlan: plan, isLoading: false })
    } catch (error) {
      set({ error: 'Error generando plan AI', isLoading: false })
    }
  },

  generateActionPlan: async () => {
    set({ isLoadingActions: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const actions: ActionItem[] = [
        {
          id: 'action-' + Date.now(),
          planId: get().aiPlan?.id || 'default',
          userId: 'demo',
          title: 'Revisar gastos mensuales',
          description: 'Identificar áreas de optimización',
          category: 'expense',
          priority: 'high',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      set({ actionItems: [...get().actionItems, ...actions], isLoadingActions: false })
    } catch (error) {
      set({ isLoadingActions: false })
    }
  },
  
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
})
