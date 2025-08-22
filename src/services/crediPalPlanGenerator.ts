
import type { Debt, DebtPayment } from '@/types/debt'
import { AIMotivationalService } from './aiMotivationalService'

export interface CrediPalSnapshot {
  monthlyNetIncome: number
  monthlyExpenses: number
  initialDebt: number
  currentSavings: number
  projectedYear1Position: string
}

export interface CrediPalMilestone {
  id: string
  title: string
  description: string
  targetDate: string
  targetAmount: number
  currentAmount: number
  progress: number
  miniGoals: CrediPalMiniGoal[]
  status: 'pending' | 'in_progress' | 'completed'
}

export interface CrediPalMiniGoal {
  id: string
  title: string
  emoji: string
  targetAmount: number
  currentAmount: number
  isCompleted: boolean
  celebrationMessage?: string
}

export interface CrediPalMonthlyBudget {
  essentialNeeds: number
  flexibleSpending: number
  debtAndSavingsPercentage: number
  debtAndSavingsAmount: number
  explanation: string
}

export interface CrediPalDebtPayoff {
  totalDebt: number
  monthlyPayment: number
  payoffSchedule: Array<{
    creditor: string
    amount: number
    monthsToPayoff: number
    interestSaved: number
  }>
  totalInterestSaved: number
}

export interface CrediPalNetWorthGrowth {
  year1Target: number
  year3Target: number
  year5Target: number
  monthlyInvestment: number
  growthExplanation: string
}

