
import React from 'react'
import { CompactHeader } from './CompactHeader'
import { QuickStatsGrid } from './QuickStatsGrid'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { CrediPalPlanSection } from './CrediPalPlanSection'
import { Plan321Section } from './Plan321Section'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function MobileFirstDashboard() {
  const { consolidatedData, isLoading, error } = useConsolidatedFinancialData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    )
  }

  if (error || !consolidatedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error cargando los datos financieros</p>
          <button onClick={() => window.location.reload()} className="text-blue-500">
            Intentar nuevamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompactHeader />
      
      <div className="px-4 py-6 space-y-6">
        <QuickStatsGrid />
        <UpcomingPaymentsSection />
        <CrediPalPlanSection consolidatedData={consolidatedData} />
        <Plan321Section />
      </div>
    </div>
  )
}
