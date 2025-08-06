
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'
import type { FinancialGoal, DashboardData } from '@/types/financialPlan'

interface UserFinancialProfile {
  name: string
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  existingGoals: any[]
  debts: any[]
  savings: number
}

interface GeneratedPlan {
  goals: FinancialGoal[]
  analysis: string
  motivationalMessage: string
  monthlyCapacity: number
}

export const useFinancialPlanGenerator = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)

  const getUserFinancialProfile = async (): Promise<UserFinancialProfile | null> => {
    if (!user) return null

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single()

      // Get financial data
      const { data: financialData } = await supabase
        .from('financial_data')
        .select('monthly_income, monthly_expenses, monthly_balance')
        .eq('user_id', user.id)
        .single()

      // Get detailed financial data from onboarding
      const { data: userFinancialData } = await supabase
        .from('user_financial_data')
        .select('ingresos, gastos_categorizados, deudas, ahorros')
        .eq('user_id', user.id)
        .single()

      // Get existing goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      // Get debts
      const { data: debts } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)

      return {
        name: profile?.first_name || 'Usuario',
        monthlyIncome: financialData?.monthly_income || userFinancialData?.ingresos || 0,
        monthlyExpenses: financialData?.monthly_expenses || 0,
        monthlyBalance: financialData?.monthly_balance || 0,
        existingGoals: goals || [],
        debts: debts || [],
        savings: userFinancialData?.ahorros?.actual || 0
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  const generate321Plan = (profile: UserFinancialProfile): GeneratedPlan => {
    const { name, monthlyBalance, debts, existingGoals, savings } = profile
    const availableCapacity = Math.max(monthlyBalance, 100) // Minimum $100

    // Distribute capacity using 3-2-1 methodology
    const shortTermAmount = Math.floor(availableCapacity * 0.3)
    const mediumTermAmount = Math.floor(availableCapacity * 0.4)
    const longTermAmount = availableCapacity - shortTermAmount - mediumTermAmount

    const goals: FinancialGoal[] = []

    // SHORT TERM GOAL (30% - 1-3 months)
    const hasEmergencyFund = savings >= 400
    const hasHighInterestDebt = debts.some((debt: any) => debt.annual_interest_rate > 20)

    if (!hasEmergencyFund) {
      goals.push({
        id: '1',
        type: 'short',
        title: 'Fondo de Emergencia',
        emoji: '🆘',
        targetAmount: 400,
        currentAmount: savings,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        progress: Math.min((savings / 400) * 100, 100),
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
      const highestDebt = debts.reduce((prev: any, current: any) => 
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

    // Generate personalized messages
    const analysis = generateAnalysisMessage(profile)
    const motivationalMessage = generateMotivationalMessage(profile, goals)

    return {
      goals,
      analysis,
      motivationalMessage,
      monthlyCapacity: availableCapacity
    }
  }

  const generateAnalysisMessage = (profile: UserFinancialProfile): string => {
    const { name, monthlyBalance, debts, existingGoals } = profile
    
    let message = `¡Hola ${name}! He analizado tu situación financiera. `
    
    if (monthlyBalance > 0) {
      message += `Tienes $${monthlyBalance.toLocaleString()} disponibles cada mes para tus metas. `
    }
    
    if (debts.length > 0) {
      const highInterestDebts = debts.filter((debt: any) => debt.annual_interest_rate > 20)
      if (highInterestDebts.length > 0) {
        message += `Veo que tienes deudas con intereses altos. Las priorizaremos. `
      }
    } else {
      message += `Me encanta que no tengas deudas altas. Podemos enfocarnos en hacer crecer tu patrimonio. `
    }
    
    if (existingGoals.length > 0) {
      message += `He integrado tus ${existingGoals.length} meta(s) existente(s) en tu nuevo plan. `
    }
    
    return message
  }

  const generateMotivationalMessage = (profile: UserFinancialProfile, goals: FinancialGoal[]): string => {
    const { name } = profile
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
    
    if (totalProgress > 50) {
      return `¡${name}, ya tienes un gran avance! Con este plan estructurado alcanzarás todas tus metas más rápido.`
    } else if (totalProgress > 0) {
      return `¡Perfecto ${name}! Ya tienes progreso en tus metas. Este plan te dará la estructura para acelerarlas.`
    } else {
      return `¡Es tu momento ${name}! Con este plan de 3 pasos alcanzarás tus sueños financieros paso a paso.`
    }
  }

  const generatePlan = async (): Promise<boolean> => {
    if (!user) return false

    setIsGenerating(true)
    try {
      const profile = await getUserFinancialProfile()
      if (!profile) {
        toast({
          title: "Error",
          description: "No se pudieron obtener tus datos financieros",
          variant: "destructive"
        })
        return false
      }

      const plan = generate321Plan(profile)
      setGeneratedPlan(plan)
      
      toast({
        title: "¡Plan generado!",
        description: "Tu plan financiero personalizado está listo"
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
    if (!user || !generatedPlan) return false

    try {
      // Save to user_financial_plans
      const { error: planError } = await supabase
        .from('user_financial_plans')
        .upsert({
          user_id: user.id,
          plan_data: {
            goals: generatedPlan.goals,
            analysis: generatedPlan.analysis,
            motivationalMessage: generatedPlan.motivationalMessage,
            monthlyCapacity: generatedPlan.monthlyCapacity,
            planType: '3-2-1',
            version: '1.0',
            generatedAt: new Date().toISOString()
          }
        })

      if (planError) throw planError

      // Update action plans
      const { error: actionError } = await supabase
        .from('user_action_plans')
        .upsert({
          user_id: user.id,
          status: 'plan_generated',
          actions: generatedPlan.goals.map(goal => ({
            id: goal.id,
            title: `Trabajar en: ${goal.title}`,
            description: `Aportar regularmente para alcanzar $${goal.targetAmount.toLocaleString()}`,
            priority: goal.type === 'short' ? 'high' : goal.type === 'medium' ? 'medium' : 'low',
            dueDate: goal.deadline,
            completed: false
          })),
          next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })

      if (actionError) throw actionError

      toast({
        title: "¡Plan guardado!",
        description: "Tu plan financiero ya está activo"
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
    generatePlan,
    savePlan,
    clearPlan: () => setGeneratedPlan(null)
  }
}
