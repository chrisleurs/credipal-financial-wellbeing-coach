import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home, CreditCard, AlertTriangle, Target, TrendingUp } from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  current: boolean
}

export function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Gastos', href: '/expenses', icon: CreditCard, current: false },
    { name: 'Deudas', href: '/debts', icon: AlertTriangle, current: false },
    { name: 'Plan', href: '/plan', icon: Target, current: false },
    { name: 'Progreso', href: '/progress', icon: TrendingUp, current: false },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="fixed inset-x-0 bottom-0 bg-secondary border-t z-50">
      <div className="max-w-md mx-auto flex items-center justify-around p-2">
        {navigationItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            onClick={() => navigate(item.href)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-md p-2',
              isActive(item.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
