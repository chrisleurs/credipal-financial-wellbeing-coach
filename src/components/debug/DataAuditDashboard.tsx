
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export const DataAuditDashboard = () => {
  const { user } = useAuth()
  const { data: unifiedData, isLoading: unifiedLoading } = useUnifiedFinancialData()
  const { data: optimizedData, isLoading: optimizedLoading } = useOptimizedFinancialData()
  const { consolidatedData, isLoading: consolidatedLoading } = useConsolidatedFinancialData()
  const { activePlan, isLoadingPlan } = useFinancialPlanManager()

  // Query directo a las tablas principales
  const { data: rawTablesData } = useQuery({
    queryKey: ['raw-tables-audit', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const [
        profilesResult,
        incomesResult,
        expensesResult,
        debtsResult,
        goalsResult,
        loansResult,
        onboardingExpensesResult,
        financialSummaryResult,
        financialPlansResult
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('income_sources').select('*').eq('user_id', user.id),
        supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(10),
        supabase.from('debts').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('loans').select('*').eq('user_id', user.id),
        supabase.from('onboarding_expenses').select('*').eq('user_id', user.id),
        supabase.from('financial_summary').select('*').eq('user_id', user.id).single(),
        supabase.from('financial_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ])

      return {
        profile: profilesResult.data,
        profileError: profilesResult.error,
        incomes: incomesResult.data || [],
        incomesError: incomesResult.error,
        expenses: expensesResult.data || [],
        expensesError: expensesResult.error,
        debts: debtsResult.data || [],
        debtsError: debtsResult.error,
        goals: goalsResult.data || [],
        goalsError: goalsResult.error,
        loans: loansResult.data || [],
        loansError: loansResult.error,
        onboardingExpenses: onboardingExpensesResult.data || [],
        onboardingExpensesError: onboardingExpensesResult.error,
        financialSummary: financialSummaryResult.data,
        financialSummaryError: financialSummaryResult.error,
        financialPlans: financialPlansResult.data || [],
        financialPlansError: financialPlansResult.error
      }
    },
    enabled: !!user?.id
  })

  const downloadAuditReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      userId: user?.id,
      rawData: rawTablesData,
      processedData: {
        unified: unifiedData,
        optimized: optimizedData,
        consolidated: consolidatedData,
        activePlan: activePlan
      }
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-data-audit-${user?.id}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return <div>Usuario no autenticado</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Auditoría de Datos Financieros</h1>
          <p className="text-muted-foreground">Usuario: {user.email} | ID: {user.id}</p>
        </div>
        <Button onClick={downloadAuditReport}>
          Descargar Reporte Completo
        </Button>
      </div>

      <Tabs defaultValue="raw-tables" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="raw-tables">Tablas BD</TabsTrigger>
          <TabsTrigger value="processed-hooks">Hooks Procesados</TabsTrigger>
          <TabsTrigger value="onboarding-data">Datos Onboarding</TabsTrigger>
          <TabsTrigger value="inconsistencies">Inconsistencias</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="raw-tables" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Profile Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Perfil
                  <Badge variant={rawTablesData?.profile ? 'default' : 'destructive'}>
                    {rawTablesData?.profile ? 'Existe' : 'Vacío'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {rawTablesData?.profileError && (
                  <div className="text-red-500 text-sm">Error: {rawTablesData.profileError.message}</div>
                )}
                {rawTablesData?.profile && (
                  <div className="text-sm space-y-1">
                    <div><strong>Onboarding completado:</strong> {rawTablesData.profile.onboarding_completed ? 'Sí' : 'No'}</div>
                    <div><strong>Paso actual:</strong> {rawTablesData.profile.onboarding_step}</div>
                    <div><strong>Tiene datos JSON:</strong> {Object.keys(rawTablesData.profile.onboarding_data || {}).length > 0 ? 'Sí' : 'No'}</div>
                    {rawTablesData.profile.onboarding_data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Ver datos JSON</summary>
                        <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                          {JSON.stringify(rawTablesData.profile.onboarding_data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Income Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Fuentes de Ingreso
                  <Badge variant={rawTablesData?.incomes.length ? 'default' : 'secondary'}>
                    {rawTablesData?.incomes.length || 0} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rawTablesData?.incomesError && (
                  <div className="text-red-500 text-sm">Error: {rawTablesData.incomesError.message}</div>
                )}
                {rawTablesData?.incomes.length > 0 ? (
                  <div className="space-y-2">
                    {rawTablesData.incomes.map((income, index) => (
                      <div key={income.id} className="text-sm border-b pb-2">
                        <div><strong>{income.source_name}:</strong> ${income.amount} ({income.frequency})</div>
                        <div className="text-xs text-muted-foreground">Activo: {income.is_active ? 'Sí' : 'No'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay fuentes de ingreso registradas</div>
                )}
              </CardContent>
            </Card>

            {/* Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Gastos (últimos 10)
                  <Badge variant={rawTablesData?.expenses.length ? 'default' : 'secondary'}>
                    {rawTablesData?.expenses.length || 0} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rawTablesData?.expensesError && (
                  <div className="text-red-500 text-sm">Error: {rawTablesData.expensesError.message}</div>
                )}
                {rawTablesData?.expenses.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {rawTablesData.expenses.map((expense) => (
                      <div key={expense.id} className="text-sm border-b pb-2">
                        <div><strong>${expense.amount}</strong> - {expense.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {expense.date} | Recurrente: {expense.is_recurring ? 'Sí' : 'No'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay gastos registrados</div>
                )}
              </CardContent>
            </Card>

            {/* Debts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Deudas
                  <Badge variant={rawTablesData?.debts.length ? 'default' : 'secondary'}>
                    {rawTablesData?.debts.length || 0} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rawTablesData?.debtsError && (
                  <div className="text-red-500 text-sm">Error: {rawTablesData.debtsError.message}</div>
                )}
                {rawTablesData?.debts.length > 0 ? (
                  <div className="space-y-2">
                    {rawTablesData.debts.map((debt) => (
                      <div key={debt.id} className="text-sm border-b pb-2">
                        <div><strong>{debt.creditor}:</strong> ${debt.current_balance}</div>
                        <div className="text-xs text-muted-foreground">
                          Pago mensual: ${debt.monthly_payment} | Estado: {debt.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay deudas registradas</div>
                )}
              </CardContent>
            </Card>

            {/* Onboarding Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Gastos Onboarding
                  <Badge variant={rawTablesData?.onboardingExpenses.length ? 'default' : 'secondary'}>
                    {rawTablesData?.onboardingExpenses.length || 0} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rawTablesData?.onboardingExpensesError && (
                  <div className="text-red-500 text-sm">Error: {rawTablesData.onboardingExpensesError.message}</div>
                )}
                {rawTablesData?.onboardingExpenses.length > 0 ? (
                  <div className="space-y-2">
                    {rawTablesData.onboardingExpenses.map((expense) => (
                      <div key={expense.id} className="text-sm border-b pb-2">
                        <div><strong>{expense.category}:</strong> {expense.subcategory}</div>
                        <div className="text-xs text-muted-foreground">Cantidad: ${expense.amount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay gastos de onboarding</div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Resumen Financiero
                  <Badge variant={rawTablesData?.financialSummary ? 'default' : 'destructive'}>
                    {rawTablesData?.financialSummary ? 'Calculado' : 'Pendiente'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rawTablesData?.financialSummaryError && (
                  <div className="text-red-500 text-sm">Error: {rawTablesData.financialSummaryError.message}</div>
                )}
                {rawTablesData?.financialSummary ? (
                  <div className="text-sm space-y-1">
                    <div><strong>Ingresos mensuales:</strong> ${rawTablesData.financialSummary.total_monthly_income}</div>
                    <div><strong>Gastos mensuales:</strong> ${rawTablesData.financialSummary.total_monthly_expenses}</div>
                    <div><strong>Deuda total:</strong> ${rawTablesData.financialSummary.total_debt}</div>
                    <div><strong>Capacidad de ahorro:</strong> ${rawTablesData.financialSummary.savings_capacity}</div>
                    <div className="text-xs text-muted-foreground">
                      Última actualización: {new Date(rawTablesData.financialSummary.last_calculated).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Resumen no calculado</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processed-hooks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unified Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  useUnifiedFinancialData
                  <Badge variant={unifiedLoading ? 'secondary' : unifiedData ? 'default' : 'destructive'}>
                    {unifiedLoading ? 'Cargando' : unifiedData ? 'Cargado' : 'Error'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unifiedData ? (
                  <div className="text-sm space-y-1">
                    <div><strong>Ingresos totales:</strong> ${unifiedData.totalMonthlyIncome}</div>
                    <div><strong>Gastos mensuales:</strong> ${unifiedData.monthlyExpenses}</div>
                    <div><strong>Deudas totales:</strong> ${unifiedData.totalDebtBalance}</div>
                    <div><strong>Deudas encontradas:</strong> {unifiedData.debts.length}</div>
                    <div><strong>Metas:</strong> {unifiedData.financialGoals.length}</div>
                    <div><strong>Tiene datos reales:</strong> {unifiedData.hasFinancialData ? 'Sí' : 'No'}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay datos unificados</div>
                )}
              </CardContent>
            </Card>

            {/* Optimized Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  useOptimizedFinancialData
                  <Badge variant={optimizedLoading ? 'secondary' : optimizedData ? 'default' : 'destructive'}>
                    {optimizedLoading ? 'Cargando' : optimizedData ? 'Cargado' : 'Error'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {optimizedData ? (
                  <div className="text-sm space-y-1">
                    <div><strong>Ingresos mensuales:</strong> ${optimizedData.monthlyIncome}</div>
                    <div><strong>Gastos mensuales:</strong> ${optimizedData.monthlyExpenses}</div>
                    <div><strong>Capacidad de ahorro:</strong> ${optimizedData.savingsCapacity}</div>
                    <div><strong>Tiene datos reales:</strong> {optimizedData.hasRealData ? 'Sí' : 'No'}</div>
                    <div><strong>Última actualización:</strong> {optimizedData.lastCalculated || 'N/A'}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay datos optimizados</div>
                )}
              </CardContent>
            </Card>

            {/* Consolidated Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  useConsolidatedFinancialData
                  <Badge variant={consolidatedLoading ? 'secondary' : consolidatedData ? 'default' : 'destructive'}>
                    {consolidatedLoading ? 'Cargando' : consolidatedData ? 'Cargado' : 'Error'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {consolidatedData ? (
                  <div className="text-sm space-y-1">
                    <div><strong>Ingresos mensuales:</strong> ${consolidatedData.monthlyIncome}</div>
                    <div><strong>Gastos mensuales:</strong> ${consolidatedData.monthlyExpenses}</div>
                    <div><strong>Balance mensual:</strong> ${consolidatedData.monthlyIncome - consolidatedData.monthlyExpenses}</div>
                    <div><strong>Tiene datos reales:</strong> {consolidatedData.hasRealData ? 'Sí' : 'No'}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay datos consolidados</div>
                )}
              </CardContent>
            </Card>

            {/* Financial Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Plan Financiero Activo
                  <Badge variant={isLoadingPlan ? 'secondary' : activePlan ? 'default' : 'destructive'}>
                    {isLoadingPlan ? 'Cargando' : activePlan ? 'Existe' : 'Sin Plan'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activePlan ? (
                  <div className="text-sm space-y-1">
                    <div><strong>ID:</strong> {activePlan.id}</div>
                    <div><strong>Estado:</strong> {activePlan.status}</div>
                    <div><strong>Generado:</strong> {new Date(activePlan.generatedAt).toLocaleString()}</div>
                    <div><strong>Tiene snapshot:</strong> {activePlan.currentSnapshot ? 'Sí' : 'No'}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay plan activo</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="onboarding-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Datos del Onboarding</CardTitle>
              <CardDescription>
                Comparación entre datos almacenados en el JSON del perfil vs tablas específicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rawTablesData?.profile?.onboarding_data ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">JSON del Perfil</h4>
                      <pre className="text-xs p-3 bg-gray-100 rounded overflow-auto max-h-64">
                        {JSON.stringify(rawTablesData.profile.onboarding_data, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Datos en Tablas Específicas</h4>
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>Gastos del onboarding:</strong> {rawTablesData?.onboardingExpenses.length} registros
                        </div>
                        <div>
                          <strong>Fuentes de ingreso:</strong> {rawTablesData?.incomes.length} registros
                        </div>
                        <div>
                          <strong>Deudas:</strong> {rawTablesData?.debts.length} registros
                        </div>
                        <div>
                          <strong>Metas:</strong> {rawTablesData?.goals.length} registros
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No hay datos de onboarding en el perfil</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inconsistencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inconsistencias Detectadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Aquí agregaríamos lógica para detectar inconsistencias */}
                <div className="text-sm text-muted-foreground">
                  Análisis de inconsistencias en desarrollo...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Limpieza</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Recomendaciones basadas en el análisis de datos...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
