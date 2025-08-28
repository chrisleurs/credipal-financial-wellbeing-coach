
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
import { useNavigate } from 'react-router-dom'

export const MobileFirstDashboard = () => {
  const { data: financialData, isLoading: isLoadingData } = useUnifiedFinancialData()
  const { activePlan, isLoadingPlan, canGeneratePlan } = useFinancialPlanManager()
  const navigate = useNavigate()

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

  // Handle plan generation completion
  const handlePlanGenerated = () => {
    navigate('/dashboard')
  }

  // Show plan generation if no active plan exists
  if (!activePlan && canGeneratePlan && !isLoadingPlan) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <DataCleanupDashboard />
        <PlanGenerationFlow onPlanGenerated={handlePlanGenerated} />
      </div>
    )
  }

  // Transform activeGoals to match BigGoal interface
  const transformedGoals = financialData.activeGoals.map((goal, index) => ({
    id: `goal-${index}`,
    title: goal.title,
    targetAmount: goal.target,
    currentAmount: goal.current,
    progress: goal.progress,
    status: 'active' as const,
    emoji: '🎯', // Default emoji, could be enhanced based on goal type
    timeline: undefined // Optional field
  }))

  // Handle goal updates
  const handleUpdateGoal = async (goalId: string, updates: any) => {
    console.log('Updating goal:', goalId, updates)
    // TODO: Implement goal update logic
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
      <BigGoalsSection 
        goals={transformedGoals}
        onUpdateGoal={handleUpdateGoal}
        isUpdating={false}
      />
      
      {/* Action Plan Section */}
      <ActionPlanSection />
      
      {/* Charts Section */}
      <ChartSection />
      
      {/* Upcoming Payments */}
      <UpcomingPaymentsSection />
    </div>
  )
}
