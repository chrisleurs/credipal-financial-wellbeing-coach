
import React from 'react'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Target, TrendingUp, AlertCircle, PlusCircle, BarChart3 } from 'lucide-react'
import { ComprehensivePlanView } from '@/components/dashboard/ComprehensivePlanView'

export default function Progress() {
  const { 
    plan,
    loading,
    error,
    generatePlan,
    isGenerating,
    hasPlan,
    hasCompleteData,
    canGeneratePlan,
    financialData
  } = useFinancialPlan()

  console.log('📄 Progress Page - Complete State Analysis:', {
    plan: !!plan,
    loading,
    error: error || 'none',
    hasPlan,
    hasCompleteData,
    canGeneratePlan,
    financialData: !!financialData,
    monthlyIncome: financialData?.monthlyIncome || 0,
    monthlyExpenses: financialData?.monthlyExpenses || 0
  })

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu información financiera..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Error cargando información</CardTitle>
              <CardDescription>
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar página
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show existing plan
  if (hasPlan && plan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Mi Plan Financiero</h1>
                <p className="text-muted-foreground">
                  Tu roadmap personalizado hacia la libertad financiera
                </p>
              </div>
              <Button 
                onClick={() => generatePlan()} 
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Regenerando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar Plan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Plan Content */}
          <ComprehensivePlanView plan={plan} />
        </div>
      </div>
    )
  }

  // Can generate plan but don't have one yet
  if (canGeneratePlan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>¡Genera tu Plan Financiero Personalizado!</CardTitle>
              <CardDescription>
                {financialData?.monthlyIncome > 0 ? (
                  <>Tienes información completa. Podemos crear un plan financiero 
                  personalizado powered by OpenAI.</>
                ) : (
                  <>Tienes gastos registrados. Podemos crear un plan optimizado 
                  para ayudarte a controlar tus finanzas y generar ingresos.</>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {financialData?.monthlyIncome > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${financialData.monthlyIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700">Ingresos Mensuales</div>
                  </div>
                )}
                {financialData?.monthlyExpenses > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      ${financialData.monthlyExpenses.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-700">Gastos Mensuales</div>
                  </div>
                )}
              </div>

              <Button onClick={() => generatePlan()} disabled={isGenerating} size="lg" className="w-full">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generando tu plan personalizado...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generar Mi Plan con IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // No data - redirect to onboarding or data entry
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle>Completa tu Información Financiera</CardTitle>
            <CardDescription>
              Para generar tu plan financiero personalizado, necesitamos información 
              sobre tus ingresos, gastos y metas financieras.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.href = '/onboarding'}
                variant="default"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Completar Información
              </Button>
              <Button 
                onClick={() => window.location.href = '/expenses'}
                variant="outline"
              >
                <Target className="h-4 w-4 mr-2" />
                Agregar Gastos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
