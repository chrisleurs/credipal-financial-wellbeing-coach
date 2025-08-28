import React, { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, DollarSign, Target, CreditCard, AlertCircle, Wrench, RefreshCw } from 'lucide-react'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { useOnboardingDataMigration } from '@/hooks/useOnboardingDataMigration'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export const UnifiedDashboard = () => {
  const { data: financialData, isLoading: isLoadingData } = useConsolidatedData()
  const { migrationStatus, isLoading: isMigrating, diagnoseData, migrateAllData } = useOnboardingDataMigration()
  const { toast } = useToast()

  console.log('🎯 DASHBOARD: Rendering with data:', {
    hasData: !!financialData,
    isLoadingData,
    isMigrating,
    monthlyIncome: financialData?.monthlyIncome,
    monthlyExpenses: financialData?.monthlyExpenses,
    hasRealData: financialData?.hasRealData,
    migrationNeeded: migrationStatus?.needsMigration
  })

  // Diagnosticar datos al cargar
  useEffect(() => {
    if (!isLoadingData && !isMigrating) {
      diagnoseData()
    }
  }, [isLoadingData])

  // Auto-migrar si es necesario
  useEffect(() => {
    if (migrationStatus?.needsMigration && !isMigrating) {
      console.log('🔄 DASHBOARD: Auto-migrating onboarding data')
      migrateAllData()
    }
  }, [migrationStatus?.needsMigration, isMigrating])

  const handleManualMigration = async () => {
    await diagnoseData()
    const success = await migrateAllData()
    if (!success) {
      toast({
        title: "Error en la migración",
        description: "Revisa la consola para más detalles",
        variant: "destructive"
      })
    }
  }

  if (isLoadingData || isMigrating) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <LoadingSpinner text={isMigrating ? "Migrando datos del onboarding..." : "Cargando información financiera..."} />
      </div>
    )
  }

  // Mostrar estado de migración si hay problemas
  if (migrationStatus?.needsMigration) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  Migrando datos del onboarding
                </h3>
                <p className="text-blue-700">
                  Estamos moviendo tus datos a las tablas correctas del dashboard
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Datos encontrados en onboarding:</h4>
              <ul className="text-sm space-y-1">
                <li>💰 Ingreso mensual: ${migrationStatus.onboardingData.monthlyIncome || 0}</li>
                <li>💰 Ingresos extra: ${migrationStatus.onboardingData.extraIncome || 0}</li>
                <li>💳 Deudas: {migrationStatus.onboardingData.debts?.length || 0}</li>
                <li>🎯 Metas: {migrationStatus.onboardingData.financialGoals?.length || 0}</li>
                <li>💵 Ahorros: ${migrationStatus.onboardingData.currentSavings || 0}</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Estado actual en tablas:</h4>
              <ul className="text-sm space-y-1">
                <li>📊 Fuentes de ingreso: {migrationStatus.tablesData.incomes}</li>
                <li>📊 Gastos: {migrationStatus.tablesData.expenses}</li>
                <li>📊 Deudas: {migrationStatus.tablesData.debts}</li>
                <li>📊 Metas: {migrationStatus.tablesData.goals}</li>
              </ul>
            </div>

            <Button onClick={handleManualMigration} className="w-full" disabled={isMigrating}>
              <Wrench className="h-4 w-4 mr-2" />
              {isMigrating ? 'Migrando...' : 'Migrar datos ahora'}
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
            <p className="text-gray-600 mb-4">Complete el proceso de onboarding para ver su información</p>
            <Button onClick={handleManualMigration}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Diagnosticar datos
            </Button>
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
          <h1 className="text-2xl font-bold text-gray-900">¡Hola Karen! 👋</h1>
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

        {/* Botón de diagnóstico manual */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">¿Faltan datos?</p>
                <p className="text-xs text-gray-600">Diagnostica y migra datos del onboarding</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleManualMigration}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Diagnosticar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estado de datos */}
        <Card className={financialData.hasRealData ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className={`h-5 w-5 ${financialData.hasRealData ? 'text-green-600' : 'text-yellow-600'}`} />
              <div>
                <p className={`text-sm font-medium ${financialData.hasRealData ? 'text-green-800' : 'text-yellow-800'}`}>
                  {financialData.hasRealData ? 'Datos consolidados cargados' : 'Usando datos por defecto'}
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
