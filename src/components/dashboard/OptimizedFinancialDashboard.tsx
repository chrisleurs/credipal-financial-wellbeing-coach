
/**
 * Dashboard optimizado que usa los nuevos hooks y servicios
 */

import React, { useState } from 'react'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MetricCard } from './MetricCard'
import { HeroCoachCard } from '@/components/coach/HeroCoachCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/helpers'
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Target,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

export const OptimizedFinancialDashboard = () => {
  const { data: financialData, isLoading, error, refetch } = useOptimizedFinancialData()
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown'>('overview')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando dashboard optimizado..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
            <p className="text-muted-foreground mb-4">
              No se pudieron cargar tus datos financieros.
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!financialData?.hasRealData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">¡Completa tu perfil financiero!</h1>
            <p className="text-muted-foreground mb-6">
              Para ver tu dashboard personalizado, necesitas agregar al menos una fuente de ingresos o gastos.
            </p>
            <div className="space-y-2">
              <Button className="w-full">Agregar Ingresos</Button>
              <Button variant="outline" className="w-full">Agregar Gastos</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePlanGenerated = (planData: any) => {
    console.log('Plan generado:', planData)
    // Aquí puedes manejar la respuesta del plan generado
    // Por ejemplo, mostrar un modal, navegar a otra página, etc.
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Coach Card - Reemplaza el header básico */}
        <div className="mb-8">
          <HeroCoachCard 
            userData={financialData}
            onGeneratePlan={handlePlanGenerated}
            onRefresh={refetch}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
            >
              Resumen
            </Button>
            <Button
              variant={activeTab === 'breakdown' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('breakdown')}
            >
              Desglose
            </Button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Ingresos Mensuales"
                value={formatCurrency(financialData.monthlyIncome)}
                icon={DollarSign}
                className="bg-green-50 border-green-200"
              />
              <MetricCard
                title="Gastos Mensuales"
                value={formatCurrency(financialData.monthlyExpenses)}
                icon={CreditCard}
                className="bg-red-50 border-red-200"
              />
              <MetricCard
                title="Balance Mensual"
                value={formatCurrency(financialData.monthlyBalance)}
                icon={TrendingUp}
                className={financialData.monthlyBalance >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"}
              />
              <MetricCard
                title="Total Deudas"
                value={formatCurrency(financialData.totalDebtBalance)}
                icon={Target}
                className="bg-purple-50 border-purple-200"
              />
            </div>

            {/* Financial Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Capacidad de ahorro:</span>
                      <span className={`font-semibold ${
                        financialData.savingsCapacity >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(financialData.savingsCapacity)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagos de deuda mensuales:</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(financialData.totalMonthlyDebtPayments)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Metas activas:</span>
                      <span className="font-semibold">
                        {financialData.activeGoals.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progreso total metas:</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(financialData.totalGoalsCurrent)} / {formatCurrency(financialData.totalGoalsTarget)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="space-y-6">
            {/* Expense Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(financialData.expenseCategories).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <span className="font-semibold">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Income Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Fuentes de Ingreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financialData.incomeBreakdown.map((income, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span>{income.source}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({income.frequency})
                        </span>
                      </div>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(income.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Goals */}
            {financialData.activeGoals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Metas Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialData.activeGoals.map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{goal.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {goal.progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(goal.progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{formatCurrency(goal.current)}</span>
                          <span>{formatCurrency(goal.target)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
