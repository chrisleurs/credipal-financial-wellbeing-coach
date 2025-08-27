
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import { CrediPalPlanGenerator } from '@/services/crediPalPlanGenerator'
import { useToast } from './use-toast'

export interface FinancialPlan {
  id: string
  user_id: string
  plan_data: any
  status: string
  plan_type: string
  version: number
  created_at: string
  updated_at: string
  generatedAt: string
}

export const useFinancialPlanManager = () => {
  const { user } = useAuth()
  const { data: financialData } = useOptimizedFinancialData()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get active financial plan
  const { data: activePlan, isLoading: isLoadingPlan, error: planError } = useQuery({
    queryKey: ['active-financial-plan', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      
      if (data) {
        return {
          ...data,
          generatedAt: data.created_at
        } as FinancialPlan
      }
      
      return null
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000,
  })

  // Generate new plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !financialData) {
        throw new Error('Missing user or financial data')
      }

      console.log('🎯 Generating plan with financial data:', financialData)

      // Generate plan using CrediPal service
      const generatedPlan = CrediPalPlanGenerator.generateCompletePlan({
        monthlyIncome: financialData.monthlyIncome,
        monthlyExpenses: financialData.monthlyExpenses,
        currentSavings: financialData.currentSavings,
        savingsCapacity: financialData.savingsCapacity,
        totalDebtBalance: financialData.totalDebtBalance,
        totalMonthlyDebtPayments: financialData.totalMonthlyDebtPayments,
        activeDebts: financialData.activeDebts,
        activeGoals: financialData.activeGoals,
        expenseCategories: financialData.expenseCategories,
        hasRealData: financialData.hasRealData
      })
      
      // Deactivate old plans
      await supabase
        .from('financial_plans')
        .update({ status: 'inactive' })
        .eq('user_id', user.id)
        .eq('status', 'active')

      // Save new plan to database
      const { data, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          plan_type: 'credipal-3-2-1',
          plan_data: generatedPlan as any,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      return {
        ...data,
        generatedAt: data.created_at
      } as FinancialPlan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-financial-plan'] })
      toast({
        title: "¡Plan financiero generado!",
        description: "Tu nuevo plan personalizado está listo.",
      })
    },
    onError: (error) => {
      console.error('Plan generation error:', error)
      toast({
        title: "Error generando plan",
        description: "No se pudo generar tu plan financiero. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  // Regenerate plan mutation
  const regeneratePlanMutation = useMutation({
    mutationFn: async () => {
      return generatePlanMutation.mutateAsync()
    },
    onSuccess: () => {
      toast({
        title: "Plan actualizado",
        description: "Tu plan financiero ha sido actualizado con la información más reciente.",
      })
    }
  })

  // Update goal progress
  const updateGoalProgress = ({ goalId, progress }: { goalId: string; progress: number }) => {
    if (!activePlan) return

    const updatedPlanData = { ...activePlan.plan_data }
    // Update the specific goal progress in plan_data
    // This would depend on the structure of your plan_data
    
    console.log('🎯 Updating goal progress:', { goalId, progress })
  }

  return {
    activePlan,
    isLoadingPlan,
    planError,
    hasPlan: !!activePlan,
    generatePlan: generatePlanMutation.mutate,
    regeneratePlan: regeneratePlanMutation.mutate,
    isGenerating: generatePlanMutation.isPending || regeneratePlanMutation.isPending,
    updateGoalProgress,
    financialData,
    canGeneratePlan: !!financialData?.hasRealData
  }
}
