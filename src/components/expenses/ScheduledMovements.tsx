
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ScheduledMovements: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Empty state for now */}
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Próximos pagos</h3>
          <p className="text-muted-foreground mb-4">
            Agrega fechas de renta o suscripciones para verlas aquí
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Programar Pago
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
