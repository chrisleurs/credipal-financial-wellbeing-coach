
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export const UserOnboardingAudit = () => {
  const [searchEmail, setSearchEmail] = useState('bebeson@gmail.com')
  const [searchTriggered, setSearchTriggered] = useState(false)

  // Query user data by email
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user-onboarding-audit', searchEmail],
    queryFn: async () => {
      if (!searchEmail || !searchTriggered) return null

      console.log('🔍 Searching for user:', searchEmail)

      // Get user profile first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', searchEmail)
        .maybeSingle()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        throw profileError
      }

      if (!profile) {
        throw new Error(`No user found with email: ${searchEmail}`)
      }

      console.log('📋 Found profile:', profile)

      const userId = profile.user_id

      // Get all related data
      const [
        incomesResult,
        expensesResult,
        onboardingExpensesResult,
        debtsResult,
        goalsResult,
        financialSummaryResult,
        financialPlansResult
      ] = await Promise.all([
        supabase.from('income_sources').select('*').eq('user_id', userId),
        supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(20),
        supabase.from('onboarding_expenses').select('*').eq('user_id', userId),
        supabase.from('debts').select('*').eq('user_id', userId),
        supabase.from('goals').select('*').eq('user_id', userId),
        supabase.from('financial_summary').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('financial_plans').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ])

      return {
        profile,
        incomes: incomesResult.data || [],
        expenses: expensesResult.data || [],
        onboardingExpenses: onboardingExpensesResult.data || [],
        debts: debtsResult.data || [],
        goals: goalsResult.data || [],
        financialSummary: financialSummaryResult.data,
        financialPlans: financialPlansResult.data || [],
        errors: {
          incomes: incomesResult.error,
          expenses: expensesResult.error,
          onboardingExpenses: onboardingExpensesResult.error,
          debts: debtsResult.error,
          goals: goalsResult.error,
          financialSummary: financialSummaryResult.error,
          financialPlans: financialPlansResult.error
        }
      }
    },
    enabled: !!searchEmail && searchTriggered,
  })

  const handleSearch = () => {
    setSearchTriggered(true)
  }

  const downloadUserReport = () => {
    if (!userData) return
    
    const report = {
      timestamp: new Date().toISOString(),
      email: searchEmail,
      userData: userData
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-audit-${searchEmail}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Auditoría de Usuario - Onboarding</h1>
          <p className="text-muted-foreground">Revisa los datos de onboarding de un usuario específico</p>
        </div>
        {userData && (
          <Button onClick={downloadUserReport}>
            Descargar Reporte
          </Button>
        )}
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Usuario</CardTitle>
          <CardDescription>Ingresa el email del usuario para revisar sus datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email">Email del Usuario</Label>
              <Input
                id="email"
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={!searchEmail || isLoading}>
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {userData && !isLoading && (
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="financial">Datos Financieros</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="plans">Planes</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Información del Perfil
                    <Badge variant={userData.profile ? 'default' : 'destructive'}>
                      {userData.profile ? 'Encontrado' : 'No encontrado'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {userData.profile && (
                    <div className="text-sm space-y-2">
                      <div><strong>ID:</strong> {userData.profile.user_id}</div>
                      <div><strong>Email:</strong> {userData.profile.email}</div>
                      <div><strong>Nombre:</strong> {userData.profile.first_name} {userData.profile.last_name}</div>
                      <div><strong>Onboarding completado:</strong> 
                        <Badge variant={userData.profile.onboarding_completed ? 'default' : 'secondary'} className="ml-2">
                          {userData.profile.onboarding_completed ? 'Sí' : 'No'}
                        </Badge>
                      </div>
                      <div><strong>Paso actual:</strong> {userData.profile.onboarding_step || 0}</div>
                      <div><strong>Creado:</strong> {new Date(userData.profile.created_at).toLocaleString()}</div>
                      <div><strong>Actualizado:</strong> {new Date(userData.profile.updated_at).toLocaleString()}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.financialSummary ? (
                    <div className="text-sm space-y-2">
                      <div><strong>Ingresos mensuales:</strong> ${userData.financialSummary.total_monthly_income}</div>
                      <div><strong>Gastos mensuales:</strong> ${userData.financialSummary.total_monthly_expenses}</div>
                      <div><strong>Deuda total:</strong> ${userData.financialSummary.total_debt}</div>
                      <div><strong>Capacidad de ahorro:</strong> ${userData.financialSummary.savings_capacity}</div>
                      <div><strong>Última actualización:</strong> {new Date(userData.financialSummary.last_calculated).toLocaleString()}</div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay resumen financiero calculado</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Datos JSON del Onboarding</CardTitle>
                  <CardDescription>Información almacenada en el campo onboarding_data del perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.profile?.onboarding_data && Object.keys(userData.profile.onboarding_data).length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(userData.profile.onboarding_data as Record<string, any>).map(([key, value]) => (
                          <div key={key} className="p-3 bg-gray-50 rounded">
                            <div className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <details className="mt-4">
                        <summary className="cursor-pointer font-medium">Ver JSON completo</summary>
                        <pre className="text-xs mt-2 p-3 bg-gray-100 rounded overflow-auto max-h-64">
                          {JSON.stringify(userData.profile.onboarding_data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay datos de onboarding en formato JSON</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Gastos del Onboarding
                    <Badge variant={userData.onboardingExpenses.length > 0 ? 'default' : 'secondary'}>
                      {userData.onboardingExpenses.length} registros
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.onboardingExpenses.length > 0 ? (
                    <div className="space-y-2">
                      {userData.onboardingExpenses.map((expense: any) => (
                        <div key={expense.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <div className="font-medium">{expense.category}</div>
                            <div className="text-sm text-muted-foreground">{expense.subcategory}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${expense.amount}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(expense.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay gastos registrados durante el onboarding</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Income Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Fuentes de Ingreso
                    <Badge variant={userData.incomes.length > 0 ? 'default' : 'secondary'}>
                      {userData.incomes.length} registros
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.incomes.length > 0 ? (
                    <div className="space-y-2">
                      {userData.incomes.map((income: any) => (
                        <div key={income.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <div className="font-medium">{income.source_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {income.frequency} • {income.is_active ? 'Activo' : 'Inactivo'}
                            </div>
                          </div>
                          <div className="font-medium">${income.amount}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay fuentes de ingreso registradas</p>
                  )}
                </CardContent>
              </Card>

              {/* Debts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Deudas
                    <Badge variant={userData.debts.length > 0 ? 'default' : 'secondary'}>
                      {userData.debts.length} registros
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.debts.length > 0 ? (
                    <div className="space-y-2">
                      {userData.debts.map((debt: any) => (
                        <div key={debt.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <div className="font-medium">{debt.creditor}</div>
                            <div className="text-sm text-muted-foreground">
                              Pago: ${debt.monthly_payment} • {debt.status}
                            </div>
                          </div>
                          <div className="font-medium">${debt.current_balance}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay deudas registradas</p>
                  )}
                </CardContent>
              </Card>

              {/* Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Metas Financieras
                    <Badge variant={userData.goals.length > 0 ? 'default' : 'secondary'}>
                      {userData.goals.length} registros
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.goals.length > 0 ? (
                    <div className="space-y-2">
                      {userData.goals.map((goal: any) => (
                        <div key={goal.id} className="p-2 border rounded">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{goal.title}</div>
                              {goal.description && (
                                <div className="text-sm text-muted-foreground mt-1">{goal.description}</div>
                              )}
                            </div>
                            <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                              {goal.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <span>Progreso: ${goal.current_amount} / ${goal.target_amount}</span>
                            <span>{goal.priority} prioridad</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay metas financieras registradas</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Gastos Recientes
                  <Badge variant={userData.expenses.length > 0 ? 'default' : 'secondary'}>
                    {userData.expenses.length} registros (últimos 20)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.expenses.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {userData.expenses.map((expense: any) => (
                      <div key={expense.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="font-medium">{expense.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.description} • {expense.date}
                            {expense.is_recurring && <Badge variant="outline" className="ml-2">Recurrente</Badge>}
                          </div>
                        </div>
                        <div className="font-medium">${expense.amount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hay gastos registrados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Planes Financieros
                  <Badge variant={userData.financialPlans.length > 0 ? 'default' : 'secondary'}>
                    {userData.financialPlans.length} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.financialPlans.length > 0 ? (
                  <div className="space-y-4">
                    {userData.financialPlans.map((plan: any) => (
                      <div key={plan.id} className="p-4 border rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">Plan {plan.plan_type}</div>
                            <div className="text-sm text-muted-foreground">
                              Versión {plan.version} • {new Date(plan.created_at).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                            {plan.status}
                          </Badge>
                        </div>
                        <details>
                          <summary className="cursor-pointer text-sm font-medium">Ver datos del plan</summary>
                          <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                            {JSON.stringify(plan.plan_data, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hay planes financieros generados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Integridad de Datos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Data Completeness Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Completitud de Datos</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Perfil básico</span>
                          {userData.profile ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Onboarding completado</span>
                          {userData.profile?.onboarding_completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Fuentes de ingreso</span>
                          {userData.incomes.length > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Gastos registrados</span>
                          {userData.expenses.length > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Resumen financiero</span>
                          {userData.financialSummary ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Migración de Datos</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Gastos onboarding → gastos</span>
                          {userData.onboardingExpenses.length > 0 && userData.expenses.length > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : userData.onboardingExpenses.length > 0 ? (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Gastos onboarding: {userData.onboardingExpenses.length} | 
                          Gastos regulares: {userData.expenses.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Recomendaciones</h4>
                    <div className="space-y-2 text-sm">
                      {!userData.profile?.onboarding_completed && (
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                          ⚠️ El onboarding no está marcado como completado
                        </div>
                      )}
                      {userData.onboardingExpenses.length > 0 && userData.expenses.length === 0 && (
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                          💡 Hay gastos en la tabla de onboarding que deberían migrarse a la tabla principal
                        </div>
                      )}
                      {!userData.financialSummary && (
                        <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                          📊 No hay resumen financiero calculado - se debe ejecutar la función de cálculo
                        </div>
                      )}
                      {userData.incomes.length === 0 && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded">
                          💰 No hay fuentes de ingreso registradas
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
