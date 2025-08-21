
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import { CreditCard, Calendar, AlertTriangle, ArrowRight, Bell } from 'lucide-react'

interface Payment {
  id: string
  type: 'debt' | 'goal'
  name: string
  amount: number
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

interface ModernUpcomingPaymentsProps {
  payments: Payment[]
}

export const ModernUpcomingPayments: React.FC<ModernUpcomingPaymentsProps> = ({ payments }) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          iconColor: 'text-red-600'
        }
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Bell,
          iconColor: 'text-yellow-600'
        }
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Calendar,
          iconColor: 'text-green-600'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Calendar,
          iconColor: 'text-gray-600'
        }
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return { text: 'Vencido', urgent: true }
    if (days === 0) return { text: 'Hoy', urgent: true }
    if (days === 1) return { text: 'Mañana', urgent: true }
    if (days <= 7) return { text: `${days} días`, urgent: true }
    return { text: `${days} días`, urgent: false }
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Próximos Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">¡Todo al día!</h3>
            <p className="text-muted-foreground">
              No tienes pagos pendientes próximos
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Próximos Pagos
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {payments.length} pendientes
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => {
            const priorityConfig = getPriorityConfig(payment.priority)
            const PriorityIcon = priorityConfig.icon
            const daysInfo = getDaysUntilDue(payment.dueDate)
            
            return (
              <div 
                key={payment.id} 
                className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                  daysInfo.urgent ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${priorityConfig.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                      <PriorityIcon className={`h-5 w-5 ${priorityConfig.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">{payment.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {payment.type === 'debt' ? 'Pago de deuda' : 'Meta de ahorro'}
                        </Badge>
                        <span className={`text-xs font-medium ${daysInfo.urgent ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {daysInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.dueDate).toLocaleDateString('es-ES', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Realizar pago
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
