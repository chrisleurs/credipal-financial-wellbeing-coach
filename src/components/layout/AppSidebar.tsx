
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useDashboardNavigation } from '@/hooks/useDashboardNavigation'
import {
  Home,
  DollarSign,
  CreditCard,
  Calendar,
  TrendingUp,
  FileText,
  Target,
  User,
  MessageCircle
} from 'lucide-react'

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Mi Plan', href: '/coach', icon: FileText },
  { name: 'Progreso', href: '/progress', icon: TrendingUp },
  { name: 'Gastos', href: '/expenses', icon: DollarSign },
  { name: 'Deudas', href: '/debts', icon: CreditCard },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
  { name: 'Perfil', href: '/profile', icon: User },
]

export function AppSidebar() {
  const location = useLocation()
  const { navigateTo, canNavigate } = useDashboardNavigation()

  const handleNavigation = (href: string) => {
    if (canNavigate) {
      navigateTo(href)
    }
  }

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">CrediPal</span>
            </div>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  disabled={!canNavigate}
                  className={cn(
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    !canNavigate && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
