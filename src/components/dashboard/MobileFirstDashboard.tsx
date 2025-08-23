
import React from 'react'
import { HeroFinancialCard } from './HeroFinancialCard'
import { Plan321Section } from './Plan321Section'
import { MiniGoalsSection } from './MiniGoalsSection'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { CompactHeader } from './CompactHeader'

export const MobileFirstDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pb-20">
      <CompactHeader />
      <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
        <HeroFinancialCard />
        <Plan321Section />
        <MiniGoalsSection />
        <UpcomingPaymentsSection />
      </div>
    </div>
  )
}
