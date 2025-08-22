
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
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'

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
    name: 'Calendario',
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
  const { open } = useSidebar()

  return (
    <Sidebar 
      className="border-r border-gray-200 bg-white"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            {open && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">CrediPal</h1>
                <p className="text-xs text-gray-500">Tu coach financiero</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 w-full',
                            isActive
                              ? 'bg-primary text-white shadow-lg shadow-primary/25'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )
                        }
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {open && <span className="truncate">{item.name}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
