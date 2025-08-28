
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { DataCleanupDashboard } from '@/components/debug/DataCleanupDashboard'
import { DataAuditDashboard } from '@/components/debug/DataAuditDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { Database, GitCompare } from 'lucide-react'

export default function DataAudit() {
  const { data: unifiedData, isLoading: isLoadingUnified } = useUnifiedFinancialData()
  const { data: optimizedData, isLoading: isLoadingOptimized } = useOptimizedFinancialData()

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Database className="h-6 w-6" />
          Auditoría de Datos Financieros
        </h1>
        
        {/* Data Cleanup Dashboard */}
        <DataCleanupDashboard />
        
        {/* Comparison between data sources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Comparación de Fuentes de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">
                  Datos Unificados (Nueva Fuente)
                </h3>
                {isLoadingUnified ? (
                  <p className="text-gray-500">Cargando...</p>
                ) : unifiedData ? (
                  <div className="space-y-2 text-sm">
                    <p><strong>Ingresos:</strong> ${unifiedData.monthlyIncome?.toLocaleString()}</p>
                    <p><strong>Gastos:</strong> ${unifiedData.monthlyExpenses?.toLocaleString()}</p>
                    <p><strong>Deudas:</strong> ${unifiedData.totalDebtBalance?.toLocaleString()}</p>
                    <p><strong>Capacidad Ahorro:</strong> ${unifiedData.savingsCapacity?.toLocaleString()}</p>
                    <p><strong>Fuente:</strong> {unifiedData.dataSource}</p>
                    <p><strong>Tiene Datos:</strong> {unifiedData.hasRealData ? 'Sí' : 'No'}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No hay datos</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-orange-600">
                  Datos Optimizados (Fuente Original)
                </h3>
                {isLoadingOptimized ? (
                  <p className="text-gray-500">Cargando...</p>
                ) : optimizedData ? (
                  <div className="space-y-2 text-sm">
                    <p><strong>Ingresos:</strong> ${optimizedData.monthlyIncome?.toLocaleString()}</p>
                    <p><strong>Gastos:</strong> ${optimizedData.monthlyExpenses?.toLocaleString()}</p>
                    <p><strong>Deudas:</strong> ${optimizedData.totalDebtBalance?.toLocaleString()}</p>
                    <p><strong>Capacidad Ahorro:</strong> ${optimizedData.savingsCapacity?.toLocaleString()}</p>
                    <p><strong>Fuente:</strong> ONBOARDING_PROFILE</p>
                    <p><strong>Tiene Datos:</strong> {optimizedData.hasRealData ? 'Sí' : 'No'}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No hay datos</p>
                )}
              </div>
            </div>
            
            {unifiedData && optimizedData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Diferencias Detectadas:</h4>
                <div className="space-y-1 text-sm">
                  {unifiedData.monthlyIncome !== optimizedData.monthlyIncome && (
                    <p className="text-red-600">
                      ⚠️ Diferencia en ingresos: ${Math.abs(unifiedData.monthlyIncome - optimizedData.monthlyIncome).toLocaleString()}
                    </p>
                  )}
                  {unifiedData.monthlyExpenses !== optimizedData.monthlyExpenses && (
                    <p className="text-red-600">
                      ⚠️ Diferencia en gastos: ${Math.abs(unifiedData.monthlyExpenses - optimizedData.monthlyExpenses).toLocaleString()}
                    </p>
                  )}
                  {unifiedData.totalDebtBalance !== optimizedData.totalDebtBalance && (
                    <p className="text-red-600">
                      ⚠️ Diferencia en deudas: ${Math.abs(unifiedData.totalDebtBalance - optimizedData.totalDebtBalance).toLocaleString()}
                    </p>
                  )}
                  {unifiedData.monthlyIncome === optimizedData.monthlyIncome && 
                   unifiedData.monthlyExpenses === optimizedData.monthlyExpenses && 
                   unifiedData.totalDebtBalance === optimizedData.totalDebtBalance && (
                    <p className="text-green-600">✅ Los datos coinciden entre ambas fuentes</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Original Data Audit Dashboard */}
        <DataAuditDashboard />
      </div>
    </AppLayout>
  )
}
