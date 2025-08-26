
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface PlanErrorStateProps {
  error: string
  onRetry: () => void
  isRetrying?: boolean
}

export const PlanErrorState: React.FC<PlanErrorStateProps> = ({
  error,
  onRetry,
  isRetrying = false
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-lg">Error al generar plan</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {error || 'No se pudo generar tu plan financiero. Por favor intenta nuevamente.'}
          </p>
          
          <Button 
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generando plan...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar nuevamente
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Si el problema persiste, contacta soporte técnico
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
