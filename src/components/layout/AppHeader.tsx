
import React from 'react'
import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

export function AppHeader() {
  const { user } = useAuth()
  const { t } = useLanguage()
  
  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <header className="h-16 border-b border-border/60 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left side - Mobile trigger only */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden hover:bg-muted rounded-lg p-2 transition-colors" />
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-foreground">
            {t('dashboard')}
          </h1>
        </div>
      </div>

      {/* Right side - Simplified user actions */}
      <div className="flex items-center gap-2">
        <LanguageToggle variant="dashboard" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-border/60">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">
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
