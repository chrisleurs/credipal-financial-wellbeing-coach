
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData'
import type { FinancialGoal, DashboardData } from '@/types/financialPlan'

interface GeneratedPlan {
  goals: FinancialGoal[]
  analysis: string
  motivationalMessage: string
  monthlyCapacity: number
}

export const useFinancialPlanGenerator = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const { consolidatedProfile, hasCompleteData } = useConsolidatedFinancialData()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)

  const generate321Plan = (): GeneratedPlan => {
    if (!consolidatedProfile) {
      throw new Error('No se pudieron obtener los datos del usuario')
    }

    console.log('🎯 Generating 3-2-1 plan with consolidated data:', {
      userId: consolidatedProfile.userId,
      monthlyBalance: consolidatedProfile.monthlyBalance,
      debtsCount: consolidatedProfile.debts.length,
      goalsCount: consolidatedProfile.goals.length,
      dataCompleteness: consolidatedProfile.dataCompleteness
    })

    const { 
      name, 
      monthlyBalance, 
      debts, 
      goals: existingGoals, 
      currentSavings,
      monthlyExpenses,
      totalDebtBalance,
      totalMonthlyDebtPayments
    } = consolidatedProfile
    
    // Calculate available capacity (income - expenses - debt payments)
    const availableCapacity = Math.max(monthlyBalance - totalMonthlyDebtPayments, 100)

    // Distribute capacity using 3-2-1 methodology
    const shortTermAmount = Math.floor(availableCapacity * 0.3)
    const mediumTermAmount = Math.floor(availableCapacity * 0.4)
    const longTermAmount = availableCapacity - shortTermAmount - mediumTermAmount

    const goals: FinancialGoal[] = []

    // SHORT TERM GOAL (30% - 1-3 months)
    const hasEmergencyFund = currentSavings >= 400
    const hasHighInterestDebt = debts.some(debt => debt.annual_interest_rate > 20)

    if (!hasEmergencyFund) {
      goals.push({
        id: '1',
        type: 'short',
        title: 'Fondo de Emergencia',
        emoji: '🆘',
        targetAmount: 400,
        currentAmount: currentSavings,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        progress: Math.min((currentSavings / 400) * 100, 100),
        actionText: 'Aportar'
      })
    } else {
      goals.push({
        id: '1',
        type: 'short',
        title: 'Fondo de Respiro Extra',
        emoji: '💰',
        targetAmount: shortTermAmount * 3,
        currentAmount: 0,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        progress: 0,
        actionText: 'Ahorrar'
      })
    }

    // MEDIUM TERM GOAL (40% - 4-8 months)
    if (hasHighInterestDebt) {
      const highestDebt = debts.reduce((prev, current) => 
        (current.annual_interest_rate > prev.annual_interest_rate) ? current : prev
      )
      goals.push({
        id: '2',
        type: 'medium',
        title: `Eliminar Deuda ${highestDebt.creditor_name}`,
        emoji: '💳',
        targetAmount: highestDebt.current_balance,
        currentAmount: highestDebt.total_amount - highestDebt.current_balance,
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        progress: Math.min(((highestDebt.total_amount - highestDebt.current_balance) / highestDebt.total_amount) * 100, 100),
        actionText: 'Pagar'
      })
    } else if (existingGoals.length > 0) {
      const priorityGoal = existingGoals[0]
      goals.push({
        id: '2',
        type: 'medium',
        title: priorityGoal.goal_name,
        emoji: '🎯',
        targetAmount: priorityGoal.target_amount,
        currentAmount: priorityGoal.current_amount,
        deadline: priorityGoal.target_date,
        status: 'in_progress',
        progress: Math.min((priorityGoal.current_amount / priorityGoal.target_amount) * 100, 100),
        actionText: 'Aportar'
      })
    } else {
      goals.push({
        id: '2',
        type: 'medium',
        title: 'Fondo de Oportunidades',
        emoji: '🚀',
        targetAmount: mediumTermAmount * 6,
        currentAmount: 0,
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        progress: 0,
        actionText: 'Ahorrar'
      })
    }

    // LONG TERM GOAL (30% - 9-18 months)
    const longTermGoal = existingGoals.find(g => g.target_amount > longTermAmount * 8) || 
                        existingGoals.find(g => !goals.some(goal => goal.title === g.goal_name))

    if (longTermGoal) {
      goals.push({
        id: '3',
        type: 'long',
        title: longTermGoal.goal_name,
        emoji: '🏡',
        targetAmount: longTermGoal.target_amount,
        currentAmount: longTermGoal.current_amount,
        deadline: longTermGoal.target_date,
        status: 'in_progress',
        progress: Math.min((longTermGoal.current_amount / longTermGoal.target_amount) * 100, 100),
        actionText: 'Ahorrar'
      })
    } else {
      goals.push({
        id: '3',
        type: 'long',
        title: 'Fondo para Inversión',
        emoji: '📈',
        targetAmount: longTermAmount * 12,
        currentAmount: 0,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        progress: 0,
        actionText: 'Invertir'
      })
    }

    // Generate personalized messages using REAL data
    const analysis = generateAnalysisMessage(consolidatedProfile)
    const motivationalMessage = generateMotivationalMessage(consolidatedProfile, goals)

    return {
      goals,
      analysis,
      motivationalMessage,
      monthlyCapacity: availableCapacity
    }
  }

  const generateAnalysisMessage = (profile: typeof consolidatedProfile): string => {
    if (!profile) return ''
    
    const { name, monthlyBalance, debts, goals, totalDebtBalance, dataCompleteness } = profile
    
    let message = `¡Hola ${name}! He analizado tu situación financiera completa (${Math.round(dataCompleteness)}% de datos disponibles). `
    
    if (monthlyBalance > 0) {
      message += `Tienes $${monthlyBalance.toLocaleString()} disponibles cada mes después de gastos. `
    }
    
    if (totalDebtBalance > 0) {
      const highInterestDebts = debts.filter(debt => debt.annual_interest_rate > 20)
      if (highInterestDebts.length > 0) {
        message += `Veo que tienes $${totalDebtBalance.toLocaleString()} en deudas, con ${highInterestDebts.length} de alto interés. Las priorizaremos. `
      } else {
        message += `Tienes $${totalDebtBalance.toLocaleString()} en deudas con intereses manejables. `
      }
    } else {
      message += `Me encanta que no tengas deudas altas. Podemos enfocarnos en hacer crecer tu patrimonio. `
    }
    
    if (goals.length > 0) {
      message += `He integrado tus ${goals.length} meta(s) existente(s) en tu nuevo plan personalizado. `
    }
    
    return message
  }

  const generateMotivationalMessage = (profile: typeof consolidatedProfile, goals: FinancialGoal[]): string => {
    if (!profile) return ''
    
    const { name, dataCompleteness } = profile
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
    
    if (totalProgress > 50) {
      return `¡${name}, ya tienes un gran avance! Con este plan estructurado y tus datos completos (${Math.round(dataCompleteness)}%) alcanzarás todas tus metas más rápido.`
    } else if (totalProgress > 0) {
      return `¡Perfecto ${name}! Ya tienes progreso en tus metas. Este plan personalizado te dará la estructura para acelerarlas.`
    } else {
      return `¡Es tu momento ${name}! Con este plan personalizado basado en tus datos reales alcanzarás tus sueños financieros paso a paso.`
    }
  }

  const generatePlan = async (): Promise<boolean> => {
    if (!user || !consolidatedProfile) {
      toast({
        title: "Error",
        description: "No se pudieron obtener tus datos financieros",
        variant: "destructive"
      })
      return false
    }

    if (!hasCompleteData) {
      toast({
        title: "Datos incompletos",
        description: `Completa tu perfil financiero para obtener un plan más preciso (${Math.round(consolidatedProfile.dataCompleteness)}% completado)`,
        variant: "destructive"
      })
    }

    setIsGenerating(true)
    try {
      console.log('🚀 Generating personalized financial plan with real user data')
      const plan = generate321Plan()
      setGeneratedPlan(plan)
      
      toast({
        title: "¡Plan generado!",
        description: "Tu plan financiero personalizado con datos reales está listo"
      })
      
      return true
    } catch (error) {
      console.error('Error generating plan:', error)
      toast({
        title: "Error",
        description: "No se pudo generar tu plan financiero",
        variant: "destructive"
      })
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  const savePlan = async (): Promise<boolean> => {
    if (!user || !generatedPlan || !consolidatedProfile) return false

    try {
      // Prepare plan data with comprehensive user context
      const planData = {
        goals: generatedPlan.goals,
        analysis: generatedPlan.analysis,
        motivationalMessage: generatedPlan.motivationalMessage,
        monthlyCapacity: generatedPlan.monthlyCapacity,
        planType: '3-2-1',
        version: '2.0', // Updated version to indicate real data usage
        generatedAt: new Date().toISOString(),
        userContext: {
          dataCompleteness: consolidatedProfile.dataCompleteness,
          monthlyIncome: consolidatedProfile.monthlyIncome,
          monthlyExpenses: consolidatedProfile.monthlyExpenses,
          totalDebts: consolidatedProfile.totalDebtBalance,
          goalsCount: consolidatedProfile.goals.length
        }
      }

      // Save to user_financial_plans
      const { error: planError } = await supabase
        .from('user_financial_plans')
        .upsert({
          user_id: user.id,
          plan_data: planData as any
        })

      if (planError) throw planError

      // Update action plans
      const actionsData = generatedPlan.goals.map(goal => ({
        id: goal.id,
        title: `Trabajar en: ${goal.title}`,
        description: `Aportar regularmente para alcanzar $${goal.targetAmount.toLocaleString()}`,
        priority: goal.type === 'short' ? 'high' : goal.type === 'medium' ? 'medium' : 'low',
        dueDate: goal.deadline,
        completed: false
      }))

      const { error: actionError } = await supabase
        .from('user_action_plans')
        .upsert({
          user_id: user.id,
          status: 'plan_generated',
          actions: actionsData as any,
          next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })

      if (actionError) throw actionError

      toast({
        title: "¡Plan guardado!",
        description: "Tu plan financiero personalizado ya está activo"
      })
      
      return true
    } catch (error) {
      console.error('Error saving plan:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar tu plan",
        variant: "destructive"
      })
      return false
    }
  }

  return {
    isGenerating,
    generatedPlan,
    consolidatedProfile, // Expose consolidated data for debugging
    hasCompleteData,
    generatePlan,
    savePlan,
    clearPlan: () => setGeneratedPlan(null)
  }
}
