
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ModernGoalCard } from './ModernGoalCard'
import { ModernFinancialSummary } from './ModernFinancialSummary'
import { ModernUpcomingPayments } from './ModernUpcomingPayments'
import { SmartRecommendations } from './SmartRecommendations'
import { CrediPalPlanSection } from './CrediPalPlanSection'
import { 
  Sparkles,
  RefreshCw,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  Bell,
  ArrowRight,
  Settings,
  CheckCircle,
  Trophy
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

  const getProgressPercentage = () => {
    if (!generatedPlan.goals.length) return 0
    return Math.round((generatedPlan.goals.filter(g => g.status === 'completed').length / generatedPlan.goals.length) * 100)
  }

  const progressPercentage = getProgressPercentage()
  
  // Lógica derivada para gamificación
  const isFirstTime = consolidatedProfile.monthlyIncome === 0 && consolidatedProfile.monthlyExpenses === 0
  const hasRecentActivity = consolidatedProfile.monthlyIncome > 0 || consolidatedProfile.monthlyExpenses > 0
  
  const getWelcomeMessage = () => {
    if (isFirstTime) {
      return "Bienvenido. Tu plan financiero ya está listo."
    }
    return "Bienvenido 👋. Tu plan financiero ya está listo."
  }

  const getMotivationalMessage = () => {
    if (isFirstTime) {
      return "¡Comencemos tu transformación financiera! Agrega tus primeros datos para activar todas las funciones de CrediPal."
    }
    if (progressPercentage >= 75) return "¡Increíble! Estás muy cerca de cumplir tus metas 🎉"
    if (progressPercentage >= 50) return "¡Vas muy bien! Ya completaste la mitad del camino 🚀"
    if (progressPercentage >= 25) return `¡Vas ${progressPercentage}% de tu meta, sigue así! 💪`
    if (progressPercentage > 0) return "¡Excelente inicio! Cada paso cuenta hacia tu libertad financiera ⭐"
    return "Tu plan financiero está listo. ¡Comencemos tu transformación! 🌟"
  }

  // Detectar logros recientes (derivado en frontend)
  const getAchievementMessage = () => {
    if (hasRecentActivity && consolidatedProfile.monthlyIncome > 0 && consolidatedProfile.monthlyExpenses === 0) {
      return { type: 'first_income', message: '🎉 ¡Primer ingreso registrado! Excelente comienzo.' }
    }
    if (hasRecentActivity && consolidatedProfile.monthlyExpenses > 0 && consolidatedProfile.currentSavings === 0) {
      return { type: 'first_expense', message: '📊 ¡Primer gasto registrado! Ya tienes visibilidad de tu dinero.' }
    }
    if (consolidatedProfile.currentSavings > 0) {
      return { type: 'first_saving', message: '💰 ¡Primera meta de ahorro creada! Tu futuro yo te lo agradecerá.' }
    }
    return null
  }

  const achievement = getAchievementMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Simplificado */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-3xl p-8 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/10 bg-[length:20px_20px] bg-[image:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)]"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{getWelcomeMessage()}</h1>
                  <p className="text-white/80 text-lg">Tu coach financiero personal</p>
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
                  {progressPercentage > 0 ? <CheckCircle className="h-6 w-6 text-white" /> : <Zap className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mensaje de CrediPal</h3>
                  <p className="text-white/90 leading-relaxed">
                    {getMotivationalMessage()}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje de logro si existe */}
            {achievement && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-300" />
                  <p className="text-white font-medium">{achievement.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumen Financiero Moderno */}
        <ModernFinancialSummary consolidatedData={consolidatedProfile} />

        {/* Plan Financiero CrediPal - Nueva Sección */}
        <CrediPalPlanSection consolidatedData={consolidatedProfile} />

        {/* Recomendaciones Inteligentes */}
        <SmartRecommendations consolidatedData={consolidatedProfile} />

        {/* Sección de Objetivos con Gamificación */}
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
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progreso general:</div>
                <div className="text-2xl font-bold text-primary">
                  {progressPercentage}%
                </div>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="text-primary font-bold text-lg">{progressPercentage}%</div>
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
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                    {milestone.progress > 0 && (
                      <p className="text-xs text-primary font-medium">
                        ¡Progreso excelente! Sigue así 🎯
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
