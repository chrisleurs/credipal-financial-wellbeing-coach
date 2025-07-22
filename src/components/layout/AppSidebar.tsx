
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  Receipt, 
  Calendar,
  Target,
  MessageCircle,
  LogOut
} from 'lucide-react'
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
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Perfil', url: '/profile', icon: User },
  { title: 'Gastos', url: '/expenses', icon: Receipt },
  { title: 'Deudas', url: '/debts', icon: CreditCard },
  { title: 'Calendario', url: '/calendar', icon: Calendar },
  { title: 'Mi Plan', url: '/plan', icon: Target },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const location = useLocation()
  const { signOut } = useAuth()
  const currentPath = location.pathname

  return (
    <Sidebar
      className={`${open ? 'w-72' : 'w-16'} border-r border-border/60 bg-sidebar`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="p-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            {open && (
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Credipal</h2>
                <p className="text-xs text-muted-foreground font-medium">Bienestar Financiero</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 py-6">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 mb-4">
              {open ? 'Navegación' : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isActive 
                              ? 'bg-primary text-primary-foreground shadow-sm' 
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {open && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-border/60">
          <SidebarMenuButton 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {open && <span className="text-sm">Cerrar Sesión</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
