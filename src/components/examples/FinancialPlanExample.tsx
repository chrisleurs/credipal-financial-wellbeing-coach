
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { Loader2, RefreshCw, TrendingUp } from 'lucide-react'

/**
 * Example component showing how to use the useFinancialPlan hook
 * in a real dashboard scenario
 */
export const FinancialPlanExample: React.FC = () => {
  const {
    plan,
    loading,
    error,
    loadingStates,
    updateBigGoal,
    completeMiniGoal,
    completeAction,
    refreshPlan,
    isStale,
    lastUpdated
  } = useFinancialPlan()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando tu plan financiero...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            onClick={refreshPlan} 
            variant="outline" 
            className="mt-4"
            disabled={loadingStates.refreshing}
          >
            {loadingStates.refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!plan) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No hay plan financiero activo</p>
          <p className="text-sm text-gray-400 mt-2">
            Completa tu onboarding para generar tu plan personalizado
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and stale indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mi Plan Financiero</h2>
          <p className="text-gray-600">{plan.coachMessage.personalizedGreeting}</p>
        </div>
        <div className="flex items-center gap-2">
          {isStale && (
            <Badge variant="outline" className="text-yellow-600">
              Datos no actualizados
            </Badge>
          )}
          <Button
            onClick={refreshPlan}
            variant="outline"
            size="sm"
            disabled={loadingStates.refreshing}
          >
            {loadingStates.refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Coach Message */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💪</div>
            <div>
              <p className="text-lg font-medium">{plan.coachMessage.text}</p>
              {plan.coachMessage.nextStepSuggestion && (
                <p className="text-blue-100 text-sm mt-2">
                  {plan.coachMessage.nextStepSuggestion}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progreso General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Semana {plan.weekNumber} de {plan.totalWeeks}</span>
              <span>{plan.overallProgress}%</span>
            </div>
            <Progress value={plan.overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Big Goals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plan.bigGoals.map((goal) => (
          <Card key={goal.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{goal.emoji}</span>
                <div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <p className="text-sm text-gray-600">{goal.timeline}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso</span>
                  <span>{Math.round(goal.progress)}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Actual: ${goal.currentAmount.toLocaleString()}</span>
                <span>Meta: ${goal.targetAmount.toLocaleString()}</span>
              </div>

              <Button
                onClick={() => updateBigGoal(goal.id, { 
                  progress: Math.min(goal.progress + 10, 100) 
                })}
                disabled={loadingStates.updatingBigGoal}
                size="sm"
                className="w-full"
              >
                {loadingStates.updatingBigGoal ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Actualizar Progreso +10%
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mini Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Mini-Metas de la Semana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.miniGoals.map((miniGoal) => (
            <div 
              key={miniGoal.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{miniGoal.emoji}</span>
                <div>
                  <p className="font-medium">{miniGoal.title}</p>
                  <p className="text-sm text-gray-600">
                    {miniGoal.currentValue}/{miniGoal.targetValue} {miniGoal.unit}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={miniGoal.isCompleted ? "default" : "secondary"}>
                  {miniGoal.points} pts
                </Badge>
                {!miniGoal.isCompleted && (
                  <Button
                    onClick={() => completeMiniGoal(miniGoal.id)}
                    disabled={loadingStates.updatingMiniGoal}
                    size="sm"
                  >
                    {loadingStates.updatingMiniGoal ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Completar"
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Immediate Action */}
      {!plan.immediateAction.isCompleted && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <span className="text-xl">{plan.immediateAction.emoji}</span>
              Acción Inmediata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{plan.immediateAction.title}</p>
              <p className="text-sm text-gray-600">{plan.immediateAction.description}</p>
              <p className="text-xs text-orange-600 mt-1">
                Tiempo estimado: {plan.immediateAction.estimatedMinutes} minutos
              </p>
            </div>
            
            <Button
              onClick={() => completeAction(plan.immediateAction.id)}
              disabled={loadingStates.completingAction}
              className="w-full"
            >
              {loadingStates.completingAction ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Marcar como Completada
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>Plan ID: {plan.id}</p>
            <p>Última actualización: {lastUpdated}</p>
            <p>Es obsoleto: {isStale ? 'Sí' : 'No'}</p>
            <p>Metodología: {plan.methodology}</p>
            <p>Racha: {plan.stats.streak} días</p>
            <p>Puntos totales: {plan.stats.totalPoints}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FinancialPlanExample
