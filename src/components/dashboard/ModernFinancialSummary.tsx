
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils/helpers'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Plus, Target, AlertCircle } from 'lucide-react'
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
  
  const getBalanceHelperText = () => {
    if (consolidatedData.monthlyIncome === 0) {
      return "Agrega tus ingresos para empezar"
    }
    return "Dinero disponible tras gastos y pagos"
  }

  const getExpenseHelperText = () => {
    if (consolidatedData.monthlyExpenses === 0) {
      return "Registra tu primer gasto"
    }
    return `${expenseRatio.toFixed(1)}% de tus ingresos`
  }

  const getSavingsHelperText = () => {
    if (consolidatedData.currentSavings === 0) {
      return "Crea tu primera meta de ahorro"
    }
    return "acumulados"
  }
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Balance Principal Responsive */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 border-primary/10">
        <CardContent className="p-4 sm:p-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Balance Total</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalances(!showBalances)}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0"
            >
              {showBalances ? <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {formatValue(netWorth)}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {getBalanceHelperText()}
              </p>
              {consolidatedData.monthlyIncome > 0 && (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium w-fit">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.5% este mes
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Ingresos */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-50 rounded-xl sm:rounded-2xl group-hover:bg-green-100 transition-colors">
                {consolidatedData.monthlyIncome === 0 ? (
                  <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                )}
              </div>
              {consolidatedData.monthlyIncome > 0 && (
                <div className="text-right">
                  <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    +5.2%
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Ingresos</p>
              <p className="text-lg sm:text-2xl font-bold">
                {consolidatedData.monthlyIncome === 0 ? "Agregar" : formatValue(consolidatedData.monthlyIncome)}
              </p>
              <p className="text-xs text-muted-foreground">
                {consolidatedData.monthlyIncome === 0 ? "Tu primer ingreso" : "vs mes anterior"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gastos */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-red-50 rounded-xl sm:rounded-2xl group-hover:bg-red-100 transition-colors">
                {consolidatedData.monthlyExpenses === 0 ? (
                  <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                )}
              </div>
              {consolidatedData.monthlyExpenses > 0 && consolidatedData.monthlyIncome > 0 && (
                <div className="text-right">
                  <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                    {expenseRatio.toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Gastos</p>
              <p className="text-lg sm:text-2xl font-bold">
                {consolidatedData.monthlyExpenses === 0 ? "Registrar" : formatValue(consolidatedData.monthlyExpenses)}
              </p>
              <p className="text-xs text-muted-foreground">
                {getExpenseHelperText()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ahorros */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-xl sm:rounded-2xl group-hover:bg-blue-100 transition-colors">
                {consolidatedData.currentSavings === 0 ? (
                  <Target className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                  {consolidatedData.currentSavings === 0 ? "Crear" : "Estable"}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Ahorros</p>
              <p className="text-lg sm:text-2xl font-bold">
                {consolidatedData.currentSavings === 0 ? "Meta" : formatValue(consolidatedData.currentSavings)}
              </p>
              <p className="text-xs text-muted-foreground">
                {getSavingsHelperText()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Capacidad */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-50 rounded-xl sm:rounded-2xl group-hover:bg-purple-100 transition-colors">
                <ArrowUpRight className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                  Meta
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Disponible</p>
              <p className="text-lg sm:text-2xl font-bold">{formatValue(consolidatedData.savingsCapacity)}</p>
              <p className="text-xs text-muted-foreground">para ahorrar</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
