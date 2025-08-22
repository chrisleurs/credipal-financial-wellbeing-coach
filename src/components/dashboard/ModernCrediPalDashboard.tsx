
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

  // Corregir la lógica de progreso
  const getProgressPercentage = () => {
    if (!generatedPlan.goals.length) return 0
    const completedGoals = generatedPlan.goals.filter(g => {
      // Verificar progreso real, no solo status
      return g.progress >= 100 || (g.current_amount >= g.target_amount && g.target_amount > 0)
    })
    return Math.round((completedGoals.length / generatedPlan.goals.length) * 100)
  }

  const progressPercentage = getProgressPercentage()
  
  // Lógica mejorada para gamificación
  const hasData = consolidatedProfile.monthlyIncome > 0 || consolidatedProfile.monthlyExpenses > 0
  const hasCompleteProfile = consolidatedProfile.monthlyIncome > 0 && consolidatedProfile.monthlyExpenses > 0
  
  const getWelcomeMessage = () => {
    if (!hasData) {
      return "Bienvenido a CrediPal"
    }
    return "Bienvenido de vuelta 👋"
  }

  const getMotivationalMessage = () => {
    if (!hasData) {
      return "¡Comencemos tu transformación financiera! Agrega tus datos para activar todas las funciones de CrediPal."
    }
    if (!hasCompleteProfile) {
      return "¡Excelente inicio! Completa tu perfil financiero para obtener recomendaciones personalizadas."
    }
    if (progressPercentage >= 75) return "¡Increíble! Estás muy cerca de cumplir tus metas 🎉"
    if (progressPercentage >= 50) return "¡Vas muy bien! Ya completaste la mitad del camino 🚀"
    if (progressPercentage >= 25) return `¡Vas por buen camino! ${progressPercentage}% completado 💪`
    if (progressPercentage > 0) return "¡Excelente inicio! Cada paso cuenta hacia tu libertad financiera ⭐"
    return "Tu plan financiero está listo. ¡Comencemos tu transformación! 🌟"
  }

  // Detectar logros reales
  const getAchievementMessage = () => {
    if (consolidatedProfile.monthlyIncome > 0 && consolidatedProfile.monthlyExpenses === 0) {
      return { type: 'first_income', message: '🎉 ¡Primer ingreso registrado! Excelente comienzo.' }
    }
    if (consolidatedProfile.monthlyExpenses > 0 && consolidatedProfile.monthlyIncome === 0) {
      return { type: 'first_expense', message: '📊 ¡Primer gasto registrado! Ya tienes visibilidad de tu dinero.' }
    }
    if (consolidatedProfile.currentSavings > 0 && hasCompleteProfile) {
      return { type: 'first_saving', message: '💰 ¡Excelente! Tienes ahorros acumulados. Tu futuro yo te lo agradecerá.' }
    }
    if (hasCompleteProfile) {
      return { type: 'complete_profile', message: '🎯 ¡Perfil completo! Ahora CrediPal puede darte mejores recomendaciones.' }
    }
    return null
  }

  const achievement = getAchievementMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        
        {/* Header Responsive */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/10 bg-[length:20px_20px] bg-[image:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)]"></div>
          </div>
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold">{getWelcomeMessage()}</h1>
                  <p className="text-white/80 text-sm sm:text-lg">Tu coach financiero personal</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={regeneratePlan} 
                disabled={isGenerating}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 w-full sm:w-auto"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar Plan
              </Button>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  {progressPercentage > 0 ? <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> : <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Mensaje de CrediPal</h3>
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                    {getMotivationalMessage()}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje de logro responsive */}
            {achievement && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 flex-shrink-0" />
                  <p className="text-white font-medium text-sm sm:text-base">{achievement.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumen Financiero Responsive */}
        <ModernFinancialSummary consolidatedData={consolidatedProfile} />

        {/* Plan Financiero CrediPal */}
        <CrediPalPlanSection consolidatedData={consolidatedProfile} />

        {/* Recomendaciones Inteligentes */}
        <SmartRecommendations consolidatedData={consolidatedProfile} />

        {/* Sección de Objetivos Responsive */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Tus Objetivos Financieros</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {generatedPlan.goals.filter(g => g.progress >= 100 || (g.current_amount >= g.target_amount && g.target_amount > 0)).length} de {generatedPlan.goals.length} completados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 self-start sm:self-auto">
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-muted-foreground">Progreso general:</div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {progressPercentage}%
                </div>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="text-primary font-bold text-sm sm:text-lg">{progressPercentage}%</div>
              </div>
            </div>
          </div>
          
          {/* Grid responsivo para objetivos */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {generatedPlan.goals.map((goal) => (
              <ModernGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Layout de Dos Columnas Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Pagos Próximos */}
          <div className="xl:col-span-2">
            <ModernUpcomingPayments payments={generatedPlan.nextPayments} />
          </div>

          {/* Próximas Metas */}
          <Card className="h-fit">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Próximas Metas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {generatedPlan.upcomingMilestones.map((milestone) => {
                  // Corregir cálculo de progreso real
                  const realProgress = milestone.target > 0 ? Math.min((milestone.current / milestone.target) * 100, 100) : 0
                  
                  return (
                    <div key={milestone.id} className="group p-3 sm:p-4 rounded-lg sm:rounded-xl border hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold text-sm sm:text-base">{milestone.title}</h4>
                        <span className="text-xs sm:text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {Math.round(realProgress)}%
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        {milestone.description}
                      </p>
                      <div className="w-full bg-secondary rounded-full h-2 sm:h-3 overflow-hidden mb-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${realProgress}%` }}
                        />
                      </div>
                      {realProgress > 0 && (
                        <p className="text-xs text-primary font-medium">
                          ¡Progreso excelente! Sigue así 🎯
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
