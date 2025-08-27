
import React, { useEffect } from 'react'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { HeroFinancialCard } from './HeroFinancialCard'
import { QuickStatsGrid } from './QuickStatsGrid'
import { ActionPlanSection } from './ActionPlanSection'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { FinancialGoalsSection } from './FinancialGoalsSection'
import { SmartRecommendations } from './SmartRecommendations'
import { CrediAssistant } from './CrediAssistant'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const MobileFirstDashboard = () => {
  const { onboardingCompleted } = useOnboardingStatus()
  const { data: financialData, isLoading: isLoadingData } = useOptimizedFinancialData()
  const { 
    activePlan, 
    hasPlan, 
    generatePlan, 
    isGenerating, 
    isLoadingPlan 
  } = useFinancialPlanManager()

  // Auto-generar plan después del onboarding si no existe
  useEffect(() => {
    const shouldAutoGeneratePlan = async () => {
      // Solo generar si:
      // 1. El onboarding está completado
      // 2. No hay un plan activo
      // 3. Hay datos financieros disponibles
      // 4. No está generando actualmente
      if (
        onboardingCompleted && 
        !hasPlan && 
        !isGenerating && 
        !isLoadingPlan &&
        financialData?.hasRealData &&
        financialData?.monthlyIncome > 0
      ) {
        console.log('🎯 Auto-generando plan financiero después del onboarding')
        
        const planData = {
          monthlyIncome: financialData.monthlyIncome,
          monthlyExpenses: financialData.monthlyExpenses,
          currentSavings: financialData.currentSavings || 0,
          savingsCapacity: financialData.savingsCapacity,
          debts: financialData.activeDebts.map(debt => ({
            name: debt.creditor,
            amount: debt.balance,
            monthlyPayment: debt.payment
          })),
          goals: financialData.activeGoals.map(goal => goal.title),
          expenseCategories: financialData.expenseCategories || {}
        }
        
        await generatePlan(planData)
      }
    }

    // Pequeño delay para asegurar que los datos estén listos
    if (!isLoadingData && onboardingCompleted) {
      setTimeout(shouldAutoGeneratePlan, 1000)
    }
  }, [
    onboardingCompleted, 
    hasPlan, 
    isGenerating, 
    isLoadingPlan, 
    isLoadingData,
    financialData,
    generatePlan
  ])

  // Loading state
  if (isLoadingData || isLoadingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu dashboard financiero..." />
      </div>
    )
  }

  // Auto-generation in progress
  if (isGenerating && !hasPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Generando tu plan financiero personalizado..." />
      </div>
    )
  }

  // Preparar datos para los componentes
  const mappedGoals = financialData?.activeGoals.map(goal => ({
    id: goal.title,
    title: goal.title,
    targetAmount: goal.target,
    currentAmount: goal.current,
    progress: goal.progress,
    source: 'database' as const
  })) || []

  const consolidatedData = {
    monthlyIncome: financialData?.monthlyIncome || 0,
    monthlyExpenses: financialData?.monthlyExpenses || 0,
    currentSavings: financialData?.currentSavings || 0,
    savingsCapacity: financialData?.savingsCapacity || 0,
    totalDebtBalance: financialData?.totalDebtBalance || 0,
    totalMonthlyDebtPayments: financialData?.totalMonthlyDebtPayments || 0
  }

  const defaultMessage = {
    id: '1',
    text: '¡Hola! Soy CrediPal, tu asistente financiero. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date().toISOString(),
    type: 'motivational' as const
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Hero Card */}
        <div className="mb-6">
          <HeroFinancialCard />
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <QuickStatsGrid />
        </div>

        {/* Plan de Acción - Solo si hay plan activo */}
        {hasPlan && activePlan && (
          <div className="mb-6">
            <ActionPlanSection />
          </div>
        )}

        {/* Próximos Pagos */}
        <div className="mb-6">
          <UpcomingPaymentsSection />
        </div>

        {/* Metas Financieras */}
        <div className="mb-6">
          <FinancialGoalsSection goals={mappedGoals} />
        </div>

        {/* Recomendaciones Inteligentes */}
        <div className="mb-6">
          <SmartRecommendations consolidatedData={consolidatedData} />
        </div>

        {/* Asistente CrediPal */}
        <CrediAssistant 
          message={defaultMessage}
          onChat={() => console.log('Chat activated')}
        />
      </div>
    </div>
  )
}
