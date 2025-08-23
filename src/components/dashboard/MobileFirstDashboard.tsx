
import React from 'react'
import { CompactHeader } from './CompactHeader'
import { QuickStatsGrid } from './QuickStatsGrid'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { CrediPalPlanSection } from './CrediPalPlanSection'
import { Plan321Section } from './Plan321Section'

export function MobileFirstDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CompactHeader />
      
      <div className="px-4 py-6 space-y-6">
        <QuickStatsGrid />
        <UpcomingPaymentsSection />
        <CrediPalPlanSection />
        <Plan321Section />
      </div>
    </div>
  )
}
