
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, AlertTriangle, CheckCircle, Clock, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

interface ScheduledPayment {
  id: string
  name: string
  amount: number
  dueDate: string
  type: 'debt' | 'subscription' | 'income'
  urgency: 'low' | 'medium' | 'high'
  daysUntil: number
}

interface ScheduledPaymentCardProps {
  payment: ScheduledPayment
  onMarkAsPaid: (id: string) => void
  onEdit: (id: string) => void
  onSkip: (id: string) => void
}

export const ScheduledPaymentCard: React.FC<ScheduledPaymentCardProps> = ({
  payment,
  onMarkAsPaid,
  onEdit,
  onSkip
}) => {
  const getUrgencyConfig = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high':
        return {
          color: 'destructive',
          icon: AlertTriangle,
          bgColor: 'bg-red-50 border-red-200'
        }
      case 'medium':
        return {
          color: 'secondary',
          icon: Clock,
          bgColor: 'bg-yellow-50 border-yellow-200'
        }
      case 'low':
        return {
          color: 'outline',
          icon: CheckCircle,
          bgColor: 'bg-green-50 border-green-200'
        }
    }
  }

  const getDaysText = (days: number) => {
    if (days < 0) return 'Vencido'
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Mañana'
    return `${days} días`
  }

  const config = getUrgencyConfig(payment.urgency)
  const UrgencyIcon = config.icon

  return (
    <Card className={`border transition-colors ${config.bgColor}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <UrgencyIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">{payment.name}</h3>
          </div>
          <Badge variant={config.color as any}>
            {getDaysText(payment.daysUntil)}
          </Badge>
        </div>

        <div className="mb-4">
          <p className="text-lg font-bold">
            {payment.type === 'income' ? '+' : '-'}{formatCurrency(payment.amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(payment.dueDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'short' 
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onMarkAsPaid(payment.id)}
            className="flex-1"
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Marcar Pagado
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(payment.id)}
          >
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onSkip(payment.id)}
          >
            Saltar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
