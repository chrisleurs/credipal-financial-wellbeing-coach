
import React, { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, DollarSign, Target, CreditCard, AlertCircle, Wrench } from 'lucide-react'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { useDataDiagnostic } from '@/hooks/useDataDiagnostic'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export const UnifiedDashboard = () => {
  const { data: financialData, isLoading: isLoadingData } = useConsolidatedData()
  const { diagnostic, isLoading: isLoadingDiagnostic, repairData, needsRepair } = useDataDiagnostic()
  const { toast } = useToast()

  console.log('🎯 DASHBOARD: Rendering with data:', {
    hasData: !!financialData,
    isLoadingData,
    isLoadingDiagnostic,
    needsRepair,
    monthlyIncome: financialData?.monthlyIncome,
    monthlyExpenses: financialData?.monthlyExpenses,
    hasRealData: financialData?.hasRealData
  })

  // Auto-reparar datos si es necesario
  useEffect(() => {
    if (needsRepair && !isLoadingDiagnostic) {
      console.log('🔧 DASHBOARD: Auto-repairing data issues')
      repairData().then((success) => {
        if (success) {
          toast({
            title: "Datos reparados",
            description: "Se ha corregido la información faltante del dashboard",
          })
          // Recargar la página para mostrar los datos actualizados
          setTimeout(() => window.location.reload(), 1000)
        }
      })
    }
  }, [needsRepair, isLoadingDiagnostic])

  const handleManualRepair = async () => {
    const success = await repairData()
    if (success) {
      toast({
        title: "Reparación completada",
        description: "Los datos han sido migrados correctamente",
      })
      setTimeout(() => window.location.reload(), 1000)
    } else {
      toast({
        title: "Error en la reparación",
        description: "No se pudieron migrar los datos correctamente",
        variant: "destructive"
      })
    }
  }

  if (isLoadingData || isLoadingDiagnostic) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <LoadingSpinner text="Cargando información financiera..." />
      </div>
    )
  }

  // Mostrar diagnóstico si hay problemas
  if (needsRepair) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800">
                  Detectamos un problema con tus datos
                </h3>
                <p className="text-orange-700">
                  Tus datos del onboarding no se están mostrando correctamente
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Diagnóstico:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Perfil encontrado: {diagnostic?.profileExists ? 'Sí' : 'No'}</li>
                <li>✅ Onboarding completado: {diagnostic?.onboardingCompleted ? 'Sí' : 'No'}</li>
                <li>✅ Datos de onboarding: {diagnostic?.onboardingDataExists ? 'Encontrados' : 'No encontrados'}</li>
                <li>📊 Ingresos migrados: {diagnostic?.tablesData.incomes || 0}</li>
                <li>📊 Gastos migrados: {diagnostic?.tablesData.expenses || 0}</li>
                <li>📊 Metas migradas: {diagnostic?.tablesData.goals || 0}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-orange-700 font-medium">Acciones necesarias:</p>
              {diagnostic?.repairActions.map((action, index) => (
                <p key={index} className="text-sm text-orange-600">• {action}</p>
              ))}
            </div>

            <Button onClick={handleManualRepair} className="mt-4 w-full">
              <Wrench className="h-4 w-4 mr-2" />
              Reparar datos ahora
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!financialData) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
            <p className="text-gray-600">Complete el proceso de onboarding para ver su información</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Usar datos consolidados que DEBEN existir después de la reparación
  const monthlyIncome = financialData.monthlyIncome
  const monthlyExpenses = financialData.monthlyExpenses
  const totalDebtBalance = financialData.totalDebtBalance
  const savingsCapacity = financialData.savingsCapacity

  return (
    <div className="container mx-auto p-4 pb-20 max-w-4xl">
      <div className="space-y-6">
        {/* Header de bienvenida */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">¡Hola! 👋</h1>
          <p className="text-gray-600">Aquí está tu resumen financiero</p>
        </div>

        {/* Resumen financiero principal */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${monthlyIncome.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">por mes</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gastos</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${monthlyExpenses.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">por mes</p>
                </div>
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Deuda Total</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${totalDebtBalance.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">incluye Kueski</p>
                </div>
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disponible</p>
                  <p className={`text-2xl font-bold ${
                    savingsCapacity >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    ${savingsCapacity.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">por mes</p>
                </div>
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de categorías de gastos */}
        {Object.keys(financialData.expenseCategories).length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Gastos por Categoría</h3>
              <div className="space-y-3">
                {Object.entries(financialData.expenseCategories).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{category}</span>
                    <span className="text-sm font-medium">${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metas financieras */}
        {financialData.financialGoals.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Metas Financieras</h3>
              <div className="space-y-3">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado de datos */}
        <Card className={financialData.hasRealData ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className={`h-5 w-5 ${financialData.hasRealData ? 'text-green-600' : 'text-yellow-600'}`} />
              <div>
                <p className={`text-sm font-medium ${financialData.hasRealData ? 'text-green-800' : 'text-yellow-800'}`}>
                  {financialData.hasRealData ? 'Datos del onboarding cargados correctamente' : 'Usando datos por defecto'}
                </p>
                <p className={`text-xs ${financialData.hasRealData ? 'text-green-700' : 'text-yellow-700'}`}>
                  Fuente: {financialData.dataSource}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
