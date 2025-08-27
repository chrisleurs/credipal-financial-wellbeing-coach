
import React from 'react'
import { MobileFirstDashboard } from '@/components/dashboard/MobileFirstDashboard'
import { AppLayout } from '@/components/layout/AppLayout'
import { useOnboardingDataMigration } from '@/hooks/useOnboardingDataMigration'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Dashboard() {
  const { isMigrating } = useOnboardingDataMigration()

  if (isMigrating) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Sincronizando tu información financiera..." />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen pb-16">
        <MobileFirstDashboard />
      </div>
    </AppLayout>
  )
}
