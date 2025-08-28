
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  MessageCircle, 
  User 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBottomNavigation } from '@/hooks/useBottomNavigation'
import { useDashboardNavigation } from '@/hooks/useDashboardNavigation'

export function BottomNavigation() {
  const location = useLocation()
  const { badges } = useBottomNavigation()
  const { canNavigate } = useDashboardNavigation()

  const navItems = [
    {
      name: 'Inicio',
      href: '/dashboard',
      icon: Home,
      badge: badges.home
    },
    {
      name: 'Movimientos',
      href: '/expenses',
      icon: CreditCard,
      badge: badges.movements
    },
    {
      name: 'Progreso',
      href: '/progress',
      icon: TrendingUp,
      badge: badges.progress
    },
    {
      name: 'Coach',
      href: '/coach',
      icon: MessageCircle,
      badge: badges.coach
    },
    {
      name: 'Perfil',
      href: '/profile',
      icon: User,
      badge: badges.profile
    }
  ]

  // Si no puede navegar, no mostrar la barra
  if (!canNavigate) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-colors relative",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-primary"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-1" />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
