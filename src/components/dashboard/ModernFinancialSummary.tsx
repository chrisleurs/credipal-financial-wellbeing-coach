
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils/helpers'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ModernFinancialSummaryProps {
  consolidatedData: {
    monthlyIncome: number
    monthlyExpenses: number
    currentSavings: number
    savingsCapacity: number
  }
}

export const ModernFinancialSummary: React.FC<ModernFinancialSummaryProps> = ({ consolidatedData }) => {
  const [showBalances, setShowBalances] = React.useState(true)
  
  const netWorth = consolidatedData.currentSavings + (consolidatedData.savingsCapacity * 12)
  const expenseRatio = consolidatedData.monthlyIncome > 0 ? (consolidatedData.monthlyExpenses / consolidatedData.monthlyIncome) * 100 : 0
  
  const formatValue = (value: number) => showBalances ? formatCurrency(value) : '••••••'
  
  return (
    <div className="space-y-6">
      {/* Balance Principal */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 border-primary/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">Balance Total</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalances(!showBalances)}
              className="h-8 w-8 p-0"
            >
              {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">
              {formatValue(netWorth)}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                <ArrowUpRight className="h-3 w-3" />
                +12.5% este mes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Ingresos */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  +5.2%
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
              <p className="text-2xl font-bold">{formatValue(consolidatedData.monthlyIncome)}</p>
              <p className="text-xs text-muted-foreground">vs mes anterior</p>
            </div>
          </CardContent>
        </Card>

        {/* Gastos */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                  -{expenseRatio.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Gastos</p>
              <p className="text-2xl font-bold">{formatValue(consolidatedData.monthlyExpenses)}</p>
              <p className="text-xs text-muted-foreground">de tus ingresos</p>
            </div>
          </CardContent>
        </Card>

        {/* Ahorros */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <ArrowUpRight className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                  Estable
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Ahorros</p>
              <p className="text-2xl font-bold">{formatValue(consolidatedData.currentSavings)}</p>
              <p className="text-xs text-muted-foreground">acumulados</p>
            </div>
          </CardContent>
        </Card>

        {/* Capacidad */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
                <ArrowUpRight className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                  Meta
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Disponible</p>
              <p className="text-2xl font-bold">{formatValue(consolidatedData.savingsCapacity)}</p>
              <p className="text-xs text-muted-foreground">para ahorrar</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
