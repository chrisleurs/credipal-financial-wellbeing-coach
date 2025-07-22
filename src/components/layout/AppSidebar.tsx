
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  Building2,
  FileText,
  GraduationCap,
  Shield,
  User, 
  Settings,
  HelpCircle,
  LogOut,
  MessageCircle
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
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'

const principalItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Tarjetas', url: '/cards', icon: CreditCard, badge: '3' },
  { title: 'Metas', url: '/goals', icon: Target },
  { title: 'Préstamos', url: '/loans', icon: Building2 },
]

const analysisItems = [
  { title: 'Reportes', url: '/reports', icon: FileText },
  { title: 'Educación', url: '/education', icon: GraduationCap },
  { title: 'Seguridad', url: '/security', icon: Shield },
]

const personalItems = [
  { title: 'Perfil', url: '/profile', icon: User },
  { title: 'Configuración', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const location = useLocation()
  const { signOut, user } = useAuth()
  const currentPath = location.pathname

  const getUserName = () => {
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      return emailPart.charAt(0).toUpperCase() + emailPart.slice(1)
    }
    return 'Usuario'
  }

  const getUserInitials = () => {
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      if (emailPart.includes('.')) {
        const parts = emailPart.split('.')
        return (parts[0]?.charAt(0) || '').toUpperCase() + (parts[1]?.charAt(0) || '').toUpperCase()
      }
      return emailPart.substring(0, 2).toUpperCase()
    }
    return 'CH'
  }

  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <NavLink 
          to={item.url} 
          end 
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 relative ${
              isActive 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-white before:rounded-r-full before:-ml-3' 
                : 'text-sidebar-foreground hover:bg-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-0.5'
            }`
          }
        >
          <item.icon className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.5} />
          {open && (
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm font-medium">{item.title}</span>
              {item.badge && (
                <Badge 
                  variant="secondary"
                  className="h-5 px-1.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <Sidebar
      className={`${open ? 'w-[280px]' : 'w-16'} border-r border-border bg-white`}
      collapsible="icon"
    >
      <SidebarContent className="bg-white flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
              <MessageCircle className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            {open && (
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Credipal</h2>
                <p className="text-xs text-muted-foreground font-medium">Bienestar Financiero</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        {open && (
          <div className="p-4 mx-4 mt-4 bg-gradient-subtle rounded-xl border border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {getUserName()}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Premium
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 py-6 overflow-auto">
          {/* Principal Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-tertiary uppercase tracking-wider px-6 mb-3">
              {open ? 'Principal' : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-3">
                {principalItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Analysis Section */}
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-tertiary uppercase tracking-wider px-6 mb-3">
              {open ? 'Análisis' : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-3">
                {analysisItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Personal Section */}
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-tertiary uppercase tracking-wider px-6 mb-3">
              {open ? 'Personal' : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-3">
                {personalItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-gray-50/50 space-y-1">
          <SidebarMenuButton className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-muted-foreground hover:bg-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-0.5 transition-all duration-200">
            <HelpCircle className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.5} />
            {open && <span className="text-sm font-medium">Ayuda</span>}
          </SidebarMenuButton>
          
          <SidebarMenuButton 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 hover:text-destructive hover:translate-x-0.5 transition-all duration-200"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.5} />
            {open && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
