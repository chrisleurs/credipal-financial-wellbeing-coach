
import React from 'react'
import { MobileFirstDashboard } from '@/components/dashboard/MobileFirstDashboard'
import { FloatingChatbot } from '@/components/dashboard/FloatingChatbot'

export default function Dashboard() {
  return (
    <div className="relative min-h-screen">
      <MobileFirstDashboard />
      <FloatingChatbot />
    </div>
  )
}
