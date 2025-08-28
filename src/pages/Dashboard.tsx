
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { FinancialDashboard } from '@/components/dashboard/FinancialDashboard'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No user found</p>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <FinancialDashboard userId={user.id} />
      </div>
    </AppLayout>
  )
}
