
import React from 'react'
import { FinancialSummary } from './FinancialSummary'
import { QuickStatsGrid } from './QuickStatsGrid'
import { BigGoalsSection } from './BigGoalsSection'
import { ActionPlanSection } from './ActionPlanSection'
import { ChartSection } from './ChartSection'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { PlanGenerationFlow } from '@/components/plan/PlanGenerationFlow'
import { DataCleanupDashboard } from '@/components/debug/DataCleanupDashboard'
import { useUserSpecificData } from '@/hooks/useUserSpecificData'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

export const MobileFirstDashboard = () => {
  const { data: financialData, isLoading: isLoadingData, error } = useUserSpecificData()
  const { activePlan, isLoadingPlan, canGeneratePlan } = useFinancialPlanManager()
  const navigate = useNavigate()

  // Loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando datos específicos del usuario..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Dashboard Financiero</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error cargando datos del usuario
          </h2>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
          <p className="text-sm text-red-500">
            Usuario ID: {financialData?.userId || 'No disponible'}
          </p>
        </div>
        
        <DataCleanupDashboard />
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
          <p className="text-gray-600 mb-2">
            Completa el proceso de onboarding para ver tu dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Usuario: {financialData?.userId} | Fuente: {financialData?.dataSource}
          </p>
          <button 
            onClick={() => navigate('/onboarding')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ir al Onboarding
          </button>
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
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-blue-800 mb-1">
          Información del Usuario
        </h2>
        <p className="text-xs text-blue-600">
          ID: {financialData.userId} | Fuente: {financialData.dataSource} | 
          Onboarding: {financialData.profileData.onboardingCompleted ? 'Completado' : 'Pendiente'} |
          Última actualización: {new Date(financialData.lastUpdated).toLocaleString()}
        </p>
      </div>

      <h1 className="text-2xl font-bold mb-6">Dashboard Financiero</h1>
      
      {/* Data cleanup status */}
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
