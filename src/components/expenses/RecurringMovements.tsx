
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const RecurringMovements: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Empty state for now */}
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Suscripciones recurrentes</h3>
          <p className="text-muted-foreground mb-4">
            Crea suscripciones recurrentes desde el botón +
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Crear Suscripción
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
