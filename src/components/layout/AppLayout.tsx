
import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { ChatBubble } from './ChatBubble'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false} collapsibleWidth="56px">
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          
          <main className="flex-1 overflow-auto">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>

        <ChatBubble />
      </div>
    </SidebarProvider>
  )
}
