
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { formatCurrency } from '@/utils/helpers'
import { AlertTriangle, CheckCircle, Database, TrendingUp } from 'lucide-react'

export default function DataAudit() {
  const { data: unifiedData, isLoading: unifiedLoading } = useUnifiedFinancialData()
  const { data: optimizedData, isLoading: optimizedLoading } = useOptimizedFinancialData()

  if (unifiedLoading || optimizedLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Auditoría de Datos</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  const hasDataDiscrepancy = unifiedData && optimizedData && (
    Math.abs(unifiedData.monthlyIncome - optimizedData.monthlyIncome) > 0.01 ||
    Math.abs(unifiedData.monthlyExpenses - optimizedData.monthlyExpenses) > 0.01 ||
    unifiedData.debts.length !== optimizedData.activeDebts.length ||
    unifiedData.financialGoals.length !== optimizedData.activeGoals.length
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Auditoría de Datos Financieros</h1>
      
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Unified Data Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Datos Unificados (Nuevo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unifiedData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Ingresos Mensuales:</span>
                  <span className="font-semibold">{formatCurrency(unifiedData.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos Mensuales:</span>
                  <span className="font-semibold">{formatCurrency(unifiedData.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deudas:</span>
                  <span className="font-semibold">{unifiedData.debts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metas:</span>
                  <span className="font-semibold">{unifiedData.financialGoals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiene Datos:</span>
                  <Badge variant={unifiedData.hasRealData ? "default" : "secondary"}>
                    {unifiedData.hasRealData ? "Sí" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Fuente:</span>
                  <Badge variant="outline">Onboarding</Badge>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos unificados disponibles</p>
            )}
          </CardContent>
        </Card>

        {/* Optimized Data Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Datos Optimizados (Actual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {optimizedData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Ingresos Mensuales:</span>
                  <span className="font-semibold">{formatCurrency(optimizedData.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos Mensuales:</span>
                  <span className="font-semibold">{formatCurrency(optimizedData.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deudas:</span>
                  <span className="font-semibold">{optimizedData.activeDebts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metas:</span>
                  <span className="font-semibold">{optimizedData.activeGoals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiene Datos:</span>
                  <Badge variant={optimizedData.hasRealData ? "default" : "secondary"}>
                    {optimizedData.hasRealData ? "Sí" : "No"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos optimizados disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Discrepancy Alert */}
      {hasDataDiscrepancy && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">
                  Discrepancias Detectadas
                </h3>
                <p className="text-orange-700 text-sm">
                  Los datos entre las fuentes unificada y optimizada no coinciden. 
                  Esto puede indicar problemas de sincronización.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Discrepancy Success */}
      {!hasDataDiscrepancy && unifiedData && optimizedData && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">
                  Datos Sincronizados
                </h3>
                <p className="text-green-700 text-sm">
                  Ambas fuentes de datos están sincronizadas correctamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
