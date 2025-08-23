
import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABProps {
  onClick: () => void
  className?: string
}

export const FAB: React.FC<FABProps> = ({ onClick, className }) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl",
        "bg-emerald-600 hover:bg-emerald-700 text-white",
        "transition-all duration-200 transform hover:scale-105",
        "z-40 border-0",
        className
      )}
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">Agregar movimiento</span>
    </Button>
  )
}
