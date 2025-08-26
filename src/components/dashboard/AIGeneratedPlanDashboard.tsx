
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAIFinancialPlan } from '@/hooks/useAIFinancialPlan'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Lightbulb,
  Calendar,
  Award
} from 'lucide-react'

export const AIGeneratedPlanDashboard = () => {
  const { 
    parsedPlan, 
    isLoadingPlan, 
    hasActivePlan, 
    markGoalCompleted, 
    updateGoalProgress 
  } = useAIFinancialPlan()

  if (isLoadingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu plan financiero..." />
      </div>
    )
  }

  if (!hasActivePlan || !parsedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No hay plan disponible</h2>
            <p className="text-gray-600 mb-4">
              Completa tu onboarding para generar tu plan financiero personalizado
            </p>
            <Button onClick={() => window.location.href = '/onboarding'}>
              Completar Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              Plan generado por IA
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tu Plan Financiero Personalizado
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {parsedPlan.motivationalMessage || 'Tu roadmap hacia la libertad financiera'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumen Financiero */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(parsedPlan.monthlyBalance || 0)}
              </div>
              <p className="text-sm text-gray-600">Balance Mensual</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(parsedPlan.projectedSavings || 0)}
              </div>
              <p className="text-sm text-gray-600">Ahorro Proyectado</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {parsedPlan.goals?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Metas Activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {parsedPlan.timeEstimate || '12 meses'}
              </div>
              <p className="text-sm text-gray-600">Timeline</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recomendaciones IA */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Recomendaciones Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedPlan.recommendations?.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metas y Progreso */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Tus Metas Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {parsedPlan.goals?.map((goal: any, index: number) => (
                  <div key={goal.id || index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{goal.title || `Meta ${index + 1}`}</h4>
                        <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                          {goal.status === 'completed' ? 'Completada' : 'En Progreso'}
                        </Badge>
                      </div>
                      {goal.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <Progress value={goal.progress || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{Math.round(goal.progress || 0)}% completado</span>
                      <span>
                        {formatCurrency(goal.currentAmount || 0)} / {formatCurrency(goal.targetAmount || 0)}
                      </span>
                    </div>

                    {goal.status !== 'completed' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGoalProgress(goal.id, (goal.progress || 0) + 10)}
                        >
                          Registrar Progreso
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => markGoalCompleted(goal.id)}
                        >
                          Marcar Completada
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análisis Detallado */}
        {parsedPlan.analysis && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Análisis de tu Situación Financiera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <p className="text-blue-800 leading-relaxed whitespace-pre-line">
                  {parsedPlan.analysis}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones Prioritarias */}
        {parsedPlan.priorityActions && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Acciones Prioritarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedPlan.priorityActions.map((action: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{action.action}</h4>
                    <p className="text-sm text-gray-600 mb-2">{action.impact}</p>
                    <Badge variant="outline">{action.timeline}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
