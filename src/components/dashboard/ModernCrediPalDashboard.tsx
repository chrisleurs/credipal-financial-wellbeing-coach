
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ModernGoalCard } from './ModernGoalCard'
import { ModernFinancialSummary } from './ModernFinancialSummary'
import { ModernUpcomingPayments } from './ModernUpcomingPayments'
import { 
  Sparkles,
  RefreshCw,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  Bell,
  ArrowRight
} from 'lucide-react'

export const ModernCrediPalDashboard = () => {
  const { generatedPlan, isGenerating, error, regeneratePlan, consolidatedProfile } = useFinancialPlanGenerator()

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <LoadingSpinner size="lg" text="CrediPal está actualizando tu plan..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-4">Error al cargar tu plan</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={regeneratePlan} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!generatedPlan || !consolidatedProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Moderno */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-3xl p-8 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">¡Hola! 👋</h1>
                  <p className="text-white/80 text-lg">Tu asistente financiero personal está listo</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={regeneratePlan} 
                disabled={isGenerating}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar Plan
              </Button>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mensaje de CrediPal</h3>
                  <p className="text-white/90 leading-relaxed">
                    {generatedPlan.motivationalMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen Financiero Moderno */}
        <ModernFinancialSummary consolidatedData={consolidatedProfile} />

        {/* Sección de Objetivos Modernizada */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Tus Objetivos Financieros</h2>
                <p className="text-muted-foreground">
                  {generatedPlan.goals.filter(g => g.status === 'completed').length} de {generatedPlan.goals.length} completados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Progreso general:</div>
              <div className="text-2xl font-bold text-primary">
                {Math.round((generatedPlan.goals.filter(g => g.status === 'completed').length / generatedPlan.goals.length) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {generatedPlan.goals.map((goal) => (
              <ModernGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Layout de Dos Columnas Mejorado */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pagos Próximos - 2/3 del ancho */}
          <div className="xl:col-span-2">
            <ModernUpcomingPayments payments={generatedPlan.nextPayments} />
          </div>

          {/* Próximas Metas - 1/3 del ancho */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedPlan.upcomingMilestones.map((milestone) => (
                  <div key={milestone.id} className="group p-4 rounded-xl border hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {Math.round(milestone.progress)}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {milestone.description}
                    </p>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recomendaciones Modernas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recomendaciones Personalizadas
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {generatedPlan.recommendations.length} sugerencias
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedPlan.recommendations.map((recommendation, index) => (
                <div key={index} className="group p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-muted hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{recommendation}</p>
                      <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto text-xs text-primary">
                        Aplicar sugerencia
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
