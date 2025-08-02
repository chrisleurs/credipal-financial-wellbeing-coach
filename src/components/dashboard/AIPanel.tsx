
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, TrendingUp, AlertTriangle, Target, Calendar, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import type { Loan } from '@/hooks/useLoans'

interface AIPanelProps {
  totalIncome: number
  totalExpenses: number
  totalDebts: number
  kueskiLoan?: Loan
}

export const AIPanel: React.FC<AIPanelProps> = ({ 
  totalIncome, 
  totalExpenses, 
  totalDebts,
  kueskiLoan 
}) => {
  // Generate insights based on financial data
  const generateInsights = () => {
    const insights = []
    const balance = totalIncome - totalExpenses

    if (kueskiLoan) {
      const nextPaymentDate = new Date(kueskiLoan.next_payment_date)
      const today = new Date()
      const daysUntilPayment = Math.ceil((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilPayment <= 7) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Pago Kueski Próximo',
          message: `Tu pago de ${formatCurrency(kueskiLoan.payment_amount)} vence en ${daysUntilPayment} días.`,
          action: 'Preparar pago'
        })
      }

      insights.push({
        type: 'info',
        icon: Target,
        title: 'Progreso del Préstamo',
        message: `Has completado ${kueskiLoan.total_payments - kueskiLoan.remaining_payments} de ${kueskiLoan.total_payments} pagos.`,
        action: 'Ver detalles'
      })
    }

    if (balance > 0) {
      insights.push({
        type: 'positive',
        icon: TrendingUp,
        title: 'Balance Positivo',
        message: `Tienes ${formatCurrency(balance)} disponible este mes.`,
        action: 'Crear meta de ahorro'
      })
    } else if (balance < 0) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Gastos Elevados',
        message: `Tus gastos superan tus ingresos por ${formatCurrency(Math.abs(balance))}.`,
        action: 'Revisar presupuesto'
      })
    }

    if (totalDebts > totalIncome * 0.3) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Nivel de Deuda Alto',
        message: 'Tus deudas representan más del 30% de tus ingresos.',
        action: 'Plan de pago'
      })
    }

    return insights
  }

  const insights = generateInsights()

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-l-4 border-l-primary bg-primary/5'
      case 'warning':
        return 'border-l-4 border-l-warning bg-warning/5'
      case 'info':
        return 'border-l-4 border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-4 border-l-gray-300 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold">
            Tu Asistente IA
          </CardTitle>
          <p className="text-white/90 text-sm">
            Análisis inteligente de tus finanzas
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            variant="secondary" 
            className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
          >
            Obtener Recomendaciones
          </Button>
        </CardContent>
      </Card>

      {/* Kueski Loan Quick Info */}
      {kueskiLoan && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Préstamo Kueski
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Próximo pago:</span>
              <Badge variant="outline" className="text-primary border-primary">
                {new Date(kueskiLoan.next_payment_date).toLocaleDateString('es-ES')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Monto:</span>
              <span className="font-semibold">{formatCurrency(kueskiLoan.payment_amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Restantes:</span>
              <span className="font-semibold">{kueskiLoan.remaining_payments} pagos</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Insights Financieros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => {
              const IconComponent = insight.icon
              return (
                <div key={index} className={`p-4 rounded-lg ${getInsightStyle(insight.type)}`}>
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-text-secondary mb-2">
                        {insight.message}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7"
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-4 text-text-secondary">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Completa más información financiera para obtener insights personalizados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Programar Recordatorio
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Target className="h-4 w-4 mr-2" />
            Crear Meta de Ahorro
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analizar Gastos
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
