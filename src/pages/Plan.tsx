
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ComprehensivePlanView } from '@/components/dashboard/ComprehensivePlanView'

export default function Plan() {
  const { toast } = useToast()
  const { data: financialData, isLoading: isLoadingData } = useOptimizedFinancialData()
  const { 
    activePlan, 
    hasPlan, 
    generatePlan, 
    isGenerating, 
    isLoadingPlan,
    regeneratePlan 
  } = useFinancialPlanManager()

  const [lastDataHash, setLastDataHash] = useState<string>('')
  const [hasDataChanged, setHasDataChanged] = useState(false)

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
    if (!financialData || isLoadingData) return

    const currentHash = generateDataHash(financialData)
    
    if (lastDataHash === '') {
      // Primera carga, guardar hash
      setLastDataHash(currentHash)
    } else if (lastDataHash !== currentHash) {
      // Datos han cambiado
      setHasDataChanged(true)
      setLastDataHash(currentHash)
      
      toast({
        title: "Datos actualizados detectados",
        description: "Tu información financiera ha cambiado. Considera actualizar tu plan.",
      })
    }
  }, [financialData, isLoadingData, lastDataHash, toast])

  // Función para generar plan inicial
  const handleGeneratePlan = async () => {
    if (!financialData?.hasRealData) {
      toast({
        title: "Datos insuficientes",
        description: "Agrega más información financiera antes de generar un plan.",
        variant: "destructive"
      })
      return
    }

    const planData = {
      monthlyIncome: financialData.monthlyIncome,
      monthlyExpenses: financialData.monthlyExpenses,
      currentSavings: financialData.currentSavings || 0,
      savingsCapacity: financialData.savingsCapacity,
      debts: financialData.activeDebts.map(debt => ({
        name: debt.creditor,
        amount: debt.balance,
        monthlyPayment: debt.payment
      })),
      goals: financialData.activeGoals.map(goal => goal.title),
      expenseCategories: financialData.expenseCategories || {}
    }

    await generatePlan(planData)
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

  if (isLoadingData || isLoadingPlan) {
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
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mi Plan Financiero
            </h1>
            <p className="text-gray-600">
              Tu estrategia personalizada para alcanzar tus metas financieras
            </p>
          </div>

          {/* Estado del Plan */}
          {!hasPlan ? (
            // No hay plan - Mostrar opción para generar
            <Card className="mb-8 border-2 border-dashed border-primary/30">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Genera tu Plan Financiero Personalizado</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  CrediPal analizará tu información financiera y creará un plan personalizado 
                  con estrategias específicas para tus metas.
                </p>
                
                {!financialData?.hasRealData ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Datos insuficientes</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      Agrega información sobre ingresos, gastos o deudas para generar tu plan.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Listo para generar</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Tienes suficiente información para crear tu plan personalizado.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleGeneratePlan}
                  disabled={isGenerating || !financialData?.hasRealData}
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
                      Generar Plan Financiero
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Hay plan - Mostrar plan y opción de actualizar
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

              {/* Plan Completo */}
              {activePlan && <ComprehensivePlanView plan={activePlan} />}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
