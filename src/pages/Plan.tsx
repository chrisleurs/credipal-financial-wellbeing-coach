
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { useOnboardingDataMigration } from '@/hooks/useOnboardingDataMigration'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, AlertCircle, FileText } from 'lucide-react'
import { PersonalizedPlanDocument } from '@/components/plan/PersonalizedPlanDocument'

export default function Plan() {
  const { data: financialData, isLoading: isLoadingData } = useOptimizedFinancialData()
  const { isMigrating } = useOnboardingDataMigration()

  if (isLoadingData || isMigrating) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando tu plan financiero..." />
        </div>
      </AppLayout>
    )
  }

  const hasMinimalData = financialData && (
    financialData.monthlyIncome > 0 || 
    financialData.monthlyExpenses > 0 || 
    financialData.totalDebtBalance > 0 ||
    financialData.activeGoals.length > 0
  )

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-emerald-600" />
              Mi Plan Financiero
            </h1>
            <p className="text-gray-600">
              Tu estrategia personalizada redactada especialmente para ti
            </p>
          </div>

          {!hasMinimalData ? (
            // No hay datos suficientes
            <Card className="mb-8 border-2 border-dashed border-primary/30">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Completa tu Información Financiera</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-yellow-800 justify-center">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Datos insuficientes</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Para crear tu plan personalizado, necesito que agregues información sobre 
                    tus ingresos, gastos o deudas en las secciones correspondientes.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/expenses'}>
                    Agregar Gastos
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/debts'}>
                    Agregar Deudas
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Mostrar el plan personalizado
            <PersonalizedPlanDocument financialData={financialData} />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
