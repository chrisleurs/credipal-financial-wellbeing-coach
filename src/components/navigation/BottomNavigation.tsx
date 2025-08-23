
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Receipt, TrendingUp, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useBottomNavigation } from '@/hooks/useBottomNavigation'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badgeKey: keyof ReturnType<typeof useBottomNavigation>['badges']
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: Home, path: '/dashboard', badgeKey: 'home' },
  { id: 'movements', label: 'Movimientos', icon: Receipt, path: '/expenses', badgeKey: 'movements' },
  { id: 'progress', label: 'Progreso', icon: TrendingUp, path: '/progress', badgeKey: 'progress' },
  { id: 'coach', label: 'Coach', icon: MessageCircle, path: '/coach', badgeKey: 'coach' },
  { id: 'profile', label: 'Perfil', icon: User, path: '/profile', badgeKey: 'profile' }
]

export function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { badges } = useBottomNavigation()

  const handleNavigation = (item: NavItem) => {
    // Add haptic feedback for iOS if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
    
    navigate(item.path)
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          const badgeCount = badges[item.badgeKey]
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200",
                "min-w-0 flex-1 relative group",
                active 
                  ? "text-primary bg-primary/10 scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 mb-1 transition-transform duration-200", 
                  active && "scale-110",
                  "group-hover:scale-105"
                )} />
                
                {/* Notification Badges */}
                {badgeCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </Badge>
                )}
                
                {/* Special Coach indicator */}
                {item.id === 'coach' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse">
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </div>
              
              <span className={cn(
                "text-xs font-medium truncate transition-all duration-200",
                active && "font-semibold",
                "group-hover:font-medium"
              )}>
                {item.label}
              </span>
              
              {/* Active indicator line */}
              {active && (
                <div className="absolute top-0 w-8 h-0.5 bg-primary rounded-full animate-scale-in" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
