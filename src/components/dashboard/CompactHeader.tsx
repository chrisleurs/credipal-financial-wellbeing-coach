
import React from 'react'
import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'

export const CompactHeader = () => {
  const { user } = useAuth()

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    }
    return 'Usuario'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = getUserName()
    
    if (hour < 12) return `¡Hola ${name}!`
    if (hour < 18) return `¡Buenas tardes ${name}!`
    return `¡Buenas noches ${name}!`
  }

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden hover:bg-muted rounded-lg p-2 transition-colors" />
          <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">CP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{getGreeting()}</h1>
            <p className="text-xs text-gray-500">Tu coach financiero</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
          >
            <div className="relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F59E0B] rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Avatar className="h-8 w-8 ring-2 ring-[#10B981]/20 ml-2">
            <AvatarFallback className="bg-[#10B981] text-white text-xs font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
