
import React from 'react'
import { useUserSpecificData } from '@/hooks/useUserSpecificData'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AppLayout } from '@/components/layout/AppLayout'

export default function Plan() {
  const { data: financialData, isLoading, error } = useUserSpecificData()
  const { activePlan, generatePlan, isGenerating, hasPlan } = useFinancialPlanManager()

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando tu plan financiero..." />
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
              Error cargando datos
            </h2>
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'No se pudieron cargar los datos del usuario'}
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
          <h1 className="text-2xl font-bold mb-6">Tu Plan Financiero</h1>
          
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              Completa tu información financiera
            </h2>
            <p className="text-gray-600 mb-6">
              Para generar tu plan personalizado, necesitamos que completes el onboarding.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Usuario: {financialData.userId}
            </p>
            <Button onClick={() => window.location.href = '/onboarding'}>
              Completar Onboarding
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header con información del usuario */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-blue-800 mb-1">
            Plan Financiero Personal
          </h2>
          <p className="text-xs text-blue-600">
            Usuario: {financialData.userId} | 
            Última actualización: {new Date(financialData.lastUpdated).toLocaleString()}
          </p>
        </div>

        <h1 className="text-2xl font-bold mb-6">Tu Plan Financiero</h1>

        {/* Resumen financiero actual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${financialData.monthlyIncome.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">
                {financialData.incomeBreakdown.length} fuente(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gastos Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${financialData.monthlyExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">
                {Object.keys(financialData.expenseCategories).length} categoría(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Deudas Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${financialData.totalDebtBalance.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">
                {financialData.activeDebts.length} deuda(s) activa(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Capacidad de Ahorro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${financialData.savingsCapacity.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">
                Por mes disponible
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Metas activas */}
        {financialData.activeGoals.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tus Metas Financieras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData.activeGoals.map((goal, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <span className="text-sm text-gray-500">
                        {goal.progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${goal.current.toLocaleString()} ahorrado</span>
                      <span>Meta: ${goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado del plan */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {hasPlan ? (
              <div>
                <p className="text-green-600 mb-4">✅ Tienes un plan financiero activo</p>
                <Button 
                  onClick={() => generatePlan()} 
                  disabled={isGenerating}
                  variant="outline"
                >
                  {isGenerating ? 'Regenerando...' : 'Actualizar Plan'}
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Basándote en tus datos actuales, podemos generar un plan personalizado para ti.
                </p>
                <Button 
                  onClick={() => generatePlan()} 
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generando...' : 'Generar Mi Plan'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
