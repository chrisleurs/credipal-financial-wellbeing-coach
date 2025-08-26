
/**
 * Dashboard optimizado que usa el nuevo useFinancialPlan master hook
 */

import React, { useState } from 'react'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MetricCard } from './MetricCard'
import { HeroCoachCard } from '@/components/coach/HeroCoachCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/helpers'
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Target,
  RefreshCw,
  AlertCircle,
  Trophy,
  Zap
} from 'lucide-react'

export const OptimizedFinancialDashboard = () => {
  const {
    financialData,
    aiPlan,
    loading,
    isUpdatingGoal,
    isGeneratingPlan,
    isRefreshingData,
    updateBigGoal,
    completeMiniGoal,
    completeAction,
    generateNewPlan,
    refreshAll,
    lastSyncTime,
    error
  } = useFinancialPlan()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'progress'>('overview')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu dashboard financiero..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshAll} disabled={isRefreshingData}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingData ? 'animate-spin' : ''}`} />
              {isRefreshingData ? 'Actualizando...' : 'Reintentar'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!financialData?.hasRealData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">¡Completa tu perfil financiero!</h1>
            <p className="text-muted-foreground mb-6">
              Para ver tu dashboard personalizado, necesitas agregar al menos una fuente de ingresos o gastos.
            </p>
            <div className="space-y-2">
              <Button className="w-full">Agregar Ingresos</Button>
              <Button variant="outline" className="w-full">Agregar Gastos</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePlanGenerated = (planData: any) => {
    console.log('Plan generado desde HeroCoachCard:', planData)
    // El hook ya maneja la actualización automática
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Coach Card - Now with integrated AI plan */}
        <div className="mb-8">
          <HeroCoachCard 
            userData={financialData}
            aiPlan={aiPlan}
            onGeneratePlan={generateNewPlan}
            onRefresh={refreshAll}
            isGenerating={isGeneratingPlan}
            lastSyncTime={lastSyncTime}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Resumen
            </Button>
            <Button
              variant={activeTab === 'plan' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('plan')}
              className="flex-1"
            >
              <Target className="h-4 w-4 mr-2" />
              Mi Plan 3-2-1
            </Button>
            <Button
              variant={activeTab === 'progress' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('progress')}
              className="flex-1"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Progreso
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Ingresos Mensuales"
                value={formatCurrency(financialData.monthlyIncome)}
                icon={DollarSign}
                className="bg-green-50 border-green-200"
              />
              <MetricCard
                title="Gastos Mensuales"
                value={formatCurrency(financialData.monthlyExpenses)}
                icon={CreditCard}
                className="bg-red-50 border-red-200"
              />
              <MetricCard
                title="Balance Mensual"
                value={formatCurrency(financialData.monthlyBalance)}
                icon={TrendingUp}
                className={financialData.monthlyBalance >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"}
              />
              <MetricCard
                title="Total Deudas"
                value={formatCurrency(financialData.totalDebtBalance)}
                icon={Target}
                className="bg-purple-50 border-purple-200"
              />
            </div>

            {/* Financial Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Capacidad de ahorro:</span>
                      <span className={`font-semibold ${
                        financialData.savingsCapacity >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(financialData.savingsCapacity)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagos de deuda mensuales:</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(financialData.totalMonthlyDebtPayments)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Metas activas:</span>
                      <span className="font-semibold">
                        {financialData.activeGoals.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progreso total metas:</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(financialData.totalGoalsCurrent)} / {formatCurrency(financialData.totalGoalsTarget)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'plan' && aiPlan && (
          <div className="space-y-6">
            {/* Big Goals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Tus 3 Metas Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiPlan.bigGoals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{goal.emoji}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                          goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {goal.status}
                        </span>
                      </div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{formatCurrency(goal.currentAmount)}</span>
                          <span>{formatCurrency(goal.targetAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(goal.progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Timeline: {goal.timeline}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => updateBigGoal(goal.id, { progress: Math.min(goal.progress + 10, 100) })}
                        disabled={isUpdatingGoal || goal.status === 'completed'}
                        className="w-full"
                      >
                        {isUpdatingGoal ? 'Actualizando...' : 'Actualizar Progreso'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mini Goals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Mini-Metas de la Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiPlan.miniGoals.map((goal) => (
                    <div key={goal.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                      goal.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <Button
                        size="sm"
                        variant={goal.isCompleted ? "default" : "outline"}
                        onClick={() => !goal.isCompleted && completeMiniGoal(goal.id)}
                        disabled={goal.isCompleted}
                        className="shrink-0"
                      >
                        {goal.isCompleted ? '✓' : '○'}
                      </Button>
                      <div className="flex-1">
                        <h4 className={`font-medium ${goal.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {goal.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        +{goal.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Immediate Action */}
            {aiPlan.immediateAction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Acción Inmediata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg border ${
                    aiPlan.immediateAction.isCompleted ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{aiPlan.immediateAction.title}</h3>
                      <span className="text-sm px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                        Impacto: {aiPlan.immediateAction.impact}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {aiPlan.immediateAction.description}
                    </p>
                    {!aiPlan.immediateAction.isCompleted && (
                      <Button 
                        size="sm"
                        onClick={() => completeAction(aiPlan.immediateAction.id)}
                      >
                        Marcar como Completado
                      </Button>
                    )}
                    {aiPlan.immediateAction.isCompleted && (
                      <div className="text-green-600 font-medium">
                        ✅ Completado el {new Date(aiPlan.immediateAction.completedAt!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'progress' && aiPlan && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Metas Completadas"
                value={aiPlan.stats.completedBigGoals.toString()}
                icon={Trophy}
                className="bg-yellow-50 border-yellow-200"
              />
              <MetricCard
                title="Mini-Metas"
                value={aiPlan.stats.completedMiniGoals.toString()}
                icon={Zap}
                className="bg-blue-50 border-blue-200"
              />
              <MetricCard
                title="Puntos Totales"
                value={aiPlan.stats.totalPoints.toString()}
                icon={Target}
                className="bg-purple-50 border-purple-200"
              />
              <MetricCard
                title="Racha (días)"
                value={aiPlan.stats.streakDays.toString()}
                icon={TrendingUp}
                className="bg-green-50 border-green-200"
              />
            </div>

            {/* Progress Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles de Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">¡Sigue así!</h3>
                    <p className="text-muted-foreground">
                      Has completado {aiPlan.stats.completedMiniGoals} mini-metas y acumulado {aiPlan.stats.totalPoints} puntos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sync Status */}
        {lastSyncTime && (
          <div className="text-center text-sm text-muted-foreground mt-8">
            Última actualización: {lastSyncTime.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}
