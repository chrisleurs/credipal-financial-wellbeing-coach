
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CompletePlanViewer } from '@/components/plan/CompletePlanViewer'
import { Brain, RefreshCw, AlertCircle, ArrowLeft, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

export default function Progress() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { 
    activePlan, 
    hasPlan, 
    generatePlan, 
    isGenerating, 
    isLoadingPlan,
    regeneratePlan,
    updateGoalProgress,
    financialData
  } = useFinancialPlanManager()

  const [lastDataHash, setLastDataHash] = useState<string>('')
  const [hasDataChanged, setHasDataChanged] = useState(false)

  // Log del estado actual para debugging
  console.log('📄 Progress Page - Plan Manager State:', {
    hasPlan,
    isLoadingPlan,
    planError: 'none',
    isGenerating,
    activePlan: activePlan ? 'exists' : 'null',
    userEmail: user?.email,
    financialData: financialData ? {
      monthlyIncome: financialData.monthlyIncome,
      monthlyExpenses: financialData.monthlyExpenses,
      hasRealData: financialData.hasRealData
    } : 'loading'
  })

  // Generar hash de los datos financieros para detectar cambios
  const generateDataHash = (data: any) => {
    if (!data) return ''
    
    const relevantData = {
      monthlyIncome: data.monthlyIncome,
      monthlyExpenses: data.monthlyExpenses,
      currentSavings: data.currentSavings,
      debtsCount: data.activeDebts?.length || 0,
      goalsCount: data.activeGoals?.length || 0,
      expenseCategoriesCount: Object.keys(data.expenseCategories || {}).length
    }
    
    return JSON.stringify(relevantData)
  }

  // Detectar cambios en los datos financieros
  useEffect(() => {
    if (!financialData || isLoadingPlan) return

    const currentHash = generateDataHash(financialData)
    
    if (lastDataHash === '') {
      setLastDataHash(currentHash)
    } else if (lastDataHash !== currentHash) {
      setHasDataChanged(true)
      setLastDataHash(currentHash)
      
      toast({
        title: "Datos actualizados detectados",
        description: "Tu información financiera ha cambiado. Considera actualizar tu plan.",
      })
    }
  }, [financialData, isLoadingPlan, lastDataHash, toast])

  // Función para generar plan inicial
  const handleGeneratePlan = async () => {
    if (!financialData) {
      toast({
        title: "Datos no disponibles",
        description: "Por favor espera mientras cargamos tu información financiera.",
        variant: "destructive"
      })
      return
    }

    // Verificar si tiene al menos gastos para generar un plan básico
    if (financialData.monthlyExpenses === 0 && (!financialData.expenseCategories || Object.keys(financialData.expenseCategories).length === 0)) {
      toast({
        title: "Datos insuficientes",
        description: "Agrega información sobre gastos para generar un plan.",
        variant: "destructive"
      })
      return
    }

    console.log('📤 Generating plan with financial data:', financialData)
    
    await generatePlan()
    setHasDataChanged(false)
  }

  // Función para actualizar plan existente
  const handleUpdatePlan = async () => {
    await regeneratePlan()
    setHasDataChanged(false)
    
    toast({
      title: "Plan actualizado",
      description: "Tu plan financiero ha sido actualizado con la información más reciente.",
    })
  }

  // Función para actualizar progreso de acciones
  const handleUpdateProgress = (actionId: string, progress: number) => {
    updateGoalProgress({ goalId: actionId, progress })
  }

  if (isLoadingPlan || !financialData) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando información del plan..." />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          
          {/* Header con información del usuario */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <User className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">
                Mi Progreso Financiero
              </h1>
            </div>
            <p className="text-gray-600">
              Usuario: <span className="font-medium">{user?.email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Seguimiento detallado de tus metas y avances
            </p>
            {activePlan && (
              <p className="text-sm text-gray-500">
                Plan ID: {activePlan.id} • Último actualizado: {new Date(activePlan.generatedAt).toLocaleDateString('es-MX')}
              </p>
            )}
          </div>

          {/* Estado del Plan */}
          {!hasPlan ? (
            // No hay plan - Mostrar opción para generar
            <Card className="mb-8 border-2 border-dashed border-primary/30">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Generar tu Plan Financiero</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Basado en tu información del onboarding, podemos crear tu plan personalizado.
                </p>
                
                {/* Mostrar resumen de datos disponibles */}
                {financialData && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-900 mb-2">Tu información actual:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                      <div>
                        <span className="font-medium">Gastos mensuales:</span>
                        <p>${financialData.monthlyExpenses.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Ingresos mensuales:</span>
                        <p>${financialData.monthlyIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Deudas activas:</span>
                        <p>{financialData.activeDebts?.length || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">Categorías de gastos:</span>
                        <p>{Object.keys(financialData.expenseCategories || {}).length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {financialData.monthlyExpenses > 0 || Object.keys(financialData.expenseCategories || {}).length > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-800">
                      <Brain className="h-5 w-5" />
                      <span className="font-medium">Listo para generar</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Tienes información suficiente para crear tu plan personalizado.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Información limitada</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      Agrega más información sobre gastos e ingresos para un mejor plan.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generando Plan...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generar Mi Plan Financiero
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Hay plan - Mostrar plan completo y opción de actualizar
            <>
              {/* Notificación de cambios detectados */}
              {hasDataChanged && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div>
                          <h3 className="font-medium text-orange-900">
                            Cambios detectados en tu información
                          </h3>
                          <p className="text-sm text-orange-700">
                            Tu plan puede estar desactualizado. Considera actualizarlo.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleUpdatePlan}
                        disabled={isGenerating}
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Actualizar Plan
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Botón de actualización fijo */}
              <div className="mb-6 text-right">
                <Button
                  onClick={handleUpdatePlan}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Actualizar Plan
                    </>
                  )}
                </Button>
              </div>

              {/* Plan Completo */}
              {activePlan && (
                <CompletePlanViewer 
                  plan={activePlan} 
                  onUpdateProgress={handleUpdateProgress}
                />
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
