
import React from 'react'
import { Button } from '@/components/ui/button'

interface QuickAction {
  label: string
  action: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  onActionClick: (action: string) => void
  disabled?: boolean
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  actions, 
  onActionClick, 
  disabled = false 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onActionClick(action.action)}
          disabled={disabled}
          className="text-xs h-8 px-3 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}
