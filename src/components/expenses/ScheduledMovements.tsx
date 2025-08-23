
import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScheduledPaymentCard } from './ScheduledPaymentCard'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { useToast } from '@/hooks/use-toast'
import { useCoachToast } from './CoachToast'

export const ScheduledMovements: React.FC = () => {
  const { debts } = useDebts()
  const { toast } = useToast()
  const { showMotivationalToast } = useCoachToast()

  // Transform debts into scheduled payments
  const scheduledPayments = useMemo(() => {
    const today = new Date()
    
    return debts
      .filter(debt => debt.due_date && debt.status === 'active')
      .map(debt => {
        const dueDate = new Date(debt.due_date!)
        const diffTime = dueDate.getTime() - today.getTime()
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        let urgency: 'low' | 'medium' | 'high'
        if (daysUntil < 3) urgency = 'high'
        else if (daysUntil <= 7) urgency = 'medium'
        else urgency = 'low'

        return {
          id: debt.id,
          name: debt.creditor,
          amount: debt.monthly_payment,
          dueDate: debt.due_date!,
          type: 'debt' as const,
          urgency,
          daysUntil
        }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }, [debts])

  // Group payments by time periods
  const groupedPayments = useMemo(() => {
    const thisWeek = scheduledPayments.filter(p => p.daysUntil <= 7)
    const nextTwoWeeks = scheduledPayments.filter(p => p.daysUntil > 7 && p.daysUntil <= 14)
    const thisMonth = scheduledPayments.filter(p => p.daysUntil > 14 && p.daysUntil <= 30)

    return { thisWeek, nextTwoWeeks, thisMonth }
  }, [scheduledPayments])

  const handleMarkAsPaid = (id: string) => {
    // TODO: Create transaction and update debt status
    showMotivationalToast({ type: 'debt', debtReduction: 5.2 })
    toast({
      title: "Pago registrado",
      description: "El pago se ha marcado como completado",
    })
  }

  const handleEdit = (id: string) => {
    // TODO: Open edit modal
    console.log('Edit payment:', id)
  }

  const handleSkip = (id: string) => {
    // TODO: Skip to next period
    toast({
      title: "Pago postponed",
      description: "El pago se ha movido al siguiente período",
    })
  }

  if (scheduledPayments.length === 0) {
    return (
      <div className="space-y-4">
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

  return (
    <div className="space-y-6">
      {/* This Week */}
      {groupedPayments.thisWeek.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Esta semana
          </h3>
          <div className="space-y-3">
            {groupedPayments.thisWeek.map((payment) => (
              <ScheduledPaymentCard
                key={payment.id}
                payment={payment}
                onMarkAsPaid={handleMarkAsPaid}
                onEdit={handleEdit}
                onSkip={handleSkip}
              />
            ))}
          </div>
        </div>
      )}

      {/* Next Two Weeks */}
      {groupedPayments.nextTwoWeeks.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Próximas 2 semanas
          </h3>
          <div className="space-y-3">
            {groupedPayments.nextTwoWeeks.map((payment) => (
              <ScheduledPaymentCard
                key={payment.id}
                payment={payment}
                onMarkAsPaid={handleMarkAsPaid}
                onEdit={handleEdit}
                onSkip={handleSkip}
              />
            ))}
          </div>
        </div>
      )}

      {/* This Month */}
      {groupedPayments.thisMonth.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Este mes
          </h3>
          <div className="space-y-3">
            {groupedPayments.thisMonth.map((payment) => (
              <ScheduledPaymentCard
                key={payment.id}
                payment={payment}
                onMarkAsPaid={handleMarkAsPaid}
                onEdit={handleEdit}
                onSkip={handleSkip}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
