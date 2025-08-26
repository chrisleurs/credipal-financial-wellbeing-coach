
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDebts } from '@/hooks/useDebts'
import { useGoals } from '@/hooks/useGoals'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { TrendingUp, Target, CreditCard, PiggyBank, Plus, Trophy, Calendar, BarChart3 } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { DebtSummaryCards } from '@/components/debts/DebtSummaryCards'
import { DebtsList } from '@/components/debts/DebtsList'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useBottomNavigation } from '@/hooks/useBottomNavigation'
import { useNavigate } from 'react-router-dom'

// Import the new financial plan components with correct imports
import { FondoEmergencia } from '@/components/dashboard/FondoEmergencia'
import PlanPagoDeuda from '@/components/dashboard/PlanPagoDeuda'
import { CrecimientoPatrimonial } from '@/components/dashboard/CrecimientoPatrimonial'
import { RoadmapTrimestral } from '@/components/dashboard/RoadmapTrimestral'
import { MetasCortoPlazo } from '@/components/dashboard/MetasCortoPlazo'
import { RoadmapAccion } from '@/components/dashboard/RoadmapAccion'

export default function ProgressPage() {
  const navigate = useNavigate()
  const { 
    debts, 
    totalDebt, 
    totalMonthlyPayments,
    updateDebt,
    deleteDebt,
    isUpdating,
    isDeleting
  } = useDebts()
  
  const { goals } = useGoals()
  const { emptyStates } = useBottomNavigation()
  
  // Get financial plan data
  const { 
    plan, 
    loading: planLoading, 
    error: planError,
    hasPlan 
  } = useFinancialPlan()

  const activeDebts = debts.filter(debt => debt.status === 'active')
  const activeGoals = goals.filter(goal => goal.status === 'active')

  // Cálculos para mostrar progreso general
  const totalGoalAmount = activeGoals.reduce((sum, goal) => sum + goal.target_amount, 0)
  const totalSavedAmount = activeGoals.reduce((sum, goal) => sum + goal.current_amount, 0)
  const overallGoalProgress = totalGoalAmount > 0 ? (totalSavedAmount / totalGoalAmount) * 100 : 0

  const handleDeleteDebt = (debt: any) => {
    deleteDebt(debt.id)
  }

  const handleCreateDebt = () => {
    navigate('/debts')
  }

  const handleCreateGoal = () => {
    navigate('/plan')
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 pb-20">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mi Progreso</h1>
          <p className="text-muted-foreground">Seguimiento completo de tu situación financiera</p>
        </div>

        {/* Show empty state if no data */}
        {!emptyStates.progress.hasData && !hasPlan ? (
          <EmptyState
            icon={<Trophy className="h-16 w-16" />}
            title={emptyStates.progress.title}
            message={emptyStates.progress.message}
            actionLabel={emptyStates.progress.actionLabel}
            onAction={handleCreateGoal}
            className="mt-8"
          />
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deuda Total</CardTitle>
                  <CreditCard className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    ${totalDebt.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeDebts.length} deuda{activeDebts.length !== 1 ? 's' : ''} activa{activeDebts.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progreso Metas</CardTitle>
                  <PiggyBank className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {activeGoals.length > 0 ? `${overallGoalProgress.toFixed(1)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeGoals.length} meta{activeGoals.length !== 1 ? 's' : ''} activa{activeGoals.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="plan" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="plan" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Plan
                </TabsTrigger>
                <TabsTrigger value="debts" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Deudas
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Metas
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Roadmap
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plan" className="space-y-6">
                {planLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" text="Cargando plan financiero..." />
                  </div>
                ) : planError ? (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Error al cargar el plan financiero</p>
                    <Button onClick={() => window.location.reload()}>
                      Reintentar
                    </Button>
                  </Card>
                ) : !plan ? (
                  <EmptyState
                    icon={<BarChart3 className="h-12 w-12" />}
                    title="No hay plan financiero disponible"
                    message="Completa tu onboarding para generar tu plan financiero personalizado."
                    actionLabel="Ir al Plan"
                    onAction={() => navigate('/plan')}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Emergency Fund */}
                    {plan.fondoEmergencia ? (
                      <FondoEmergencia data={plan.fondoEmergencia} />
                    ) : (
                      <FondoEmergencia data={{
                        metaTotal: 15000,
                        progresoActual: 5500,
                        ahorroMensual: 800,
                        fechaCompletion: "2024-12-15"
                      }} />
                    )}

                    {/* Debt Payment Plan */}
                    {plan.planPagoDeuda && plan.planPagoDeuda.length > 0 ? (
                      <PlanPagoDeuda data={plan.planPagoDeuda} />
                    ) : (
                      <PlanPagoDeuda data={[
                        {
                          creditor: "Tarjeta de Crédito",
                          balance: 8500,
                          payment: 350,
                          interestRate: 24,
                          payoffDate: "2025-03-15",
                          strategy: "avalanche"
                        }
                      ]} />
                    )}

                    {/* Wealth Growth */}
                    {plan.crecimientoPatrimonial ? (
                      <CrecimientoPatrimonial data={plan.crecimientoPatrimonial} />
                    ) : (
                      <CrecimientoPatrimonial data={{
                        año1: 12000,
                        año3: 42000,
                        año5: 78000,
                        inversionMensual: 800,
                        rendimientoEsperado: 8
                      }} />
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="debts" className="space-y-4">
                {activeDebts.length === 0 ? (
                  <EmptyState
                    icon={<CreditCard className="h-12 w-12" />}
                    title="No tienes deudas registradas"
                    message="Registra tus deudas para crear un plan de pago efectivo y hacer seguimiento de tu progreso."
                    actionLabel="Registrar Deuda"
                    onAction={handleCreateDebt}
                  />
                ) : (
                  <>
                    <DebtSummaryCards 
                      totalDebt={totalDebt}
                      totalMonthlyPayments={totalMonthlyPayments}
                      activeDebtsCount={activeDebts.length}
                      onAnalyzeClick={() => {}}
                      canAnalyze={activeDebts.length > 0}
                    />
                    
                    <DebtsList 
                      debts={debts}
                      onEdit={() => {}}
                      onDelete={handleDeleteDebt}
                      onMakePayment={() => {}}
                      onCreate={() => {}}
                      isUpdating={isUpdating}
                      isDeleting={isDeleting}
                    />
                  </>
                )}
              </TabsContent>

              <TabsContent value="goals" className="space-y-4">
                {activeGoals.length === 0 ? (
                  <EmptyState
                    icon={<Target className="h-12 w-12" />}
                    title="No tienes metas activas"
                    message="Crea tus primeras metas financieras para empezar a hacer seguimiento de tu progreso."
                    actionLabel="Crear Meta"
                    onAction={handleCreateGoal}
                  />
                ) : (
                  <div className="space-y-4">
                    {activeGoals.map((goal) => {
                      const progress = (goal.current_amount / goal.target_amount) * 100
                      
                      return (
                        <Card key={goal.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{goal.title}</CardTitle>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {progress.toFixed(1)}%
                                </span>
                                {progress >= 100 && (
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>Progreso</span>
                                <span>${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}</span>
                              </div>
                              
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              
                              {goal.description && (
                                <p className="text-sm text-muted-foreground">
                                  {goal.description}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="roadmap" className="space-y-6">
                {planLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" text="Cargando roadmap..." />
                  </div>
                ) : !plan ? (
                  <EmptyState
                    icon={<Calendar className="h-12 w-12" />}
                    title="No hay roadmap disponible"
                    message="Genera tu plan financiero para ver tu roadmap personalizado."
                    actionLabel="Generar Plan"
                    onAction={() => navigate('/plan')}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Quarterly Roadmap */}
                    {plan.roadmapTrimestral ? (
                      <RoadmapTrimestral data={plan.roadmapTrimestral} />
                    ) : (
                      <RoadmapTrimestral data={{
                        trimestres: [
                          {
                            trimestre: "Q1 2024",
                            ahorroObjetivo: 3000,
                            ahorroAcumulado: 2400,
                            deudaPendiente: 8500,
                            porcentajeAvance: 80,
                            hitos: ["Establecer fondo emergencia", "Pagar tarjeta crédito"],
                            completado: false
                          },
                          {
                            trimestre: "Q2 2024",
                            ahorroObjetivo: 6000,
                            ahorroAcumulado: 4800,
                            deudaPendiente: 6000,
                            porcentajeAvance: 80,
                            hitos: ["Aumentar inversiones", "Reducir gastos"],
                            completado: false
                          }
                        ],
                        metaAnual: 24000
                      }} />
                    )}

                    {/* Short-term Goals */}
                    {plan.metasCortoPlazo ? (
                      <MetasCortoPlazo data={plan.metasCortoPlazo} />
                    ) : (
                      <MetasCortoPlazo data={{
                        semanales: [
                          {
                            id: "1",
                            titulo: "Ahorrar $200 esta semana",
                            meta: 200,
                            progreso: 150,
                            tipo: "ahorro",
                            completada: false,
                            fechaLimite: "2024-09-01"
                          }
                        ],
                        mensuales: [
                          {
                            id: "2",
                            titulo: "Reducir gastos de entretenimiento",
                            meta: 500,
                            progreso: 320,
                            tipo: "gasto",
                            completada: false,
                            fechaLimite: "2024-09-30"
                          }
                        ]
                      }} />
                    )}

                    {/* Action Roadmap */}
                    {plan.roadmapAccion ? (
                      <RoadmapAccion data={plan.roadmapAccion} />
                    ) : (
                      <RoadmapAccion data={{
                        pasos: [
                          {
                            paso: 1,
                            titulo: "Establecer presupuesto mensual",
                            descripcion: "Definir categorías y límites de gasto",
                            fechaObjetivo: "2024-09-15",
                            completado: true,
                            enProgreso: false,
                            impactoFinanciero: 500,
                            dificultad: "facil"
                          },
                          {
                            paso: 2,
                            titulo: "Crear fondo de emergencia",
                            descripcion: "Ahorrar 3 meses de gastos básicos",
                            fechaObjetivo: "2024-12-31",
                            completado: false,
                            enProgreso: true,
                            impactoFinanciero: 15000,
                            dificultad: "medio"
                          }
                        ],
                        progreso: 25,
                        siguientePaso: 2
                      }} />
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  )
}
