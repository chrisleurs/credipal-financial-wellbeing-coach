
import React from 'react'
import { useUserSpecificData } from '@/hooks/useUserSpecificData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AppLayout } from '@/components/layout/AppLayout'
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react'

export default function ProgressPage() {
  const { data: financialData, isLoading, error } = useUserSpecificData()

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando tu progreso financiero..." />
        </div>
      </AppLayout>
    )
  }

  if (error || !financialData) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error cargando progreso
            </h2>
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'No se pudo cargar el progreso del usuario'}
            </p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!financialData.hasRealData) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Tu Progreso Financiero</h1>
          
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              Sin datos suficientes para mostrar progreso
            </h2>
            <p className="text-gray-600 mb-6">
              Completa el onboarding y registra algunas transacciones para ver tu progreso.
            </p>
            <p className="text-sm text-gray-500">
              Usuario: {financialData.userId}
            </p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Calcular métricas de progreso
  const totalIncome = financialData.monthlyIncome
  const totalExpenses = financialData.monthlyExpenses
  const netBalance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (financialData.savingsCapacity / totalIncome) * 100 : 0
  const debtToIncomeRatio = totalIncome > 0 ? (financialData.totalDebtBalance / (totalIncome * 12)) * 100 : 0

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header con información del usuario */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-blue-800 mb-1">
            Progreso Financiero Personal
          </h2>
          <p className="text-xs text-blue-600">
            Usuario: {financialData.userId} | 
            Fuente: {financialData.dataSource} |
            Última actualización: {new Date(financialData.lastUpdated).toLocaleString()}
          </p>
        </div>

        <h1 className="text-2xl font-bold mb-6">Tu Progreso Financiero</h1>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {netBalance >= 0 ? 'Superávit' : 'Déficit'} mensual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Ahorro</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {savingsRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                De tus ingresos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ratio Deuda/Ingreso</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${debtToIncomeRatio > 30 ? 'text-red-600' : 'text-green-600'}`}>
                {debtToIncomeRatio.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {debtToIncomeRatio > 30 ? 'Alto riesgo' : 'Saludable'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metas Activas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {financialData.activeGoals.length}
              </div>
              <p className="text-xs text-muted-foreground">
                En progreso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progreso de metas */}
        {financialData.activeGoals.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progreso de Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {financialData.activeGoals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <span className="text-sm font-medium">
                        {goal.progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${goal.current.toLocaleString()} completado</span>
                      <span>Meta: ${goal.target.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Faltan: ${(goal.target - goal.current).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desglose de ingresos */}
        {financialData.incomeBreakdown.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Fuentes de Ingreso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financialData.incomeBreakdown.map((income, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{income.source}</p>
                      <p className="text-sm text-gray-500">
                        Frecuencia: {income.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ${income.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((income.amount / totalIncome) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categorías de gastos */}
        {Object.keys(financialData.expenseCategories).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(financialData.expenseCategories).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <p className="font-medium">{category}</p>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        ${amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {((amount / totalExpenses) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
