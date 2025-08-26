
import React from 'react'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/helpers'
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Target,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

export const UnifiedFinancialDashboard = () => {
  const { data: financialData, isLoading, error } = useUnifiedFinancialData()
  const [showBalances, setShowBalances] = React.useState(true)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <LoadingSpinner size="lg" text="Cargando tu información financiera..." />
      </div>
    )
  }

  if (error || !financialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
            <p className="text-muted-foreground mb-4">
              No se pudieron cargar tus datos del onboarding.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatValue = (value: number) => showBalances ? formatCurrency(value) : '••••••'

  if (!financialData.hasFinancialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              ¡Hola {financialData.userProfile.firstName || 'Usuario'}!
            </h1>
            <p className="text-muted-foreground mb-6">
              Parece que aún no has completado tu onboarding financiero. 
              Complétalo para ver tu dashboard personalizado.
            </p>
            <Button onClick={() => window.location.href = '/onboarding'}>
              Completar Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header del Usuario */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  ¡Hola {financialData.userProfile.firstName || 'Usuario'}!
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant={financialData.isOnboardingComplete ? 'default' : 'secondary'}>
                    {financialData.isOnboardingComplete ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Onboarding Completo
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Perfil Incompleto
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Tarjeta Principal de Balance */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 border-primary/10">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2">
                <span className="text-sm font-medium text-muted-foreground">Tu Patrimonio Neto</span>
              </div>
              <div className="text-4xl font-bold mb-2">
                {formatValue(financialData.netWorth)}
              </div>
              <div className="text-sm text-muted-foreground">
                Basado en tus datos del onboarding
              </div>
              {financialData.availableCashFlow > 0 ? (
                <div className="mt-3 inline-flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {formatValue(financialData.availableCashFlow)} disponible mensual
                </div>
              ) : (
                <div className="mt-3 inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm font-medium">
                  <AlertCircle className="h-3 w-3" />
                  Optimiza tus gastos
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold">{formatValue(financialData.totalMonthlyIncome)}</p>
                <p className="text-xs text-muted-foreground">
                  Principal: {formatValue(financialData.monthlyIncome)}
                  {financialData.extraIncome > 0 && ` + Extra: ${formatValue(financialData.extraIncome)}`}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-xl">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Gastos Mensuales</p>
                <p className="text-2xl font-bold">{formatValue(financialData.monthlyExpenses)}</p>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(financialData.expenseCategories).length} categorías
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Ahorros Actuales</p>
                <p className="text-2xl font-bold">{formatValue(financialData.currentSavings)}</p>
                <p className="text-xs text-muted-foreground">
                  Capacidad: {formatValue(financialData.monthlySavingsCapacity)}/mes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Deudas Totales</p>
                <p className="text-2xl font-bold">{formatValue(financialData.totalDebtBalance)}</p>
                <p className="text-xs text-muted-foreground">
                  Pago mensual: {formatValue(financialData.totalMonthlyDebtPayments)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de Categorías de Gastos */}
        {Object.keys(financialData.expenseCategories).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Desglose de Gastos (Del Onboarding)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(financialData.expenseCategories).map(([category, amount]) => (
                  <div key={category} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium capitalize mb-1">{category}</p>
                    <p className="text-lg font-bold">{formatValue(amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((amount / financialData.monthlyExpenses) * 100).toFixed(1)}% del total
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metas Financieras */}
        {financialData.financialGoals.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tus Metas Financieras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <p className="font-medium">{goal}</p>
                    </div>
                    <Badge variant="outline">En Progreso</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deudas Activas */}
        {financialData.debts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Deudas Activas (Del Onboarding)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData.debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{debt.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Balance: {formatValue(debt.amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatValue(debt.monthlyPayment)}</p>
                      <p className="text-sm text-muted-foreground">pago mensual</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de datos */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Datos basados en tu onboarding • Usuario ID: {financialData.userId.slice(-8)}
          </p>
          {financialData.lastUpdated && (
            <p>
              Última actualización: {new Date(financialData.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
