
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard, 
  Calendar,
  FileText,
  User, 
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

const principalItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Gastos', url: '/expenses', icon: Receipt },
  { title: 'Deudas', url: '/debts', icon: CreditCard },
  { title: 'Calendario', url: '/calendar', icon: Calendar },
  { title: 'Plan', url: '/plan', icon: FileText },
]

const personalItems = [
  { title: 'Perfil', url: '/profile', icon: User },
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
            `group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative ${
              isActive 
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-white before:rounded-r-full before:-ml-4' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1'
            }`
          }
        >
          <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.8} />
          {open && (
            <span className="text-sm font-medium">{item.title}</span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <Sidebar
      className={`${open ? 'w-[280px]' : 'w-16'} border-r border-gray-200 bg-white shadow-sm`}
      collapsible="icon"
    >
      <SidebarContent className="bg-white flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <MessageCircle className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            {open && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Credipal</h2>
                <p className="text-xs text-gray-500 font-medium">Bienestar Financiero</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        {open && (
          <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getUserName()}
                </p>
                <p className="text-xs text-gray-600 font-medium">
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
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 mb-3">
              {open ? 'Principal' : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-3">
                {principalItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Personal Section */}
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 mb-3">
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
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 space-y-1">
          <SidebarMenuButton className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:translate-x-1 transition-all duration-200">
            <HelpCircle className="h-5 w-5 flex-shrink-0" strokeWidth={1.8} />
            {open && <span className="text-sm font-medium">Ayuda</span>}
          </SidebarMenuButton>
          
          <SidebarMenuButton 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 hover:translate-x-1 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" strokeWidth={1.8} />
            {open && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
