
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { formatCurrency } from '@/shared/utils/format.utils'

interface DebtPayment {
  id: string
  creditor: string
  amount: number
  dueDate: string
  daysUntilDue: number
  urgencyLevel: 'low' | 'medium' | 'high'
}

export const UpcomingPaymentsSection = () => {
  const { debts, isLoading } = useDebts()

  const getUpcomingPayments = (): DebtPayment[] => {
    const today = new Date()
    
    return debts
      .filter(debt => debt.due_date && debt.status === 'active')
      .map(debt => {
        const dueDate = new Date(debt.due_date!)
        const diffTime = dueDate.getTime() - today.getTime()
        const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        let urgencyLevel: 'low' | 'medium' | 'high'
        if (daysUntilDue < 3) urgencyLevel = 'high'
        else if (daysUntilDue <= 7) urgencyLevel = 'medium'
        else urgencyLevel = 'low'

        return {
          id: debt.id,
          creditor: debt.creditor,
          amount: debt.monthly_payment,
          dueDate: debt.due_date!,
          daysUntilDue,
          urgencyLevel
        }
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
  }

  const upcomingPayments = getUpcomingPayments()

  const getUrgencyConfig = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50'
        }
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        }
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50'
        }
    }
  }

  const getDaysText = (days: number) => {
    if (days < 0) return 'Vencido'
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Mañana'
    return `${days} días`
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Próximos Pagos</h2>
          <Badge variant="outline" className="text-xs bg-[#10B981]/10 text-[#10B981]">
            Analizando
          </Badge>
        </div>
        
        <Card className="border-[#0891B2]/20 bg-[#0891B2]/5">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#0891B2]/20 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#0891B2]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Analizando tus fechas de pago</p>
                <p className="text-sm text-gray-500 mb-3">
                  Revisando tu información para identificar próximos vencimientos
                </p>
                <LoadingSpinner size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Case with no upcoming payments
  if (upcomingPayments.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Próximos Pagos</h2>
          <Badge variant="outline" className="text-xs bg-[#10B981]/10 text-[#10B981]">
            Al día
          </Badge>
        </div>
        
        <Card className="border-[#10B981]/20 bg-[#10B981]/5">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#10B981]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">¡Genial! No tienes pagos pendientes</p>
                <p className="text-sm text-gray-500">
                  Estás al día con tus compromisos financieros 🎉
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Próximos Pagos</h2>
        <Badge variant="outline" className="text-xs">
          {upcomingPayments.length}
        </Badge>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {upcomingPayments.map((payment) => {
          const urgencyConfig = getUrgencyConfig(payment.urgencyLevel)
          const UrgencyIcon = urgencyConfig.icon
          
          return (
            <Card 
              key={payment.id} 
              className={`flex-shrink-0 w-64 border transition-all duration-200 hover:shadow-md ${urgencyConfig.bgColor}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${urgencyConfig.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                      <UrgencyIcon className={`h-4 w-4 ${urgencyConfig.iconColor}`} />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm text-gray-900 truncate max-w-32">
                        {payment.creditor}
                      </p>
                      <Badge variant="outline" className={`text-xs w-fit ${urgencyConfig.color}`}>
                        {getDaysText(payment.daysUntilDue)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Vence: {new Date(payment.dueDate).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs hover:bg-[#10B981] hover:text-white hover:border-[#10B981] transition-colors"
                >
                  <CreditCard className="mr-1 h-3 w-3" />
                  Pagar Ahora
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
