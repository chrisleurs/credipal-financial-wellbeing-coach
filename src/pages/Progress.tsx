
import React from 'react'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { ComprehensivePlanView } from '@/components/dashboard/ComprehensivePlanView'

export default function Progress() {
  const { 
    plan,
    loading,
    error,
    regeneratePlan,
    isGenerating,
    hasPlan,
    hasCompleteData,
    financialData
  } = useFinancialPlan()

  console.log('🔍 Progress Page - Current State:', {
    plan: !!plan,
    loading,
    error,
    hasPlan,
    hasCompleteData,
    financialData: !!financialData
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu plan financiero..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Error cargando el plan</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={regeneratePlan} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Regenerando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Intentar de nuevo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show plan generation option for users with some data but no income
  if (!hasPlan && financialData?.monthlyExpenses > 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Genera tu Plan Financiero</CardTitle>
              <CardDescription>
                Tienes datos de gastos registrados. Podemos crear un plan financiero 
                personalizado para ayudarte a optimizar tus finanzas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={regeneratePlan} disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generando tu plan...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generar Mi Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!hasCompleteData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Completa tu información financiera</CardTitle>
              <CardDescription>
                Para generar tu plan financiero personalizado, necesitamos que completes 
                tu perfil con ingresos, gastos y metas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/onboarding'}>
                Completar Información
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!hasPlan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Genera tu Plan Financiero</CardTitle>
              <CardDescription>
                Con tu información completa, podemos crear un plan financiero 
                personalizado powered by OpenAI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={regeneratePlan} disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generando tu plan...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generar Mi Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
              onClick={regeneratePlan} 
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
        {plan && <ComprehensivePlanView plan={plan} />}
      </div>
    </div>
  )
}
