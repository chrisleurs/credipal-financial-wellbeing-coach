
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ModernFinancialSummary } from './ModernFinancialSummary'
import { ModernGoalCard } from './ModernGoalCard'
import { ModernUpcomingPayments } from './ModernUpcomingPayments'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const ModernCrediPalDashboard = () => {
  const { generatedPlan } = useFinancialPlan()
  const { consolidatedData } = useConsolidatedFinancialData()

  if (!generatedPlan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Plan no disponible</h3>
          <p className="text-muted-foreground">Genera tu plan financiero personalizado</p>
        </div>
      </div>
    )
  }

  // Usar propiedades correctas: currentAmount y targetAmount
  const getProgressPercentage = () => {
    if (!generatedPlan.goals.length) return 0
    const completedGoals = generatedPlan.goals.filter(g => {
      return g.progress >= 100 || (g.currentAmount >= g.targetAmount && g.targetAmount > 0)
    })
    return Math.round((completedGoals.length / generatedPlan.goals.length) * 100)
  }

  const progressPercentage = getProgressPercentage()

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Welcome Section - Simplified without redundant header */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-6 md:p-8 lg:p-10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                      Bienvenido de vuelta 👋
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 font-medium">
                      Tu coach financiero personal
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Actualizar Plan
                </Button>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-white/10 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    Progreso General
                  </h3>
                  <p className="text-sm md:text-base opacity-90">
                    Has completado {progressPercentage}% de tus objetivos financieros
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold">{progressPercentage}%</div>
                    <div className="text-xs md:text-sm opacity-75">Completado</div>
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20">
                    <div className="relative w-full h-full">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="opacity-20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${progressPercentage * 2.51} 251`}
                          className="transition-all duration-500 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column - Financial Summary */}
          <div className="xl:col-span-8 space-y-6 md:space-y-8">
            <ModernFinancialSummary />
            
            {/* Goals Section */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Tus Objetivos Financieros</h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {generatedPlan.goals.filter(g => g.progress >= 100 || (g.currentAmount >= g.targetAmount && g.targetAmount > 0)).length} de {generatedPlan.goals.length} completados
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Ver todos
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {generatedPlan.goals.slice(0, 4).map((goal) => (
                  <ModernGoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming & Milestones */}
          <div className="xl:col-span-4 space-y-6 md:space-y-8">
            {/* Upcoming Payments */}
            <ModernUpcomingPayments />
            
            {/* Next Milestones */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  Próximos Hitos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 md:space-y-4">
                  {generatedPlan.upcomingMilestones.map((milestone) => {
                    // Usar milestone.progress directamente ya que está disponible en la interfaz
                    const realProgress = milestone.progress || 0
                    
                    return (
                      <div key={milestone.id} className="group p-3 md:p-4 rounded-lg md:rounded-xl border hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm md:text-base truncate group-hover:text-primary transition-colors">
                              {milestone.title}
                            </h4>
                            <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                              {milestone.description}
                            </p>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs flex-shrink-0",
                              realProgress >= 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            )}
                          >
                            {realProgress >= 100 ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {realProgress >= 100 ? 'Completado' : 'En progreso'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">{Math.round(realProgress)}%</span>
                          </div>
                          <Progress 
                            value={realProgress} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{milestone.targetDate}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          >
                            Ver detalles
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
