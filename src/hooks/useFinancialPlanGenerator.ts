
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'

export interface ComprehensiveFinancialPlan {
  snapshotInicial: {
    hoy: {
      ingresos: number
      gastos: number
      deuda: number
      ahorro: number
    }
    en12Meses: {
      deuda: number
      fondoEmergencia: number
      patrimonio: number
    }
  }
  presupuestoMensual: {
    necesidades: { porcentaje: number; cantidad: number }
    estiloVida: { porcentaje: number; cantidad: number }
    ahorro: { porcentaje: number; cantidad: number }
  }
  planPagoDeuda: Array<{
    deuda: string
    balanceActual: number
    fechaLiquidacion: string
    pagoMensual: number
    interesesAhorrados: number
  }>
  fondoEmergencia: {
    metaTotal: number
    progresoActual: number
    ahorroMensual: number
    fechaCompletion: string
  }
  crecimientoPatrimonial: {
    año1: number
    año3: number
    año5: number
  }
  roadmapTrimestral: Array<{
    trimestre: string
    ahorroAcumulado: number
    deudaPendiente: number
    avance: number
  }>
  metasCortoPlazo: {
    semanales: Array<{
      titulo: string
      meta: number
      progreso: number
      tipo: string
    }>
    mensuales: Array<{
      titulo: string
      meta: number
      progreso: number
      tipo: string
    }>
  }
  roadmapAccion: Array<{
    paso: number
    titulo: string
    fechaObjetivo: string
    completado: boolean
  }>
  metadata?: {
    generatedAt: string
    userId: string
    monthlyBalance: number
    dataQuality: number
    planVersion: string
  }
}

export const useFinancialPlanGenerator = () => {
  const { user } = useAuth()
  const { data: optimizedData, isLoading: isLoadingData } = useOptimizedFinancialData()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [generatedPlan, setGeneratedPlan] = useState<ComprehensiveFinancialPlan | null>(null)

  // Check if user has enough data for plan generation
  const hasCompleteData = optimizedData?.hasRealData && optimizedData?.monthlyIncome > 0

  // Generate comprehensive financial plan
  const generatePlanMutation = useMutation({
    mutationFn: async (): Promise<ComprehensiveFinancialPlan> => {
      if (!user?.id || !optimizedData) {
        throw new Error('User not authenticated or missing financial data')
      }

      console.log('🚀 Generating comprehensive financial plan with data:', optimizedData)

      // Prepare consolidated data for OpenAI
      const consolidatedData = {
        userId: user.id,
        totalMonthlyIncome: optimizedData.monthlyIncome,
        monthlyIncome: optimizedData.monthlyIncome, 
        monthlyExpenses: optimizedData.monthlyExpenses,
        currentSavings: optimizedData.currentSavings,
        monthlySavingsCapacity: optimizedData.savingsCapacity,
        savingsCapacity: optimizedData.savingsCapacity,
        debts: optimizedData.activeDebts.map(debt => ({
          name: debt.creditor,
          creditor: debt.creditor,
          amount: debt.balance,
          current_balance: debt.balance,
          monthlyPayment: debt.payment,
          monthly_payment: debt.payment
        })),
        financialGoals: optimizedData.activeGoals.map(goal => goal.title),
        expenseCategories: optimizedData.expenseCategories
      }

      console.log('📊 Sending consolidated data to AI:', consolidatedData)

      const { data: aiPlan, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: { financialData: consolidatedData }
      })

      if (error) {
        console.error('❌ Error generating financial plan:', error)
        throw error
      }

      console.log('✅ Generated comprehensive financial plan:', aiPlan)
      return aiPlan as ComprehensiveFinancialPlan
    },
    onSuccess: (plan) => {
      setGeneratedPlan(plan)
      toast({
        title: "¡Plan financiero generado!",
        description: "Tu plan personalizado está listo con todos los componentes",
      })
    },
    onError: (error) => {
      console.error('❌ Error generating plan:', error)
      toast({
        title: "Error al generar plan",
        description: "No se pudo generar tu plan financiero. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  // Get existing plan from database
  const existingPlanQuery = useQuery({
    queryKey: ['comprehensive-financial-plan', user?.id],
    queryFn: async (): Promise<ComprehensiveFinancialPlan | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('financial_plans')
        .select('plan_data, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('plan_type', 'comprehensive')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching existing plan:', error)
        return null
      }

      if (data?.plan_data) {
        return data.plan_data as ComprehensiveFinancialPlan
      }

      return null
    },
    enabled: !!user?.id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours cache
  })

  // Save plan to database
  const savePlanMutation = useMutation({
    mutationFn: async (plan: ComprehensiveFinancialPlan) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('financial_plans')
        .upsert({
          user_id: user.id,
          plan_type: 'comprehensive',
          plan_data: plan,
          status: 'active'
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comprehensive-financial-plan'] })
      toast({
        title: "Plan guardado",
        description: "Tu plan financiero ha sido guardado exitosamente",
      })
    },
    onError: (error) => {
      console.error('Error saving plan:', error)
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el plan",
        variant: "destructive"
      })
    }
  })

  const generatePlan = () => generatePlanMutation.mutate()
  const savePlan = () => {
    if (generatedPlan) {
      savePlanMutation.mutate(generatedPlan)
    }
  }
  const clearPlan = () => setGeneratedPlan(null)

  // Use generated plan if available, otherwise use existing plan from DB
  const currentPlan = generatedPlan || existingPlanQuery.data

  return {
    consolidatedProfile: optimizedData,
    hasCompleteData,
    isLoading: isLoadingData || existingPlanQuery.isLoading,
    generatePlan,
    isGenerating: generatePlanMutation.isPending,
    generatedPlan: currentPlan,
    savePlan,
    clearPlan,
    isSaving: savePlanMutation.isPending,
  }
}
