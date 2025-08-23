
import React from 'react'
import { MobileFirstDashboard } from '@/components/dashboard/MobileFirstDashboard'
import { AppLayout } from '@/components/layout/AppLayout'

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="relative min-h-screen pb-16"> {/* Added bottom padding for navigation */}
        <MobileFirstDashboard />
      </div>
    </AppLayout>
  )
}
