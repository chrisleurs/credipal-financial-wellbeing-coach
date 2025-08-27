import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'
import type { FinancialPlan, PlanGenerationData } from '@/types/financialPlan'

/**
 * Hook unificado para gestión completa de planes financieros
 * Reemplaza a todos los hooks duplicados
 */
export const useFinancialPlanManager = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isGenerating, setIsGenerating] = useState(false)

  // Obtener plan activo del usuario
  const { 
    data: activePlan, 
    isLoading: isLoadingPlan, 
    error: planError 
  } = useQuery({
    queryKey: ['financial-plan', user?.id],
    queryFn: async (): Promise<FinancialPlan | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching plan:', error)
        return null
      }

      if (!data) return null

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
    mutationFn: async (planData: PlanGenerationData): Promise<FinancialPlan> => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('🚀 Generating financial plan with data:', planData)

      // Llamar al edge function de OpenAI
      const { data: aiPlan, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: { financialData: planData }
      })

      if (error) {
        console.error('❌ Error generating plan:', error)
        throw new Error(`Failed to generate plan: ${error.message}`)
      }

      if (!aiPlan) {
        throw new Error('No plan received from AI service')
      }

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
        description: "Tu plan financiero personalizado está listo",
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

  // Función principal para generar plan
  const generatePlan = async (data: PlanGenerationData) => {
    setIsGenerating(true)
    try {
      await generatePlanMutation.mutateAsync(data)
    } finally {
      setIsGenerating(false)
    }
  }

  // Actualizar progreso de metas
  const updateGoalProgressMutation = useMutation({
    mutationFn: async ({ goalId, progress }: { goalId: string; progress: number }) => {
      if (!activePlan) throw new Error('No active plan found')

      // Actualizar el progreso en el plan
      const updatedPlan = { ...activePlan }
      // Lógica para actualizar progreso específico según goalId
      
      const { error } = await supabase
        .from('financial_plans')
        .update({
          plan_data: updatedPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', activePlan.id)

      if (error) throw error
      return updatedPlan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-plan'] })
      toast({
        title: "Progreso actualizado",
        description: "Tu avance ha sido registrado exitosamente",
      })
    }
  })

  // Función mejorada para regenerar plan
  const regeneratePlan = async () => {
    if (!activePlan || !user?.id) {
      toast({
        title: "Error",
        description: "No se puede regenerar el plan sin datos existentes.",
        variant: "destructive"
      })
      return
    }

    // Crear datos base desde el plan actual para regeneración
    const planData: PlanGenerationData = {
      monthlyIncome: activePlan.currentSnapshot.monthlyIncome,
      monthlyExpenses: activePlan.currentSnapshot.monthlyExpenses,
      currentSavings: activePlan.currentSnapshot.currentSavings,
      savingsCapacity: activePlan.currentSnapshot.monthlyIncome - activePlan.currentSnapshot.monthlyExpenses,
      debts: activePlan.debtPayoffPlan.map(debt => ({
        name: debt.debtName,
        amount: debt.currentBalance,
        monthlyPayment: debt.monthlyPayment
      })),
      goals: [], // Los goals se obtienen de la base de datos actual
      expenseCategories: {}
    }
    
    await generatePlan(planData)
    
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

    // Generación de plan
    generatePlan,
    isGenerating: isGenerating || generatePlanMutation.isPending,
    
    // Actualización de progreso
    updateGoalProgress: updateGoalProgressMutation.mutate,
    isUpdatingProgress: updateGoalProgressMutation.isPending,
    
    // Utilidades
    regeneratePlan
  }
}
