
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CreditCard, TrendingDown, Calendar, DollarSign, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

interface DebtPaymentPlan {
  deuda: string
  balanceActual: number
  fechaLiquidacion: string
  pagoMensual: number
  interesesAhorrados: number
  prioridad?: number
}

interface PlanPagoDeudaProps {
  data: DebtPaymentPlan[]
}

const PlanPagoDeuda: React.FC<PlanPagoDeudaProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan de Pago de Deudas
          </CardTitle>
          <CardDescription>
            No tienes deudas registradas actualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">¡Excelente! No hay deudas que gestionar.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort debts by priority (if available) or by balance (higher first)
  const sortedData = [...data].sort((a, b) => {
    if (a.prioridad && b.prioridad) {
      return a.prioridad - b.prioridad
    }
    return b.balanceActual - a.balanceActual
  })

  const totalInteresesAhorrados = sortedData.reduce((sum, debt) => sum + debt.interesesAhorrados, 0)
  const totalBalance = sortedData.reduce((sum, debt) => sum + debt.balanceActual, 0)
  const totalMonthlyPayments = sortedData.reduce((sum, debt) => sum + debt.pagoMensual, 0)

  const getMonthsToPayoff = (debt: DebtPaymentPlan) => {
    const payoffDate = new Date(debt.fechaLiquidacion)
    const currentDate = new Date()
    const diffTime = Math.abs(payoffDate.getTime() - currentDate.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return diffMonths
  }

  const getProgressPercentage = (debt: DebtPaymentPlan) => {
    const monthsToPayoff = getMonthsToPayoff(debt)
    const totalMonths = Math.ceil(debt.balanceActual / debt.pagoMensual)
    const monthsPassed = totalMonths - monthsToPayoff
    return Math.max(0, Math.min(100, (monthsPassed / totalMonths) * 100))
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-destructive" />
          Plan de Eliminación de Deudas
        </CardTitle>
        <CardDescription>
          Estrategia optimizada para liquidar tus deudas de manera eficiente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalInteresesAhorrados)}
              </div>
              <div className="text-sm text-green-700">
                Intereses que ahorrarás
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalBalance)}
              </div>
              <div className="text-sm text-blue-700">
                Total de deudas
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalMonthlyPayments)}
              </div>
              <div className="text-sm text-orange-700">
                Pago mensual total
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debt Timeline */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-4">Cronograma de Liquidación</h3>
          
          {sortedData.map((debt, index) => {
            const monthsToPayoff = getMonthsToPayoff(debt)
            const progressPercentage = getProgressPercentage(debt)
            
            return (
              <div key={index} className="relative">
                {/* Timeline connector */}
                {index < sortedData.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-16 bg-border" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Timeline number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Debt card */}
                  <Card className="flex-1 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold mb-1">{debt.deuda}</h4>
                          <p className="text-sm text-muted-foreground">
                            Prioridad #{index + 1} en tu plan de pagos
                          </p>
                        </div>
                        <Badge variant="secondary" className="mt-2 sm:mt-0">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(debt.fechaLiquidacion).toLocaleDateString('es-ES', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Badge>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso estimado</span>
                          <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      {/* Debt details grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Balance actual</span>
                          <div className="font-semibold text-destructive">
                            {formatCurrency(debt.balanceActual)}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Pago mensual</span>
                          <div className="font-semibold">
                            {formatCurrency(debt.pagoMensual)}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Meses restantes</span>
                          <div className="font-semibold text-orange-600">
                            {monthsToPayoff} meses
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Intereses ahorrados</span>
                          <div className="font-semibold text-green-600">
                            {formatCurrency(debt.interesesAhorrados)}
                          </div>
                        </div>
                      </div>

                      {/* Additional insights */}
                      {index === 0 && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            💡 Prioriza esta deuda para maximizar tus ahorros en intereses
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>

        {/* Strategy insight */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Estrategia Recomendada
          </h4>
          <p className="text-sm text-muted-foreground">
            Este plan utiliza el método de avalancha de deudas, priorizando las deudas con mayor impacto 
            financiero. Al seguir este orden, ahorrarás <strong>{formatCurrency(totalInteresesAhorrados)}</strong> en 
            intereses comparado con pagos mínimos solamente.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PlanPagoDeuda
