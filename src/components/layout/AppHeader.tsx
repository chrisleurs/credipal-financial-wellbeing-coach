import React from 'react'
import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'

export function AppHeader() {
  const { user } = useAuth()
  
  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-card">
      {/* Left side - Mobile trigger */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Bienvenido a Credipal
          </h1>
          <p className="text-sm text-muted-foreground">
            Tu plataforma de bienestar financiero
          </p>
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 ml-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">
              {user?.email?.split('@')[0] || 'Usuario'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}