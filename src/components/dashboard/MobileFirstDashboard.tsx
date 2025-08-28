
import React from 'react'
import { FinancialSummary } from './FinancialSummary'
import { QuickStatsGrid } from './QuickStatsGrid'
import { BigGoalsSection } from './BigGoalsSection'
import { ActionPlanSection } from './ActionPlanSection'
import { ChartSection } from './ChartSection'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { PlanGenerationFlow } from '@/components/plan/PlanGenerationFlow'
import { DataCleanupDashboard } from '@/components/debug/DataCleanupDashboard'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const MobileFirstDashboard = () => {
  const { data: financialData, isLoading: isLoadingData } = useUnifiedFinancialData()
  const { activePlan, isLoadingPlan, canGeneratePlan } = useFinancialPlanManager()

  // Loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando datos financieros unificados..." />
      </div>
    )
  }

  // No data state - redirect to onboarding or show empty state
  if (!financialData?.hasRealData) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Dashboard Financiero</h1>
        
        <DataCleanupDashboard />
        
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            No hay datos financieros disponibles
          </h2>
          <p className="text-gray-600 mb-6">
            Completa el proceso de onboarding para ver tu dashboard.
          </p>
        </div>
      </div>
    )
  }

  // Show plan generation if no active plan exists
  if (!activePlan && canGeneratePlan && !isLoadingPlan) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <DataCleanupDashboard />
        <PlanGenerationFlow />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard Financiero</h1>
      
      {/* Data cleanup status - only show if there are issues */}
      <DataCleanupDashboard />
      
      {/* Financial Summary Cards */}
      <FinancialSummary />
      
      {/* Quick Stats */}
      <QuickStatsGrid />
      
      {/* Goals Section */}
      <BigGoalsSection />
      
      {/* Action Plan Section */}
      <ActionPlanSection />
      
      {/* Charts Section */}
      <ChartSection />
      
      {/* Upcoming Payments */}
      <UpcomingPaymentsSection />
    </div>
  )
}
