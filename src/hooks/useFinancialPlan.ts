
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
  
  // More flexible data check - allow plan generation even with minimal data
  const hasAnyData = financialData && (
    financialData.monthlyIncome > 0 || 
    financialData.monthlyExpenses > 0 || 
    financialData.totalDebtBalance > 0 ||
    financialData.activeGoals.length > 0
  )

  console.log('🔍 Financial Plan Hook - Data Analysis:', {
    financialData: !!financialData,
    monthlyIncome: financialData?.monthlyIncome || 0,
    monthlyExpenses: financialData?.monthlyExpenses || 0,
    hasRealData: financialData?.hasRealData || false,
    hasAnyData,
    isDataLoading
  })

  // Check for existing plan first
  const existingPlanQuery = useQuery({
    queryKey: ['existing-financial-plan', effectiveUserId],
    queryFn: async () => {
      if (!effectiveUserId) throw new Error('No user ID')

      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching existing plan:', error)
        return null
      }

      console.log('📋 Existing plan found:', !!data)
      return data
    },
    enabled: !!effectiveUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Generate AI Plan using OpenAI edge function
  const generatePlanMutation = useMutation({
    mutationFn: async (): Promise<ComprehensiveFinancialPlan> => {
      if (!effectiveUserId || !financialData) {
        throw new Error('User ID or financial data missing')
      }

      console.log('🚀 Generating new financial plan with data:', {
        userId: effectiveUserId,
        monthlyIncome: financialData.monthlyIncome,
        monthlyExpenses: financialData.monthlyExpenses,
        hasAnyData
      })

      // Create a comprehensive data object for the AI
      const consolidatedData = {
        userId: effectiveUserId,
        monthlyIncome: financialData.monthlyIncome,
        monthlyExpenses: financialData.monthlyExpenses,
        monthlyBalance: financialData.monthlyBalance,
        savingsCapacity: financialData.savingsCapacity,
        expenseCategories: financialData.expenseCategories,
        debts: financialData.activeDebts.map(debt => ({
          name: debt.creditor,
          amount: debt.balance,
          monthlyPayment: debt.payment
        })),
        financialGoals: financialData.activeGoals.map(goal => goal.title),
        currentSavings: financialData.currentSavings,
        totalDebt: financialData.totalDebtBalance,
        hasRealData: financialData.hasRealData
      }

      console.log('📤 Sending data to OpenAI function:', consolidatedData)

      const { data: aiPlan, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: { financialData: consolidatedData }
      })

      if (error) {
        console.error('❌ OpenAI function error:', error)
        throw error
      }

      if (!aiPlan) {
        throw new Error('No plan received from AI service')
      }

      console.log('✅ AI plan generated successfully:', aiPlan)
      return aiPlan as ComprehensiveFinancialPlan
    },
    onSuccess: (newPlan) => {
      // Update both queries
      queryClient.setQueryData(['existing-financial-plan', effectiveUserId], {
        id: 'temp-' + Date.now(),
        user_id: effectiveUserId,
        plan_data: newPlan,
        status: 'active',
        created_at: new Date().toISOString()
      })
      
      toast({
        title: "¡Plan generado exitosamente! 🎯",
        description: "Tu plan financiero personalizado está listo",
      })
    },
    onError: (error) => {
      console.error('❌ Error generating plan:', error)
      toast({
        title: "Error al generar plan",
        description: `No se pudo generar tu plan: ${error.message}`,
        variant: "destructive"
      })
    }
  })

  // Parse existing plan data
  const parsedPlan = existingPlanQuery.data?.plan_data ? 
    (typeof existingPlanQuery.data.plan_data === 'string' ? 
      JSON.parse(existingPlanQuery.data.plan_data) : 
      existingPlanQuery.data.plan_data) : null

  // Combined loading state
  const loading = isDataLoading || existingPlanQuery.isLoading
  
  // Plan availability - check both generated and existing
  const hasPlan = !!parsedPlan
  
  // Error handling
  const error = dataError || existingPlanQuery.error || generatePlanMutation.error

  // Can generate plan if we have any meaningful data
  const canGeneratePlan = hasAnyData && !loading

  console.log('📊 Financial Plan Hook - Final Analysis:', {
    loading,
    hasPlan,
    canGeneratePlan,
    hasAnyData,
    existingPlan: !!existingPlanQuery.data,
    error: error?.message
  })

  return {
    // Plan data
    plan: parsedPlan,
    financialData,
    
    // Status flags
    loading,
    hasPlan,
    hasCompleteData: hasAnyData,
    canGeneratePlan,
    
    // Actions
    generatePlan: generatePlanMutation.mutate,
    regeneratePlan: generatePlanMutation.mutate,
    isGenerating: generatePlanMutation.isPending,
    
    // Legacy compatibility
    updatePlan: generatePlanMutation.mutate,
    updateBigGoal: async (goalId: string, updates: any) => {
      console.log('updateBigGoal placeholder:', goalId, updates)
    },
    completeMiniGoal: async (goalId: string) => {
      console.log('completeMiniGoal placeholder:', goalId)
    },
    
    // Error state
    error: error?.message || null,
    
    // Metadata
    lastUpdated: existingPlanQuery.dataUpdatedAt,
    isStale: existingPlanQuery.isStale
  }
}