export interface CrediPalProgressTracker {
  quarters: Array<{
    quarter: string
    savingsTarget: number
    debtReductionTarget: number
    progressPercentage: number
    milestoneReached?: string
  }>
  actionPlan: Array<{
    phase: string
    timeframe: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export interface CrediPalCompletePlan {
  id: string
  userId: string
  isActive: boolean
  
  // Metodología 3.2.1
  snapshot: CrediPalSnapshot
  milestones: CrediPalMilestone[]
  monthlyBudget: CrediPalMonthlyBudget
  debtPayoff: CrediPalDebtPayoff
  netWorthGrowth: CrediPalNetWorthGrowth
  progressTracker: CrediPalProgressTracker
  
  // Sistema motivacional
  motivationalMessage: string
  nextMiniGoal: CrediPalMiniGoal
  
  // Metadata
  createdAt: string
  updatedAt: string
  lastMotivationalMessageAt?: string
}

export class CrediPalPlanGenerator {
  static generateCompletePlan(consolidatedData: any): CrediPalCompletePlan {
    const snapshot = this.createSnapshot(consolidatedData)
    const milestones = this.create321Milestones(consolidatedData)
    const monthlyBudget = this.createMonthlyBudget(consolidatedData)
    const debtPayoff = this.createDebtPayoffPlan(consolidatedData)
    const netWorthGrowth = this.createNetWorthGrowth(consolidatedData)
    const progressTracker = this.createProgressTracker(consolidatedData, milestones)
    
    return {
      id: `credipal-${Date.now()}`,
      userId: 'current-user', // Will be replaced with actual user ID
      isActive: true,
      snapshot,
      milestones,
      monthlyBudget,
      debtPayoff,
      netWorthGrowth,
      progressTracker,
      motivationalMessage: this.generateInitialMotivationalMessage(snapshot),
      nextMiniGoal: milestones[0]?.miniGoals[0] || this.createWelcomeMiniGoal(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private static createSnapshot(data: any): CrediPalSnapshot {
    const netIncome = data.monthlyIncome || 0
    const expenses = data.monthlyExpenses || 0
    const debt = data.totalDebtBalance || 0
    const savings = data.currentSavings || 0
    
    // Proyección año 1 (si sigue el plan)
    const monthlySurplus = netIncome - expenses
    const projectedDebtReduction = Math.min(debt, monthlySurplus * 0.7 * 12) // 70% del surplus para deuda
    const projectedSavings = savings + (monthlySurplus * 0.3 * 12) // 30% para ahorro
    
    const projectedYear1Position = debt > projectedDebtReduction 
      ? `Deuda reducida a $${(debt - projectedDebtReduction).toLocaleString()} + $${projectedSavings.toLocaleString()} ahorrados`
      : `Libre de deuda + $${(projectedSavings + (projectedDebtReduction - debt)).toLocaleString()} ahorrados`

    return {
      monthlyNetIncome: netIncome,
      monthlyExpenses: expenses,
      initialDebt: debt,
      currentSavings: savings,
      projectedYear1Position
    }
  }

  private static create321Milestones(data: any): CrediPalMilestone[] {
    const milestones: CrediPalMilestone[] = []
    
    // Milestone 1: Eliminar deudas de alto interés (primeros 4-6 meses)
    if (data.totalDebtBalance > 0) {
      milestones.push({
        id: 'eliminate-high-interest-debt',
        title: 'Eliminar Deudas de Alto Interés',
        description: 'Liberarte de las deudas más costosas para ahorrar en intereses',
        targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        targetAmount: data.totalDebtBalance,
        currentAmount: 0,
        progress: 0,
        status: 'pending',
        miniGoals: this.createDebtMiniGoals(data.totalDebtBalance)
      })
    }

    // Milestone 2: Construir fondo de emergencia (meses 4-8)
    const emergencyFund = data.monthlyExpenses * 6
    milestones.push({
      id: 'emergency-fund',
      title: 'Fondo de Emergencia',
      description: 'Crear tu colchón financiero de 6 meses de gastos',
      targetDate: new Date(Date.now() + 8 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      targetAmount: emergencyFund,
      currentAmount: data.currentSavings,
      progress: Math.min((data.currentSavings / emergencyFund) * 100, 100),
      status: data.currentSavings > 0 ? 'in_progress' : 'pending',
      miniGoals: this.createEmergencyFundMiniGoals(emergencyFund, data.currentSavings)
    })

    // Milestone 3: Ahorro e inversión a largo plazo (meses 6-12)
    const longTermTarget = data.monthlyIncome * 3 // 3 meses de ingresos como meta inicial
    milestones.push({
      id: 'long-term-investment',
      title: 'Ahorro e Inversión',
      description: 'Comenzar tu camino hacia la independencia financiera',
      targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      targetAmount: longTermTarget,
      currentAmount: 0,
      progress: 0,
      status: 'pending',
      miniGoals: this.createInvestmentMiniGoals(longTermTarget)
    })

    return milestones
  }

  private static createDebtMiniGoals(totalDebt: number): CrediPalMiniGoal[] {
    const goals = []
    const milestones = [0.25, 0.5, 0.75, 1.0] // 25%, 50%, 75%, 100%
    const emojis = ['🎯', '💪', '🔥', '🎉']
    
    milestones.forEach((percentage, index) => {
      goals.push({
        id: `debt-${percentage * 100}`,
        title: `${percentage * 100}% de Deuda Eliminada`,
        emoji: emojis[index],
        targetAmount: totalDebt * percentage,
        currentAmount: 0,
        isCompleted: false,
        celebrationMessage: percentage === 1 
          ? '¡Increíble! ¡Estás libre de deudas! 🎉' 
          : `¡Excelente progreso! Ya eliminaste el ${percentage * 100}% de tu deuda 💪`
      })
    })
    
    return goals
  }

  private static createEmergencyFundMiniGoals(targetAmount: number, currentAmount: number): CrediPalMiniGoal[] {
    const goals = []
    const amounts = [1000, 2500, 5000, targetAmount] // Hitos monetarios
    const emojis = ['🛡️', '💎', '🏦', '👑']
    
    amounts.forEach((amount, index) => {
      if (amount <= targetAmount) {
        goals.push({
          id: `emergency-${amount}`,
          title: `$${amount.toLocaleString()} en Emergencias`,
          emoji: emojis[index],
          targetAmount: amount,
          currentAmount: Math.min(currentAmount, amount),
          isCompleted: currentAmount >= amount,
          celebrationMessage: amount === targetAmount 
            ? '¡Tu fondo de emergencia está completo! Tienes 6 meses cubiertos 👑' 
            : `¡Genial! Ya tienes $${amount.toLocaleString()} protegidos 🛡️`
        })
      }
    })
    
    return goals
  }

  private static createInvestmentMiniGoals(targetAmount: number): CrediPalMiniGoal[] {
    const goals = []
    const percentages = [0.1, 0.25, 0.5, 1.0] // 10%, 25%, 50%, 100%
    const emojis = ['🌱', '🌿', '🌳', '🏆']
    
    percentages.forEach((percentage, index) => {
      goals.push({
        id: `investment-${percentage * 100}`,
        title: `${percentage * 100}% de Meta de Inversión`,
        emoji: emojis[index],
        targetAmount: targetAmount * percentage,
        currentAmount: 0,
        isCompleted: false,
        celebrationMessage: percentage === 1 
          ? '¡Felicitaciones! Estás construyendo verdadera riqueza 🏆' 
          : `¡Tu dinero está creciendo! ${percentage * 100}% completado 🌱`
      })
    })
    
    return goals
  }

  private static createMonthlyBudget(data: any): CrediPalMonthlyBudget {
    const income = data.monthlyIncome || 0
    const expenses = data.monthlyExpenses || 0
    const surplus = income - expenses
    
    // Regla 20% para deuda y ahorro del surplus disponible
    const debtAndSavingsPercentage = 20
    const debtAndSavingsAmount = Math.max(surplus * 0.2, 0)
    
    return {
      essentialNeeds: expenses,
      flexibleSpending: surplus * 0.8, // 80% del surplus para flexibilidad
      debtAndSavingsPercentage,
      debtAndSavingsAmount,
      explanation: `Con $${income.toLocaleString()} mensuales: cubre tus gastos esenciales de $${expenses.toLocaleString()}, mantén $${(surplus * 0.8).toLocaleString()} para gastos flexibles, y destina $${debtAndSavingsAmount.toLocaleString()} para avanzar hacia tus metas financieras.`
    }
  }

  private static createDebtPayoffPlan(data: any): CrediPalDebtPayoff {
    const totalDebt = data.totalDebtBalance || 0
    const monthlyPayment = data.totalMonthlyDebtPayments || 0
    
    const payoffSchedule = (data.debts || []).map((debt: any) => ({
      creditor: debt.creditor,
      amount: debt.current_balance,
      monthsToPayoff: debt.monthly_payment > 0 ? Math.ceil(debt.current_balance / debt.monthly_payment) : 0,
      interestSaved: Math.round(debt.current_balance * (debt.interest_rate / 100) * 0.5) // Estimado
    }))
    
    const totalInterestSaved = payoffSchedule.reduce((sum, item) => sum + item.interestSaved, 0)
    
    return {
      totalDebt,
      monthlyPayment,
      payoffSchedule,
      totalInterestSaved
    }
  }

  private static createNetWorthGrowth(data: any): CrediPalNetWorthGrowth {
    const monthlySurplus = Math.max((data.monthlyIncome || 0) - (data.monthlyExpenses || 0), 0)
    const monthlyInvestment = monthlySurplus * 0.3 // 30% del surplus para inversión después de deudas
    
    // Proyecciones conservadoras (5% anual)
    const year1Target = monthlyInvestment * 12
    const year3Target = year1Target * 3 + (year1Target * 0.15) // Con crecimiento compuesto
    const year5Target = year1Target * 5 + (year1Target * 0.40) // Con crecimiento compuesto
    
    return {
      year1Target,
      year3Target,
      year5Target,
      monthlyInvestment,
      growthExplanation: `Invirtiendo $${monthlyInvestment.toLocaleString()} mensuales, en 5 años podrías tener $${year5Target.toLocaleString()}. Esto te acerca significativamente a la independencia financiera.`
    }
  }

  private static createProgressTracker(data: any, milestones: CrediPalMilestone[]): CrediPalProgressTracker {
    const quarters = [
      {
        quarter: 'Q1 2025',
        savingsTarget: 2500,
        debtReductionTarget: (data.totalDebtBalance || 0) * 0.25,
        progressPercentage: 0,
        milestoneReached: 'Fondo de emergencia inicial'
      },
      // ... más quarters
    ]
    
    const actionPlan = [
      {
        phase: 'Fase 1: Eliminación de Deuda',
        timeframe: 'Primeros 6 meses',
        description: 'Enfocar todos los recursos extra en eliminar deudas de alto interés',
        priority: 'high' as const
      },
      {
        phase: 'Fase 2: Construcción de Fondo',
        timeframe: 'Meses 4-8',
        description: 'Construir fondo de emergencia mientras terminas con las deudas',
        priority: 'high' as const
      },
      {
        phase: 'Fase 3: Crecimiento de Patrimonio',
        timeframe: 'Meses 6-12',
        description: 'Comenzar inversiones sistemáticas para el crecimiento a largo plazo',
        priority: 'medium' as const
      }
    ]
    
    return { quarters, actionPlan }
  }

  private static generateInitialMotivationalMessage(snapshot: CrediPalSnapshot): string {
    const messages = [
      `¡Bienvenido a tu nueva vida financiera! Con $${snapshot.monthlyNetIncome.toLocaleString()} mensuales, tienes el poder de cambiar tu futuro. En 12 meses podrías estar aquí: ${snapshot.projectedYear1Position}`,
      `¡Estoy emocionado de acompañarte! Tu situación actual es el punto de partida perfecto. Juntos vamos a transformar esos $${snapshot.monthlyNetIncome.toLocaleString()} mensuales en libertad financiera.`,
      `¡Tu coach financiero está aquí! He analizado tu situación y veo un potencial increíble. En un año podrías lograr: ${snapshot.projectedYear1Position}. ¡Empezamos YA!`
    ]
    
    return messages[Math.floor(Math.random() * messages.length)]
  }

  private static createWelcomeMiniGoal(): CrediPalMiniGoal {
    return {
      id: 'welcome-goal',
      title: 'Bienvenido a CrediPal',
      emoji: '🚀',
      targetAmount: 1,
      currentAmount: 1,
      isCompleted: true,
      celebrationMessage: '¡Perfecto! Ya diste el primer paso hacia tu libertad financiera 🚀'
    }
  }

  // Método para actualizar el plan cuando el usuario registra actividades
  static updatePlanWithNewData(currentPlan: CrediPalCompletePlan, newData: {
    type: 'payment' | 'expense' | 'income',
    amount: number,
    category?: string,
    debtId?: string
  }): CrediPalCompletePlan {
    const updatedPlan = { ...currentPlan }
    
    // Actualizar snapshot
    if (newData.type === 'payment' && newData.debtId) {
      // Actualizar progreso de deuda
      const debtMilestone = updatedPlan.milestones.find(m => m.id === 'eliminate-high-interest-debt')
      if (debtMilestone) {
        debtMilestone.currentAmount += newData.amount
        debtMilestone.progress = (debtMilestone.currentAmount / debtMilestone.targetAmount) * 100
        
        // Actualizar mini-goals
        debtMilestone.miniGoals.forEach(goal => {
          if (!goal.isCompleted && debtMilestone.currentAmount >= goal.targetAmount) {
            goal.isCompleted = true
            goal.currentAmount = goal.targetAmount
          }
        })
      }
    }
    
    // Generar nuevo mensaje motivacional
    updatedPlan.motivationalMessage = AIMotivationalService.generatePaymentCelebration(
      newData.amount, 
      {} as any // Simplified for now
    ).message
    
    updatedPlan.updatedAt = new Date().toISOString()
    updatedPlan.lastMotivationalMessageAt = new Date().toISOString()
    
    return updatedPlan
  }
}
