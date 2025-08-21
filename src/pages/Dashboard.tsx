
import React from 'react'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { CrediPalDashboard } from '@/components/dashboard/CrediPalDashboard'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Dashboard() {
  const { consolidatedData, isLoading: isDataLoading } = useConsolidatedFinancialData()
  const { hasActivePlan, isLoading: isPlanLoading } = useFinancialPlan()

  if (isDataLoading || isPlanLoading) {
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
      <CrediPalDashboard />
    </AppLayout>
  )
}
