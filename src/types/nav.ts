
export interface MainNavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export interface SidebarNavItem {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export interface NavLink {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
}
