
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, DollarSign, TrendingUp, User, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardNavigation } from '@/hooks/useDashboardNavigation'

interface NavItemProps {
  name: string
  path: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const BottomNavigation = () => {
  const location = useLocation()
  const { navigateTo, canNavigate } = useDashboardNavigation()

  const navItems = [
    { 
      name: 'Inicio', 
      path: '/dashboard', 
      icon: Home,
      activeIcon: Home 
    },
    { 
      name: 'Mi Plan', 
      path: '/coach', 
      icon: FileText,
      activeIcon: FileText 
    },
    { 
      name: 'Progreso', 
      path: '/progress', 
      icon: TrendingUp,
      activeIcon: TrendingUp 
    },
    { 
      name: 'Gastos', 
      path: '/expenses', 
      icon: DollarSign,
      activeIcon: DollarSign 
    },
    { 
      name: 'Perfil', 
      path: '/profile', 
      icon: User,
      activeIcon: User 
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 py-2 z-50">
      <nav className="flex items-center justify-around max-w-md mx-auto md:max-w-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={(e) => {
                e.preventDefault()
                if (canNavigate) {
                  navigateTo(item.path)
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200",
                isActive ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {isActive ? (
                <item.activeIcon className="w-5 h-5 mb-1" />
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
