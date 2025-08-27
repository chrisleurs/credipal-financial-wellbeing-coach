import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { ScrollArea } from "@/components/ui/scroll-area"
import { MainNavItem, SidebarNavItem } from "@/types/nav"
import { NavItem } from "@/components/shared/NavItem"
import { Home, CreditCard, AlertTriangle, Target, TrendingUp, User, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AppSidebarProps {
  items?: MainNavItem[]
  sidebarItems?: SidebarNavItem[]
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Gastos', href: '/expenses', icon: CreditCard },
  { name: 'Deudas', href: '/debts', icon: AlertTriangle },
  { name: 'Plan', href: '/plan', icon: Target },
  { name: 'Progreso', href: '/progress', icon: TrendingUp },
  { name: 'Perfil', href: '/profile', icon: User },
]

export function AppSidebar({ items, sidebarItems }: AppSidebarProps) {
  const { user, signOut } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="w-5 h-5 md:hidden" />
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64 border-right padding-x">
        <SheetHeader className="space-y-2.5">
          <SheetTitle>Menú</SheetTitle>
          <SheetDescription>
            Navega a través de tu información financiera.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="my-4">
          <div className="py-4">
            <div className="px-3 py-2">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 font-medium leading-none mt-2">
                <p className="text-sm font-semibold">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-1">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.name}
                  title={item.name}
                  href={item.href}
                  icon={item.icon}
                />
              ))}
            </ul>
            <div className="flex justify-center mt-4">
              <Link to="/profile" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Link>
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={() => signOut({ redirectTo: '/auth' })}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
