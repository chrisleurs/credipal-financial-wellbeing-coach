
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, DollarSign, Target, CreditCard, AlertCircle } from 'lucide-react'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Progress } from '@/components/ui/progress'

export const UnifiedDashboard = () => {
  const { data: financialData, isLoading, error } = useUnifiedFinancialData()

  console.log('🎯 DASHBOARD: Rendering with data:', {
    hasData: !!financialData,
    isLoading,
    monthlyIncome: financialData?.monthlyIncome,
    monthlyExpenses: financialData?.monthlyExpenses,
    totalDebtBalance: financialData?.totalDebtBalance,
    hasRealData: financialData?.hasRealData
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <LoadingSpinner text="Cargando información financiera..." />
      </div>
    )
  }

  if (error) {
    console.error('❌ DASHBOARD: Error loading data:', error)
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2">Error al cargar datos</h3>
            <p className="text-gray-600">No pudimos cargar tu información financiera</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!financialData) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
            <p className="text-gray-600">Complete el proceso de onboarding para ver su información</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const kueskiProgress = ((500 - financialData.kueskiDebt.balance) / 500) * 100

  return (
    <div className="container mx-auto p-4 pb-20 max-w-4xl">
      <div className="space-y-6">
        {/* Header de bienvenida */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">¡Hola Karen! 👋</h1>
          <p className="text-gray-600">Aquí está tu resumen financiero y plan de acción</p>
        </div>

        {/* Resumen financiero principal */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${financialData.monthlyIncome.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">por mes</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gastos</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${financialData.monthlyExpenses.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">por mes</p>
                </div>
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Deuda Total</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${financialData.totalDebtBalance.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${financialData.totalMonthlyDebtPayments.toFixed(2)}/mes
                  </p>
                </div>
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disponible</p>
                  <p className={`text-2xl font-bold ${
                    financialData.savingsCapacity >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    ${financialData.savingsCapacity.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">por mes</p>
                </div>
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progreso de Kueski */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold">Tu préstamo KueskiPay</h3>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-red-600 font-medium">Saldo pendiente</p>
                  <p className="text-xl font-bold text-red-800">
                    ${financialData.kueskiDebt.balance} USD
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-medium">Pago mensual</p>
                  <p className="text-xl font-bold text-red-800">
                    ${financialData.kueskiDebt.monthlyPayment} USD
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-medium">Pagos restantes</p>
                  <p className="text-xl font-bold text-red-800">
                    {financialData.kueskiDebt.remainingPayments}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de categorías de gastos si existen */}
        {Object.keys(financialData.expenseCategories).length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Gastos por Categoría</h3>
              <div className="space-y-3">
                {Object.entries(financialData.expenseCategories).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{category}</span>
                    <span className="text-sm font-medium">${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metas financieras si existen */}
        {financialData.financialGoals.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Metas Financieras</h3>
              <div className="space-y-3">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug info - mostrar si no hay datos reales */}
        {!financialData.hasRealData && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    No se encontraron datos del onboarding
                  </p>
                  <p className="text-xs text-yellow-700">
                    Los datos mostrados son por defecto. Complete el onboarding para ver información real.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
