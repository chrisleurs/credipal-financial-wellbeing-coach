
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDebts } from '@/hooks/useDebts'
import { useGoals } from '@/hooks/useGoals'
import { TrendingUp, Target, CreditCard, PiggyBank, Plus, Trophy } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { DebtSummaryCards } from '@/components/debts/DebtSummaryCards'
import { DebtsList } from '@/components/debts/DebtsList'
import { EmptyState } from '@/components/shared/EmptyState'
import { useBottomNavigation } from '@/hooks/useBottomNavigation'
import { useNavigate } from 'react-router-dom'

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
    // Navigate to debts page with create action
    navigate('/debts')
  }

  const handleCreateGoal = () => {
    // Navigate to plan page or trigger goal creation
    navigate('/plan')
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 pb-20">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mi Progreso</h1>
          <p className="text-muted-foreground">Seguimiento de deudas y metas financieras</p>
        </div>

        {/* Show empty state if no data */}
        {!emptyStates.progress.hasData ? (
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
                    {activeGoals.length > 0 ? `${((activeGoals.reduce((sum, goal) => sum + goal.current_amount, 0) / activeGoals.reduce((sum, goal) => sum + goal.target_amount, 0)) * 100).toFixed(1)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeGoals.length} meta{activeGoals.length !== 1 ? 's' : ''} activa{activeGoals.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="debts" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="debts" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Deudas
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Metas
                </TabsTrigger>
              </TabsList>

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
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  )
}
