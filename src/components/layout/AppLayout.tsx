
import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Chat bubble - only show when not on coach page */}
        {showChatBubble && <ChatBubble />}
        
        {/* Bottom Navigation - mobile only */}
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      </div>
    </SidebarProvider>
  )
}
