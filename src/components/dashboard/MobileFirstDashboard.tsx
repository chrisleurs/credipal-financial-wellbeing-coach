
import React from 'react'
import { CompactHeader } from './CompactHeader'
import { HeroFinancialCard } from './HeroFinancialCard'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { Plan321Section } from './Plan321Section'
import { MiniGoalsSection } from './MiniGoalsSection'
import { ActionPlanSection } from './ActionPlanSection'
import { QuickStatsGrid } from './QuickStatsGrid'
import { FloatingChatbot } from './FloatingChatbot'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'

export const MobileFirstDashboard = () => {
  const { isLoading } = useFinancialPlan()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-pulse space-y-4 w-full max-w-sm">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Header Compacto */}
      <CompactHeader />

      {/* Contenido Principal */}
      <div className="px-4 py-6 space-y-6 max-w-md mx-auto pb-24">
        {/* 2. Hero Card */}
        <HeroFinancialCard />

        {/* 3. Próximos Pagos */}
        <UpcomingPaymentsSection />

        {/* 4. Plan 3.2.1 */}
        <Plan321Section />

        {/* 5. Mini-Goals */}
        <MiniGoalsSection />

        {/* 6. Plan de Acción */}
        <ActionPlanSection />

        {/* 7. Quick Stats Grid */}
        <QuickStatsGrid />
      </div>

      {/* 8. Chatbot Flotante */}
      <FloatingChatbot />
    </div>
  )
}
