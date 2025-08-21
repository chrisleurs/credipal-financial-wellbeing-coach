
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/helpers'
import { CreditCard, Calendar, AlertTriangle } from 'lucide-react'

interface Payment {
  id: string
  type: 'debt' | 'goal'
  name: string
  amount: number
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

interface UpcomingPaymentsProps {
  payments: Payment[]
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ payments }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertTriangle className="h-4 w-4" />
    }
    return <Calendar className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Próximos Pagos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  {getPriorityIcon(payment.priority)}
                  <div>
                    <h4 className="font-medium">{payment.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {payment.type === 'debt' ? 'Pago de deuda' : 'Meta de ahorro'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(payment.priority)}`}>
                    {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="font-medium mb-2">¡Todo al día!</h3>
            <p className="text-sm text-muted-foreground">
              No tienes pagos pendientes próximos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
