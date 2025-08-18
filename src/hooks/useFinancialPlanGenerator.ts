
import { useState } from 'react'
import { useConsolidatedProfile } from './useConsolidatedProfile'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

export const useFinancialPlanGenerator = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { consolidatedProfile, hasCompleteData, isLoading } = useConsolidatedProfile()
  const [generatedPlan, setGeneratedPlan] = useState(null)

  // Generate plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !consolidatedProfile) {
        throw new Error('User not authenticated or profile incomplete')
      }

      // Mock plan generation - in real app this would call AI service
      const mockPlan = {
        goals: [
          {
            id: '1',
            title: 'Fondo de Emergencia',
            description: 'Crear un fondo para emergencias',
            target_amount: consolidatedProfile.monthlyExpenses * 6,
            current_amount: consolidatedProfile.currentSavings,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high' as const,
            status: 'active' as const
          }
        ],
        recommendations: [
          'Reduce gastos no esenciales',
          'Incrementa tus ingresos',
          'Automatiza tus ahorros'
        ]
      }

      return mockPlan
    },
    onSuccess: (plan) => {
      setGeneratedPlan(plan)
      toast({
        title: "Plan generado",
        description: "Tu plan financiero ha sido generado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo generar el plan financiero.",
        variant: "destructive",
      })
    },
  })

  // Save plan mutation
  const savePlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          plan_type: '3-2-1',
          plan_data: planData,
          status: 'active'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-plans'] })
      toast({
        title: "Plan guardado",
        description: "Tu plan financiero ha sido guardado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo guardar el plan financiero.",
        variant: "destructive",
      })
    },
  })

  const generatePlan = () => {
    generatePlanMutation.mutate()
  }

  const savePlan = (planData: any) => {
    savePlanMutation.mutate(planData)
  }

  const clearPlan = () => {
    setGeneratedPlan(null)
  }

  return {
    consolidatedProfile,
    hasCompleteData,
    isLoading,
    generatedPlan,
    isGenerating: generatePlanMutation.isPending,
    generatePlan,
    savePlan,
    clearPlan
  }
}
