
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, DollarSign, TrendingUp, User, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBottomNavigation } from '@/hooks/useBottomNavigation'

export const BottomNavigation = () => {
  const location = useLocation()
  const { badges } = useBottomNavigation()
  
  const navItems = [
    {
      name: 'Inicio',
      path: '/dashboard',
      icon: Home,
      badge: badges.home
    },
    {
      name: 'Gastos', 
      path: '/expenses',
      icon: DollarSign,
      badge: badges.movements
    },
    {
      name: 'Progreso',
      path: '/progress', 
      icon: TrendingUp,
      badge: badges.progress
    },
    {
      name: 'Mi Plan',
      path: '/plan', // Cambiado de /coach a /plan
      icon: FileText,
      badge: badges.coach
    },
    {
      name: 'Perfil',
      path: '/profile',
      icon: User,
      badge: badges.profile
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 py-2 z-50">
      <nav className="flex items-center justify-around max-w-md mx-auto md:max-w-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => {
                if (item.badge && item.badge > 0) {
                  // Handle badge clicks if needed
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200",
                isActive ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {isActive ? (
                <item.icon className="w-5 h-5 mb-1 fill-current" />
              ) : (
                <item.icon className="w-5 h-5 mb-1" />
              )}
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
