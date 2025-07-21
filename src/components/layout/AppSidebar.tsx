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

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'

  return (
    <Sidebar
      className={open ? 'w-64' : 'w-14'}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            {open && (
              <h2 className="text-lg font-bold text-primary">Credipal</h2>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarMenuButton 
            onClick={signOut}
            className="text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            {open && <span>Cerrar Sesión</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}