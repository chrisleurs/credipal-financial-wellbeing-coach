
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface NavItemProps {
  title: string
  href: string
  icon?: LucideIcon
  disabled?: boolean
  external?: boolean
}

export function NavItem({ title, href, icon: Icon, disabled, external }: NavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === href

  const content = (
    <>
      {Icon && <Icon className="w-4 h-4" />}
      <span>{title}</span>
    </>
  )

  const className = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    disabled && "pointer-events-none opacity-50"
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  )
}
