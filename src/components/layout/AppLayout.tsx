
import React from 'react'
import { ChatBubble } from './ChatBubble'
import { BottomNavigation } from '../navigation/BottomNavigation'
import { useLocation } from 'react-router-dom'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  
  // Don't show ChatBubble on Coach page since it has fullscreen chat
  const showChatBubble = location.pathname !== '/coach'
  
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <main className="flex-1 overflow-auto pb-20">
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Chat bubble - only show when not on coach page */}
      {showChatBubble && <ChatBubble />}
      
      {/* Bottom Navigation - visible on all screen sizes */}
      <BottomNavigation />
    </div>
  )
}
