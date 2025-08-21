
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import type { FinancialGoal } from '@/types/financialPlan'

interface GeneratedPlan {
  id: string
  goals: FinancialGoal[]
  nextPayments: Array<{
    id: string
    type: 'debt' | 'goal'
    name: string
    amount: number
    dueDate: string
    priority: 'high' | 'medium' | 'low'
  }>
  upcomingMilestones: Array<{
    id: string
    title: string
    targetDate: string
    progress: number
    description: string
  }>
  motivationalMessage: string
  recommendations: string[]
  actionPlan?: Array<{
    title: string
    description: string
    timeline?: string
    priority: 'high' | 'medium' | 'low'
  }>
  summary?: string
}

export const useFinancialPlanGenerator = () => {
  const { user } = useAuth()
  const { consolidatedData, isLoading: isDataLoading } = useConsolidatedFinancialData()
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPlan, setHasPlan] = useState(false)

  // Check if user already has a plan
  const checkExistingPlan = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('financial_plans')
        .select('plan_data')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (data?.plan_data && !error) {
        const planData = data.plan_data as any
        setGeneratedPlan(planData)
        setHasPlan(true)
      } else {
        setHasPlan(false)
      }
    } catch (error) {
      console.error('Error checking existing plan:', error)
      setHasPlan(false)
    }
  }

  const generatePlan = async () => {
    if (!user?.id || !consolidatedData) return

    setIsGenerating(true)
    setError(null)

    try {
      // Generar goals basados en la situación financiera
      const goals: FinancialGoal[] = []
      
      // Goal 1: Fondo de emergencia (siempre prioritario)
      const emergencyFundTarget = consolidatedData.monthlyExpenses * 6
      goals.push({
        id: 'emergency-fund',
        type: 'short',
        title: 'Fondo de Emergencia',
        emoji: '🟢',
        targetAmount: emergencyFundTarget,
        currentAmount: consolidatedData.currentSavings,
        deadline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: consolidatedData.currentSavings >= emergencyFundTarget ? 'completed' : 'in_progress',
        progress: Math.min((consolidatedData.currentSavings / emergencyFundTarget) * 100, 100),
        actionText: 'Ahorrar más'
      })

      // Goal 2: Reducción de deudas (si existen)
      if (consolidatedData.totalDebtBalance > 0) {
        goals.push({
          id: 'debt-reduction',
          type: 'medium',
          title: 'Libertad de Deudas',
          emoji: '💳',
          targetAmount: consolidatedData.totalDebtBalance,
          currentAmount: 0,
          deadline: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
          progress: 0,
          actionText: 'Pagar deudas'
        })
      }

      // Goal 3: Meta de ahorro a largo plazo
      const longTermSavingsTarget = consolidatedData.monthlyIncome * 12
      goals.push({
        id: 'long-term-savings',
        type: 'long',
        title: 'Meta de Ahorro Anual',
        emoji: '🏡',
        targetAmount: longTermSavingsTarget,
        currentAmount: 0,
        deadline: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        progress: 0,
        actionText: 'Comenzar a ahorrar'
      })

      // Generar próximos pagos
      const nextPayments = []
      
      // Pagos de deudas
      consolidatedData.debts.forEach(debt => {
        nextPayments.push({
          id: `debt-${debt.id}`,
          type: 'debt' as const,
          name: debt.creditor,
          amount: debt.monthly_payment,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high' as const
        })
      })

      // Próximas metas a cumplir
      const upcomingMilestones = [
        {
          id: 'emergency-25',
          title: '25% del Fondo de Emergencia',
          targetDate: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          progress: Math.min((consolidatedData.currentSavings / (emergencyFundTarget * 0.25)) * 100, 100),
          description: `Alcanzar $${(emergencyFundTarget * 0.25).toLocaleString()}`
        },
        {
          id: 'debt-50',
          title: 'Reducir 50% de Deudas',
          targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 0,
          description: `Pagar $${(consolidatedData.totalDebtBalance * 0.5).toLocaleString()}`
        }
      ]

      // Mensaje motivacional basado en la situación
      let motivationalMessage = "¡Bienvenido a tu nuevo plan financiero!"
      if (consolidatedData.savingsCapacity > 0) {
        motivationalMessage = `¡Excelente! Tienes $${consolidatedData.savingsCapacity.toLocaleString()} disponibles mensualmente. Tu libertad financiera está al alcance.`
      } else if (consolidatedData.savingsCapacity < 0) {
        motivationalMessage = "Vamos a optimizar tus finanzas. Cada pequeño cambio te acerca a la estabilidad."
      }

      // Recomendaciones personalizadas
      const recommendations = []
      if (consolidatedData.savingsCapacity <= 0) {
        recommendations.push("Revisa tus gastos mensuales para encontrar áreas de optimización")
      }
      if (consolidatedData.totalDebtBalance > consolidatedData.monthlyIncome * 3) {
        recommendations.push("Considera consolidar tus deudas para reducir intereses")
      }
      if (consolidatedData.currentSavings < consolidatedData.monthlyExpenses * 3) {
        recommendations.push("Prioriza crear un fondo de emergencia")
      }
      recommendations.push("Automatiza tus ahorros para crear disciplina financiera")

      // Action plan
      const actionPlan = [
        {
          title: "Establece tu fondo de emergencia",
          description: "Separa un monto fijo mensual hasta alcanzar 6 meses de gastos",
          timeline: "0-6 meses",
          priority: 'high' as const
        },
        {
          title: "Optimiza tus gastos",
          description: "Identifica gastos innecesarios y redirige ese dinero a tus metas",
          timeline: "Inmediato",
          priority: 'high' as const
        }
      ]

      const plan: GeneratedPlan = {
        id: `plan-${Date.now()}`,
        goals,
        nextPayments,
        upcomingMilestones,
        motivationalMessage,
        recommendations,
        actionPlan,
        summary: "Plan personalizado basado en tu situación financiera actual"
      }

      // Guardar el plan en la base de datos - fix the JSON conversion
      const { error: saveError } = await supabase
        .from('financial_plans')
        .upsert({
          user_id: user.id,
          plan_type: 'credipal-generated',
          plan_data: plan as any, // Cast to any to bypass JSON type checking
          status: 'active'
        })

      if (saveError) throw saveError

      setGeneratedPlan(plan)
      setHasPlan(true)
    } catch (error) {
      console.error('Error generating financial plan:', error)
      setError('Error al generar el plan financiero')
    } finally {
      setIsGenerating(false)
    }
  }

  const savePlan = async () => {
    console.log('Plan saved successfully')
  }

  const clearPlan = () => {
    setGeneratedPlan(null)
    setHasPlan(false)
  }

  useEffect(() => {
    if (user?.id) {
      checkExistingPlan()
    }
  }, [user?.id])

  return {
    generatedPlan,
    isGenerating,
    error,
    hasPlan,
    isLoading: isDataLoading,
    hasCompleteData: !!consolidatedData && consolidatedData.hasRealData,
    consolidatedProfile: consolidatedData,
    generatePlan,
    regeneratePlan: generatePlan,
    savePlan,
    clearPlan
  }
}
