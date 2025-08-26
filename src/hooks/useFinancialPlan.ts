
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'

// Import the existing type instead of redefining it
import type { ComprehensiveFinancialPlan } from './useFinancialPlanGenerator'

export const useFinancialPlan = (userId?: string) => {
  const { user } = useAuth()
  const effectiveUserId = userId || user?.id
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Get base financial data from useOptimizedFinancialData
  const { data: financialData, isLoading: isDataLoading, error: dataError } = useOptimizedFinancialData()
  
  // Check if we have complete data for plan generation
  const hasCompleteData = financialData?.hasRealData && financialData?.monthlyIncome > 0

  // Generate AI Plan using OpenAI edge function
  const aiPlanQuery = useQuery({
    queryKey: ['comprehensive-financial-plan', effectiveUserId],
    queryFn: async (): Promise<ComprehensiveFinancialPlan> => {
      if (!effectiveUserId || !financialData) {
        throw new Error('User ID or financial data missing')
      }

      console.log('🚀 Generating AI financial plan with data:', {
        userId: effectiveUserId,
        monthlyIncome: financialData.monthlyIncome,
        monthlyExpenses: financialData.monthlyExpenses,
        savingsCapacity: financialData.savingsCapacity,
        totalDebt: financialData.totalDebtBalance,
        debtsCount: financialData.activeDebts.length
      })

      // Prepare consolidated data for OpenAI
      const consolidatedData = {
        userId: effectiveUserId,
        monthlyIncome: financialData.monthlyIncome,
        monthlyExpenses: financialData.monthlyExpenses,
        expenseCategories: financialData.expenseCategories,
        debts: financialData.activeDebts.map(debt => ({
          name: debt.creditor,
          amount: debt.balance,
          monthlyPayment: debt.payment
        })),
        financialGoals: financialData.activeGoals.map(goal => goal.title),
        currentSavings: financialData.currentSavings,
        savingsCapacity: financialData.savingsCapacity
      }

      const { data: aiPlan, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: { financialData: consolidatedData }
      })

      if (error) {
        console.error('❌ Error generating AI plan:', error)
        throw error
      }

      console.log('✅ Generated comprehensive AI plan:', aiPlan)
      return aiPlan as ComprehensiveFinancialPlan
    },
    enabled: !!effectiveUserId && hasCompleteData && !isDataLoading,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours cache
    gcTime: 48 * 60 * 60 * 1000,    // 48 hours garbage collection
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  // Manual plan regeneration mutation
  const regeneratePlanMutation = useMutation({
    mutationFn: async () => {
      if (!effectiveUserId || !financialData) {
        throw new Error('Missing required data for plan generation')
      }

      const consolidatedData = {
        userId: effectiveUserId,
        monthlyIncome: financialData.monthlyIncome,
        monthlyExpenses: financialData.monthlyExpenses,
        expenseCategories: financialData.expenseCategories,
        debts: financialData.activeDebts.map(debt => ({
          name: debt.creditor,
          amount: debt.balance,
          monthlyPayment: debt.payment
        })),
        financialGoals: financialData.activeGoals.map(goal => goal.title),
        currentSavings: financialData.currentSavings,
        savingsCapacity: financialData.savingsCapacity
      }

      const { data: newPlan, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: { financialData: consolidatedData }
      })

      if (error) throw error
      return newPlan as ComprehensiveFinancialPlan
    },
    onSuccess: (newPlan) => {
      // Update the cache with new plan
      queryClient.setQueryData(['comprehensive-financial-plan', effectiveUserId], newPlan)
      
      toast({
        title: "¡Plan actualizado! 🎯",
        description: "Tu plan financiero ha sido regenerado exitosamente",
      })
    },
    onError: (error) => {
      console.error('❌ Error regenerating plan:', error)
      toast({
        title: "Error al regenerar plan",
        description: "No se pudo regenerar tu plan financiero. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  // Dummy functions for backward compatibility
  const updateBigGoal = async (goalId: string, updates: any) => {
    console.log('updateBigGoal called:', goalId, updates)
    // For now, this is a placeholder - could be implemented later
    toast({
      title: "Función en desarrollo",
      description: "La actualización de metas estará disponible pronto"
    })
  }

  const completeMiniGoal = async (goalId: string) => {
    console.log('completeMiniGoal called:', goalId)
    // For now, this is a placeholder - could be implemented later
    toast({
      title: "Función en desarrollo", 
      description: "La completación de mini-metas estará disponible pronto"
    })
  }

  // Helper function to refresh plan
  const regeneratePlan = () => {
    regeneratePlanMutation.mutate()
  }

  // Helper function to update plan (alias for regeneration)
  const updatePlan = () => {
    regeneratePlan()
  }

  // Combined loading state
  const loading = isDataLoading || aiPlanQuery.isLoading
  
  // Plan availability
  const hasPlan = !!aiPlanQuery.data
  
  // Error handling
  const error = dataError || aiPlanQuery.error

  return {
    // Original financial data
    financialData,
    
    // AI-generated comprehensive plan with 8 components
    plan: aiPlanQuery.data,
    
    // Loading states
    loading,
    isGenerating: regeneratePlanMutation.isPending,
    
    // Plan status
    hasPlan,
    hasCompleteData,
    
    // Control functions
    regeneratePlan,
    updatePlan,
    updateBigGoal,
    completeMiniGoal,
    
    // Error state
    error: error?.message || null,
    
    // Metadata
    lastUpdated: aiPlanQuery.dataUpdatedAt,
    isStale: aiPlanQuery.isStale
  }
}

