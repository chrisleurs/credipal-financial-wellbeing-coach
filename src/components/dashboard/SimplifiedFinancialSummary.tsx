
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/helpers'
import { TrendingUp, TrendingDown, DollarSign, Target, Shield, CreditCard } from 'lucide-react'
import { useSimplifiedFinancialData } from '@/hooks/useSimplifiedFinancialData'
import { Button } from '@/components/ui/button'

export const SimplifiedFinancialSummary = () => {
  const { data, isLoading, recalculate, isRecalculating } = useSimplifiedFinancialData()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No hay datos financieros disponibles</p>
          <Button onClick={recalculate} disabled={isRecalculating} className="mt-4">
            {isRecalculating ? 'Calculando...' : 'Recalcular Resumen'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const cards = [
    {
      title: 'Ingresos Mensuales',
      value: formatCurrency(data.monthlyIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Gastos Mensuales',
      value: formatCurrency(data.monthlyExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Balance Mensual',
      value: formatCurrency(data.monthlyBalance),
      icon: DollarSign,
      color: data.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.monthlyBalance >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Capacidad de Ahorro',
      value: formatCurrency(data.savingsCapacity),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Deuda Total',
      value: formatCurrency(data.totalDebt),
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Fondo de Emergencia',
      value: formatCurrency(data.emergencyFund),
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Resumen Financiero</h2>
        <div className="flex items-center gap-2">
          {data.lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Actualizado: {new Date(data.lastUpdated).toLocaleString()}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={recalculate} 
            disabled={isRecalculating}
          >
            {isRecalculating ? 'Recalculando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className={`border-l-4 ${data.isHealthy ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Salud Financiera</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                data.isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {data.isHealthy ? 'Saludable' : 'Necesita Atención'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ratio Deuda/Ingreso</span>
              <span className="text-sm font-bold">{data.debtToIncomeRatio.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fondo Emergencia</span>
              <span className="text-sm font-bold">{data.emergencyFundMonths.toFixed(1)} meses</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
