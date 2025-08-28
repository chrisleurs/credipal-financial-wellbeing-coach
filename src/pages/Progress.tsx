
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react'

export default function ProgressPage() {
  const { data: financialData, isLoading } = useUnifiedFinancialData()

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

  const kueskiProgress = financialData?.kueskiDebt ? 
    ((500 - financialData.kueskiDebt.balance) / 500) * 100 : 0

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
                  ${financialData?.monthlyIncome || 0}
                </div>
                <div className="text-xs text-gray-600">Ingresos</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  ${financialData?.savingsCapacity || 0}
                </div>
                <div className="text-xs text-gray-600">Capacidad Ahorro</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {Array.isArray(financialData?.financialGoals) ? financialData.financialGoals.length : 0}
                </div>
                <div className="text-xs text-gray-600">Metas Activas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {financialData?.debts?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Deudas</div>
              </CardContent>
            </Card>
          </div>

          {/* Kueski Progress */}
          {financialData?.kueskiDebt && (
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
                      ${500 - financialData.kueskiDebt.balance} / $500
                    </span>
                  </div>
                  <Progress value={kueskiProgress} className="w-full" />
                  <div className="text-xs text-gray-600">
                    Pagos restantes: {financialData.kueskiDebt.remainingPayments}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(financialData?.financialGoals) && financialData.financialGoals.length > 0 ? (
                <div className="space-y-4">
                  {financialData.financialGoals.map((goal, index) => {
                    // Handle case where goals might be strings instead of objects
                    if (typeof goal === 'string') {
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{goal}</span>
                            <span className="text-sm text-gray-600">En progreso</span>
                          </div>
                          <Progress value={0} className="w-full" />
                        </div>
                      )
                    }
                    
                    // Handle case where goals are proper objects
                    const progress = goal.target_amount ? (goal.current_amount / goal.target_amount) * 100 : 0
                    return (
                      <div key={goal.id || index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{goal.title}</span>
                          <span className="text-sm text-gray-600">
                            ${goal.current_amount || 0} / ${goal.target_amount || 0}
                          </span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    )
                  })}
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
                      +${financialData?.monthlyIncome || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gastos</span>
                    <span className="font-medium text-red-600">
                      -${financialData?.monthlyExpenses || 0}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Balance</span>
                    <span className={
                      (financialData?.savingsCapacity || 0) >= 0 
                        ? "text-green-600" 
                        : "text-red-600"
                    }>
                      ${financialData?.savingsCapacity || 0}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Salud financiera: 
                    <span className="ml-2 font-medium text-primary">
                      {(financialData?.savingsCapacity || 0) > 0 ? "Buena" : "Necesita mejora"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
