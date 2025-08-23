
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction,
  className 
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12 text-center">
        <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto">
          <div className="text-muted-foreground">
            {icon}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
          
          {actionLabel && onAction && (
            <Button 
              onClick={onAction}
              className="mt-4"
              size="sm"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
