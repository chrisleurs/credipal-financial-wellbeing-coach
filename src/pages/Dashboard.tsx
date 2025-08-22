
import React from 'react'
import { MobileFirstDashboard } from '@/components/dashboard/MobileFirstDashboard'
import { FloatingChatBot } from '@/components/dashboard/FloatingChatBot'

export default function Dashboard() {
  return (
    <div className="relative min-h-screen">
      <MobileFirstDashboard />
      <FloatingChatBot />
    </div>
  )
}
