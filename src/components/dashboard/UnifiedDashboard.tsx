
/**
 * Dashboard unificado que usa los nuevos hooks simplificados
 */

import React from 'react'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { useSimplifiedPlanGenerator } from '@/hooks/useSimplifiedPlanGenerator'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/helpers'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  CreditCard,
  Calendar,
  CheckCircle2
} from 'lucide-react'

export const UnifiedDashboard = () => {
  const { user } = useAuth()
  const { data: financialData, isLoading: dataLoading } = useUnifiedFinancialData()
  const { generatedPlan, generatePlan, isGenerating } = useSimplifiedPlanGenerator()

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu información financiera..." />
      </div>
    )
  }

  if (!financialData?.hasRealData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            Completa tu información financiera
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitamos más información para crear tu plan personalizado.
          </p>
          <Button onClick={() => window.location.href = '/onboarding'}>
            Ir al Onboarding
          </Button>
        </div>
      </div>
    )
  }

  const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Header personalizado */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            ¡Hola {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Aquí está tu resumen financiero y plan de acción
          </p>
        </div>

        {/* Resumen financiero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialData.monthlyIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                por mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(financialData.monthlyExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                por mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deuda Total</CardTitle>
              <CreditCard className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(financialData.totalDebtBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(financialData.totalMonthlyDebtPayments)}/mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponible</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(financialData.savingsCapacity)}
              </div>
              <p className="text-xs text-muted-foreground">
                por mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Información de KueskiPay destacada */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <CreditCard className="h-5 w-5" />
              Tu préstamo KueskiPay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-orange-700">Saldo pendiente</p>
                <p className="text-xl font-bold text-orange-800">
                  ${financialData.kueskiDebt.balance} USD
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Pago mensual</p>
                <p className="text-xl font-bold text-orange-800">
                  ${financialData.kueskiDebt.monthlyPayment} USD
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Pagos restantes</p>
                <p className="text-xl font-bold text-orange-800">
                  {financialData.kueskiDebt.remainingPayments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan financiero */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Tu Plan Financiero
              </CardTitle>
              {!generatedPlan && (
                <Button 
                  onClick={() => generatePlan(financialData)}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generando...' : 'Generar Plan'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {generatedPlan ? (
              <div className="space-y-4">
                {/* Progreso del plan */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progreso del Plan</span>
                    <span className="text-sm font-bold">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>

                {/* Acciones del roadmap */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Plan de Acción:</h4>
                  {generatedPlan.actionRoadmap.map((action) => (
                    <div 
                      key={action.step}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {action.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-primary/30 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {action.step}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{action.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {action.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(action.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  ¡Genera tu plan financiero personalizado!
                </p>
                <p className="text-sm text-muted-foreground">
                  Basado en tus ingresos, gastos y deudas actuales.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
