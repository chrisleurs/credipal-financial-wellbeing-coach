
import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  CreditCard, 
  Target, 
  Calendar,
  PiggyBank,
  TrendingUp,
  Home,
  Settings,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const navigationItems = [
  {
    name: 'Resumen',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Gastos & Ingresos',
    href: '/expenses',
    icon: BarChart3,
  },
  {
    name: 'Deudas',
    href: '/debts',
    icon: CreditCard,
  },
  {
    name: 'Calendario & Recordatorios',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Plan & Metas',
    href: '/plan',
    icon: Target,
  },
]

export const AppSidebar = () => {
  const { signOut } = useAuth()

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <PiggyBank className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CrediPal</h1>
            <p className="text-xs text-gray-500">Tu coach financiero</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Settings className="h-4 w-4 mr-3" />
          Configuración
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
          size="sm"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
