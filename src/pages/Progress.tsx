
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { TrendingUp, Target, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/helpers'

export default function ProgressPage() {
  const { data: consolidatedData, isLoading, error } = useConsolidatedData()

  console.log('🎯 PROGRESS: Rendering with consolidated data:', {
    hasData: !!consolidatedData,
    isLoading,
    monthlyIncome: consolidatedData?.monthlyIncome,
    monthlyExpenses: consolidatedData?.monthlyExpenses,
    totalDebtBalance: consolidatedData?.totalDebtBalance,
    hasRealData: consolidatedData?.hasRealData,
    financialGoalsCount: consolidatedData?.financialGoals?.length
  })

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <LoadingSpinner text="Cargando progreso financiero..." />
        </div>
      </AppLayout>
    )
  }

  if (error) {
    console.error('❌ PROGRESS: Error loading data:', error)
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium mb-2">Error al cargar progreso</h3>
              <p className="text-gray-600">No pudimos cargar tu información de progreso</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  if (!consolidatedData) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
              <p className="text-gray-600">Complete el proceso de onboarding para ver su progreso</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // Calculate Kueski progress (assuming $500 total loan)
  const kueskiDebt = consolidatedData.debts.find(debt => 
    debt.creditor.toLowerCase().includes('kueski')
  ) || { creditor: 'KueskiPay', balance: 500, payment: 100 }
  
  const kueskiProgress = ((500 - kueskiDebt.balance) / 500) * 100

  return (
    <AppLayout>
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Progreso Financiero</h1>
            <p className="text-gray-600">Seguimiento de tus metas y logros</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {formatCurrency(consolidatedData.monthlyIncome)}
                </div>
                <div className="text-xs text-gray-600">Ingresos</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {formatCurrency(consolidatedData.savingsCapacity)}
                </div>
                <div className="text-xs text-gray-600">Capacidad Ahorro</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {consolidatedData.activeGoals?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Metas Activas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {consolidatedData.debts?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Deudas</div>
              </CardContent>
            </Card>
          </div>

          {/* Kueski Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progreso Kueski
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Pagado</span>
                  <span>
                    {formatCurrency(500 - kueskiDebt.balance)} / {formatCurrency(500)}
                  </span>
                </div>
                <Progress value={kueskiProgress} className="w-full" />
                <div className="text-xs text-gray-600">
                  Balance restante: {formatCurrency(kueskiDebt.balance)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consolidatedData.activeGoals && consolidatedData.activeGoals.length > 0 ? (
                <div className="space-y-4">
                  {consolidatedData.activeGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="w-full" />
                      <div className="text-xs text-gray-600">
                        {Math.round(goal.progress)}% completado
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No tienes metas financieras definidas aún</p>
                  <p className="text-sm">Define tus objetivos para ver tu progreso</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ingresos</span>
                    <span className="font-medium text-green-600">
                      +{formatCurrency(consolidatedData.monthlyIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gastos</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(consolidatedData.monthlyExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pagos de deuda</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(consolidatedData.totalMonthlyDebtPayments)}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Balance</span>
                    <span className={
                      consolidatedData.savingsCapacity >= 0 
                        ? "text-green-600" 
                        : "text-red-600"
                    }>
                      {formatCurrency(consolidatedData.savingsCapacity)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Salud financiera: 
                    <span className="ml-2 font-medium text-primary">
                      {consolidatedData.savingsCapacity > 0 ? "Buena" : "Necesita mejora"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total en deudas: 
                    <span className="ml-2 font-medium">
                      {formatCurrency(consolidatedData.totalDebtBalance)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Fuente de datos: 
                    <span className="ml-2 font-medium">
                      {consolidatedData.hasRealData ? "Datos del usuario" : "Datos por defecto"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debug info - mostrar si no hay datos reales */}
          {!consolidatedData.hasRealData && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Información limitada disponible
                    </p>
                    <p className="text-xs text-yellow-700">
                      Complete el onboarding o verifique que sus datos se guardaron correctamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
