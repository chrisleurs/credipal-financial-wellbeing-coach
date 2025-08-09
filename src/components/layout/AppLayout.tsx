
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
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50 flex">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          
          <main className="flex-1 overflow-auto">
            <div className="h-full w-full">
              <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Chat flotante con posición fija */}
        <div className="fixed bottom-4 right-4 z-50">
          <ChatBubble />
        </div>
      </div>
    </SidebarProvider>
  )
}
