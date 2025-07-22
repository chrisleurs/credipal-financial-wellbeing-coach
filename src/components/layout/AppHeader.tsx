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
    <header className="h-20 border-b border-border/60 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left side - Mobile trigger */}
      <div className="flex items-center gap-6">
        <SidebarTrigger className="lg:hidden hover:bg-muted rounded-lg p-2 transition-colors" />
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Credipal
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Bienestar Financiero
          </p>
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border/60">
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-foreground">
              {user?.email?.split('@')[0] || 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground">
              Plan Premium
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}