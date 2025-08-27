
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import type { FinancialPlan, PlanGenerationData } from '@/types/financialPlan'

/**
 * Hook unificado para gestión completa de planes financieros
 */
export const useFinancialPlanManager = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isGenerating, setIsGenerating] = useState(false)
  const { data: optimizedData } = useOptimizedFinancialData()

  // Obtener plan activo del usuario
  const { 
    data: activePlan, 
    isLoading: isLoadingPlan, 
    error: planError 
  } = useQuery({
    queryKey: ['financial-plan', user?.id],
    queryFn: async (): Promise<FinancialPlan | null> => {
      if (!user?.id) return null

      console.log('🔍 Fetching financial plan for user:', user.id)

      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('❌ Error fetching plan:', error)
        return null
      }

      if (!data) {
        console.log('📋 No active plan found')
        return null
      }

      console.log('✅ Found active plan:', data.id)

      // Parsear plan_data si es string
      const planData = typeof data.plan_data === 'string' 
        ? JSON.parse(data.plan_data) 
        : data.plan_data

      return {
        id: data.id,
        userId: data.user_id,
        ...planData,
        generatedAt: data.created_at,
        status: data.status
      } as FinancialPlan
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })

  // Generar nuevo plan
  const generatePlanMutation = useMutation({
    mutationFn: async (planData?: PlanGenerationData): Promise<FinancialPlan> => {
      if (!user?.id) throw new Error('User not authenticated')

      // Usar datos optimizados si no se proporcionan datos específicos
      const dataToUse = planData || {
        monthlyIncome: optimizedData?.monthlyIncome || 0,
        monthlyExpenses: optimizedData?.monthlyExpenses || 0,
        currentSavings: optimizedData?.currentSavings || 0,
        savingsCapacity: optimizedData?.savingsCapacity || 0,
        debts: optimizedData?.activeDebts?.map(debt => ({
          name: debt.creditor,
          amount: debt.balance,
          monthlyPayment: debt.payment
        })) || [],
        goals: optimizedData?.activeGoals?.map(goal => goal.title) || [],
        expenseCategories: optimizedData?.expenseCategories || {}
      }

      console.log('🚀 Generating financial plan with data:', dataToUse)

      // Llamar al edge function de OpenAI
      const { data: aiPlan, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: { financialData: dataToUse }
      })

      if (error) {
        console.error('❌ Error generating plan:', error)
        throw new Error(`Failed to generate plan: ${error.message}`)
      }

      if (!aiPlan) {
        throw new Error('No plan received from AI service')
      }

      console.log('✅ AI plan generated:', aiPlan)

      // Guardar plan en base de datos
      const { data: savedPlan, error: saveError } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          plan_type: 'comprehensive',
          plan_data: aiPlan,
          status: 'active'
        })
        .select()
        .single()

      if (saveError) {
        console.error('❌ Error saving plan:', saveError)
        throw saveError
      }

      console.log('💾 Plan saved successfully:', savedPlan.id)

      return {
        id: savedPlan.id,
        userId: savedPlan.user_id,
        ...aiPlan,
        generatedAt: savedPlan.created_at,
        status: savedPlan.status
      } as FinancialPlan
    },
    onSuccess: (newPlan) => {
      // Invalidar queries relacionadas
      queryClient.setQueryData(['financial-plan', user?.id], newPlan)
      queryClient.invalidateQueries({ queryKey: ['financial-plan'] })
      
      toast({
        title: "¡Plan generado exitosamente! 🎯",
        description: "Tu plan financiero personalizado está listo con tu información actual",
      })
    },
    onError: (error: Error) => {
      console.error('❌ Error in plan generation:', error)
      toast({
        title: "Error al generar plan",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  // Update goal progress mutation
  const updateGoalProgressMutation = useMutation({
    mutationFn: async ({ goalId, progress }: { goalId: string, progress: number }) => {
      if (!activePlan) throw new Error('No active plan found')

      // Update the plan's actionRoadmap
      const updatedPlan = { ...activePlan }
      if (updatedPlan.actionRoadmap) {
        const actionIndex = updatedPlan.actionRoadmap.findIndex(action => action.step.toString() === goalId)
        if (actionIndex !== -1) {
          updatedPlan.actionRoadmap[actionIndex] = {
            ...updatedPlan.actionRoadmap[actionIndex],
            completed: progress >= 100
          }
        }
      }

      // Save updated plan
      const { data, error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updatedPlan as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', activePlan.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-plan'] })
      toast({
        title: "Progreso actualizado",
        description: "Has completado una acción del plan",
      })
    }
  })

  // Función principal para generar plan
  const generatePlan = async (data?: PlanGenerationData) => {
    setIsGenerating(true)
    try {
      await generatePlanMutation.mutateAsync(data)
    } finally {
      setIsGenerating(false)
    }
  }

  // Función mejorada para regenerar plan
  const regeneratePlan = async () => {
    if (!optimizedData) {
      toast({
        title: "Error",
        description: "No se pueden obtener los datos financieros actuales.",
        variant: "destructive"
      })
      return
    }

    console.log('🔄 Regenerating plan with latest data:', optimizedData)
    await generatePlan()
    
    toast({
      title: "Plan regenerado",
      description: "Tu plan ha sido actualizado con la información más reciente.",
    })
  }

  return {
    // Estado del plan
    activePlan,
    isLoadingPlan,
    planError,
    hasPlan: !!activePlan,

    // Datos financieros
    financialData: optimizedData,

    // Generación de plan
    generatePlan,
    isGenerating: isGenerating || generatePlanMutation.isPending,
    
    // Progress updates
    updateGoalProgress: updateGoalProgressMutation.mutate,
    isUpdatingProgress: updateGoalProgressMutation.isPending,
    
    // Utilidades
    regeneratePlan
  }
}
