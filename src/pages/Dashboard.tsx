
import React from 'react'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { CrediPalDashboard } from '@/components/dashboard/CrediPalDashboard'
import { PlanGenerationScreen } from '@/components/dashboard/PlanGenerationScreen'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Dashboard() {
  const { consolidatedData, isLoading: isDataLoading } = useConsolidatedFinancialData()
  const { 
    generatedPlan, 
    hasPlan, 
    isGenerating, 
    generatePlan 
  } = useFinancialPlanGenerator()

  if (isDataLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Cargando tu dashboard financiero..." />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {hasPlan && generatedPlan ? (
        <CrediPalDashboard />
      ) : (
        <PlanGenerationScreen 
          consolidatedData={consolidatedData}
          isGenerating={isGenerating}
          onGeneratePlan={generatePlan}
        />
      )}
    </AppLayout>
  )
}
