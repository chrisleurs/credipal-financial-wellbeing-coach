
import React from 'react'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress as UIProgress } from '@/components/ui/progress'
import { RefreshCw, Target, TrendingUp, AlertCircle, PlusCircle, BarChart3, Calendar, CheckCircle } from 'lucide-react'

export default function ProgressPage() {
  const { 
    activePlan,
    isLoadingPlan,
    planError,
    regeneratePlan,
    isGenerating,
    hasPlan,
    updateGoalProgress,
    isUpdatingProgress
  } = useFinancialPlanManager()

  // Move all useMemo hooks to the top, before any conditional returns
  const overallProgress = React.useMemo(() => {
    if (!activePlan?.actionRoadmap || !Array.isArray(activePlan.actionRoadmap) || activePlan.actionRoadmap.length === 0) {
      return 0
    }
    const completedActions = activePlan.actionRoadmap.filter(action => action?.completed).length
    return Math.round((completedActions / activePlan.actionRoadmap.length) * 100)
  }, [activePlan?.actionRoadmap])

  const emergencyFundProgress = React.useMemo(() => {
    if (!activePlan?.emergencyFund?.targetAmount || activePlan.emergencyFund.targetAmount === 0) {
      return 0
    }
    return Math.round(
      (activePlan.emergencyFund.currentAmount / activePlan.emergencyFund.targetAmount) * 100
    )
  }, [activePlan?.emergencyFund])

  console.log('📄 Progress Page - Plan Manager State:', {
    hasPlan,
    isLoadingPlan,
    planError: planError || 'none',
    isGenerating
  })

  // Loading state
  if (isLoadingPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu plan financiero..." />
      </div>
    )
  }

  // Error state
  if (planError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Error cargando tu plan</CardTitle>
              <CardDescription>
                {planError.message || 'Hubo un problema al cargar tu plan financiero'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar página
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show existing plan
  if (hasPlan && activePlan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Mi Progreso Financiero</h1>
                <p className="text-muted-foreground">
                  Seguimiento detallado de tus metas y avances
                </p>
              </div>
              <Button 
                onClick={() => regeneratePlan()} 
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar Plan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Progreso General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <UIProgress value={overallProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {activePlan.actionRoadmap?.filter(a => a?.completed).length || 0} de {activePlan.actionRoadmap?.length || 0} acciones completadas
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Fondo de Emergencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ${activePlan.emergencyFund?.currentAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <UIProgress value={emergencyFundProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Meta: ${activePlan.emergencyFund?.targetAmount?.toLocaleString() || '0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Patrimonio Proyectado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${activePlan.wealthGrowth?.year1?.toLocaleString() || '0'}
                    </span>
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Proyección a 1 año
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Roadmap */}
          {activePlan.actionRoadmap && activePlan.actionRoadmap.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Plan de Acción</CardTitle>
                <CardDescription>
                  Pasos específicos para alcanzar tus metas financieras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePlan.actionRoadmap.map((action, index) => (
                    <div 
                      key={action.step}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        action.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-primary/20'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {action.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">{action.step}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium ${action.completed ? 'text-green-800' : 'text-gray-900'}`}>
                          {action.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {action.targetDate ? new Date(action.targetDate).toLocaleDateString() : 'Sin fecha'}
                          </span>
                          {action.description && (
                            <span className="text-sm text-muted-foreground">
                              {action.description}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!action.completed && (
                        <Button 
                          size="sm"
                          onClick={() => updateGoalProgress({ goalId: action.step.toString(), progress: 100 })}
                          disabled={isUpdatingProgress}
                        >
                          Marcar Completado
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Short Term Goals */}
          {(activePlan.shortTermGoals?.weekly || activePlan.shortTermGoals?.monthly) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePlan.shortTermGoals?.weekly && (
                <Card>
                  <CardHeader>
                    <CardTitle>Metas Semanales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activePlan.shortTermGoals.weekly.map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{goal.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {goal.progress || 0}%
                            </span>
                          </div>
                          <UIProgress value={goal.progress || 0} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activePlan.shortTermGoals?.monthly && (
                <Card>
                  <CardHeader>
                    <CardTitle>Metas Mensuales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activePlan.shortTermGoals.monthly.map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{goal.title}</span>
                            <span className="text-sm text-muted-foreground">
                              ${goal.target?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <UIProgress value={goal.progress || 0} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // No plan state - redirect to generate one
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle>Aún no tienes un plan financiero</CardTitle>
            <CardDescription>
              Completa tu información financiera para generar un plan personalizado
              que te ayude a alcanzar tus metas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.href = '/onboarding'}
                variant="default"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Completar Información
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
              >
                <Target className="h-4 w-4 mr-2" />
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
