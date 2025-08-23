
/**
 * Hook optimizado para planes financieros
 * Mejora la gestión de planes y generación
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { CrediPalPlanGenerator } from '@/services/crediPalPlanGenerator'
import { useToast } from '@/hooks/use-toast'

export const useFinancialPlanOptimized = () => {
  const { user } = useAuth()
  const { data: financialData } = useOptimizedFinancialData()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get active financial plan
  const activePlan = useQuery({
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
      return data
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Generate new plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !financialData) {
        throw new Error('Missing user or financial data')
      }

      // Generate plan using CrediPal service
      const generatedPlan = CrediPalPlanGenerator.generateCompletePlan(financialData)
      
      // Save to database - cast to Json to satisfy Supabase type
      const { data, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          plan_type: 'credipal-3-2-1',
          plan_data: generatedPlan as any, // Cast to Json
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      return data
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

  // Update plan mutation
  const updatePlanMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!activePlan.data?.id) throw new Error('No active plan found')

      const { data, error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updates as any, // Cast to Json
          updated_at: new Date().toISOString()
        })
        .eq('id', activePlan.data.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-financial-plan'] })
    }
  })

  return {
    activePlan: activePlan.data,
    isLoadingPlan: activePlan.isLoading,
    planError: activePlan.error,
    generatePlan: generatePlanMutation.mutate,
    isGenerating: generatePlanMutation.isPending,
    updatePlan: updatePlanMutation.mutate,
    isUpdating: updatePlanMutation.isPending,
    canGeneratePlan: !!financialData?.hasRealData
  }
}
