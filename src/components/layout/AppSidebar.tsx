
import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  CreditCard, 
  Target, 
  Calendar,
  PiggyBank,
  Home,
  Settings,
  LogOut,
  RefreshCw,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'

const navigationItems = [
  {
    name: 'Resumen',
    href: '/dashboard',
    icon: Home,
    description: 'Vista general de tus finanzas'
  },
  {
    name: 'Gastos & Ingresos',
    href: '/expenses',
    icon: BarChart3,
    description: 'Gestiona tus transacciones'
  },
  {
    name: 'Deudas',
    href: '/debts',
    icon: CreditCard,
    description: 'Controla tus deudas'
  },
  {
    name: 'Plan & Metas',
    href: '/plan',
    icon: Target,
    description: 'Objetivos financieros'
  },
  {
    name: 'Calendario',
    href: '/calendar',
    icon: Calendar,
    description: 'Programa tus pagos'
  },
]

const quickActions = [
  {
    name: 'Actualizar Plan',
    action: 'update-plan',
    icon: RefreshCw,
    description: 'Regenerar recomendaciones'
  },
  {
    name: 'Ver Progreso',
    action: 'view-progress',
    icon: TrendingUp,
    description: 'Analizar evolución'
  }
]

export const AppSidebar = () => {
  const { signOut } = useAuth()
  const { open } = useSidebar()

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'update-plan':
        // Lógica para actualizar el plan
        console.log('Actualizando plan financiero...')
        break
      case 'view-progress':
        // Lógica para ver progreso
        console.log('Mostrando progreso...')
        break
    }
  }

  return (
    <Sidebar 
      className="border-r border-gray-200 bg-white"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo - Simplified */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            {open && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">CrediPal</h1>
                <p className="text-xs text-gray-500">Coach financiero</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild tooltip={open ? undefined : item.description}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 w-full',
                            isActive
                              ? 'bg-primary text-white shadow-lg shadow-primary/25'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )
                        }
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {open && (
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{item.name}</span>
                            {item.description && (
                              <span className="text-xs opacity-75 truncate">{item.description}</span>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions - Only when expanded */}
        {open && (
          <SidebarGroup>
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Acciones Rápidas
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <SidebarMenuItem key={action.name}>
                      <SidebarMenuButton asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => handleQuickAction(action.action)}
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <div className="flex flex-col items-start min-w-0">
                            <span className="text-sm font-medium truncate">{action.name}</span>
                            <span className="text-xs opacity-75 truncate">{action.description}</span>
                          </div>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Footer Actions */}
        <div className="mt-auto p-4 border-t border-gray-200 space-y-2">
          <SidebarMenuButton asChild>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
              {open && <span>Configuración</span>}
            </Button>
          </SidebarMenuButton>
          
          <SidebarMenuButton asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
              size="sm"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              {open && <span>Cerrar Sesión</span>}
            </Button>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
