
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Receipt, TrendingUp, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badge?: boolean
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: Home, path: '/dashboard' },
  { id: 'movements', label: 'Movimientos', icon: Receipt, path: '/expenses' },
  { id: 'progress', label: 'Progreso', icon: TrendingUp, path: '/progress' },
  { id: 'coach', label: 'Coach', icon: MessageCircle, path: '/coach', badge: true },
  { id: 'profile', label: 'Perfil', icon: User, path: '/profile' }
]

export function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = (item: NavItem) => {
    if (item.id === 'coach') {
      // Para Coach, abrir ChatBubble en modo fullscreen
      // Por ahora navegamos a una ruta específica, luego conectaremos con ChatBubble
      navigate('/coach')
    } else {
      navigate(item.path)
    }
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200",
                "min-w-0 flex-1 relative",
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 mb-1", active && "scale-110")} />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium truncate",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
