
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { useOptimizedOnboardingConsolidation } from '@/hooks/useOptimizedOnboardingConsolidation'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { PlanGenerationFlow } from '@/components/plan/PlanGenerationFlow'
import { useToast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { PlanGenerationData } from '@/types/financialPlan'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [planGenerated, setPlanGenerated] = useState(false)
  
  const { data: financialData, isLoading: isLoadingData } = useOptimizedFinancialData()
  const { consolidateData, isConsolidating } = useOptimizedOnboardingConsolidation()
  const { updateOnboardingStatus } = useOnboardingStatus()

  // Consolidar datos al inicio si es necesario
  useEffect(() => {
    const consolidateIfNeeded = async () => {
      if (!isConsolidating && !planGenerated) {
        try {
          await consolidateData(false) // No marcar como completado aún
        } catch (error) {
          console.error('Error consolidating data:', error)
        }
      }
    }

    consolidateIfNeeded()
  }, [consolidateData, isConsolidating, planGenerated])

  // Preparar datos para generación del plan
  const planGenerationData: PlanGenerationData | null = React.useMemo(() => {
    if (!financialData || !financialData.hasRealData) return null

    return {
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
  }, [financialData])

  const handlePlanGenerated = async () => {
    try {
      setPlanGenerated(true)
      
      toast({
        title: "¡Plan generado exitosamente!",
        description: "Redirigiendo a tu dashboard..."
      })
      
      // Marcar onboarding como completado
      await updateOnboardingStatus(true)
      
      // Pequeña pausa para mejor UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navegar al dashboard
      navigate('/dashboard', { replace: true })
      
    } catch (error) {
      console.error('Error completing onboarding:', error)
      
      toast({
        title: "Error al completar configuración",
        description: "Redirigiendo al dashboard...",
        variant: "destructive"
      })
      
      // Navegar al dashboard de todas formas
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1000)
    }
  }

  // Loading states
  if (isLoadingData || isConsolidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text={isConsolidating ? "Consolidando información..." : "Cargando datos financieros..."} 
        />
      </div>
    )
  }

  // Si no hay datos suficientes, redirigir al onboarding
  if (!planGenerationData) {
    React.useEffect(() => {
      navigate('/onboarding', { replace: true })
    }, [navigate])
    
    return null
  }

  return (
    <PlanGenerationFlow 
      planData={planGenerationData}
      onPlanGenerated={handlePlanGenerated}
    />
  )
}
