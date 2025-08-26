
import React, { useState, useEffect } from 'react'
import { useAIFinancialPlan } from '@/hooks/useAIFinancialPlan'
import { AIGeneratedPlanDashboard } from './AIGeneratedPlanDashboard'
import { OptimizedFinancialDashboard } from './OptimizedFinancialDashboard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const MobileFirstDashboard = () => {
  const { hasActivePlan, parsedPlan, isLoadingPlan } = useAIFinancialPlan()
  const [showingLoader, setShowingLoader] = useState(true)

  // Control loading state to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🎛️ Dashboard: Forcing end of loading state after timeout')
      setShowingLoader(false)
    }, 3000) // Maximum 3 seconds of loading

    // If not loading from hook, hide loader immediately
    if (!isLoadingPlan) {
      console.log('🎛️ Dashboard: AI plan loading complete, hiding loader')
      setShowingLoader(false)
      clearTimeout(timer)
    }

    return () => clearTimeout(timer)
  }, [isLoadingPlan])

  // Show loading only briefly and with timeout protection
  if (showingLoader && isLoadingPlan) {
    console.log('🎛️ Dashboard: Showing loading spinner...')
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu dashboard..." />
      </div>
    )
  }

  console.log('🎛️ Dashboard: Deciding which dashboard to show:', {
    hasActivePlan,
    hasParsedPlan: !!parsedPlan,
    isLoadingPlan,
    showingLoader
  })

  // Si tiene un plan generado por IA, mostrar el dashboard AI
  if (hasActivePlan && parsedPlan) {
    console.log('🤖 Dashboard: Showing AI Generated Dashboard')
    return <AIGeneratedPlanDashboard />
  }

  // Mostrar el dashboard optimizado original
  console.log('📊 Dashboard: Showing Optimized Financial Dashboard')
  return <OptimizedFinancialDashboard />
}
