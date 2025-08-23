
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDebts } from '@/hooks/useDebts'
import { useGoals } from '@/hooks/useGoals'
import { TrendingUp, Target, CreditCard, PiggyBank } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { DebtSummaryCards } from '@/components/debts/DebtSummaryCards'
import { DebtsList } from '@/components/debts/DebtsList'

export default function ProgressPage() {
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

  const activeDebts = debts.filter(debt => debt.status === 'active')
  const activeGoals = goals.filter(goal => goal.status === 'active')

  // Cálculos para mostrar progreso general
  const totalGoalAmount = activeGoals.reduce((sum, goal) => sum + goal.target_amount, 0)
  const totalSavedAmount = activeGoals.reduce((sum, goal) => sum + goal.current_amount, 0)
  const overallGoalProgress = totalGoalAmount > 0 ? (totalSavedAmount / totalGoalAmount) * 100 : 0

  const handleDeleteDebt = (debt: any) => {
    deleteDebt(debt.id)
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 pb-20">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mi Progreso</h1>
          <p className="text-muted-foreground">Seguimiento de deudas y metas financieras</p>
        </div>

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
                {overallGoalProgress.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                ${totalSavedAmount.toLocaleString()} de ${totalGoalAmount.toLocaleString()}
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
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tienes metas activas</h3>
                  <p className="text-muted-foreground mb-4">
                    Crea tus primeras metas financieras para empezar a hacer seguimiento
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => {
                  const progress = (goal.current_amount / goal.target_amount) * 100
                  
                  return (
                    <Card key={goal.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {progress.toFixed(1)}%
                          </span>
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
      </div>
    </AppLayout>
  )
}
