
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
  const { plan } = useFinancialPlan()
  const { consolidatedData } = useConsolidatedFinancialData()

  if (!plan) {
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

  // Create mock dashboard data from plan
  const dashboardData = {
    greeting: plan.coachMessage?.personalizedGreeting || 'Bienvenido',
    goals: plan.bigGoals?.map(goal => ({
      id: goal.id,
      title: goal.title,
      emoji: goal.emoji || '🎯',
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      progress: goal.progress,
      deadline: goal.deadline,
      status: goal.status
    })) || [],
    crediMessage: {
      text: plan.coachMessage?.text || 'Continúa con tus objetivos financieros',
      type: 'motivational' as const
    }
  }

  // Crear datos por defecto para consolidated data si no están disponibles
  const defaultConsolidatedData = {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    savingsCapacity: 0
  }

  const safeConsolidatedData = consolidatedData || defaultConsolidatedData

  // Crear pagos de muestra basados en las metas
  const mockPayments = dashboardData.goals.slice(0, 3).map(goal => ({
    id: goal.id,
    type: 'goal' as const,
    name: goal.title,
    amount: Math.round((goal.targetAmount - goal.currentAmount) / 12), // Dividir en 12 meses
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Fecha aleatoria en los próximos 30 días
    priority: goal.progress > 50 ? 'high' as const : 'medium' as const
  }))

  // Usar propiedades correctas: currentAmount y targetAmount
  const getProgressPercentage = () => {
    if (!dashboardData.goals.length) return 0
    const completedGoals = dashboardData.goals.filter(g => {
      return g.progress >= 100 || (g.currentAmount >= g.targetAmount && g.targetAmount > 0)
    })
    return Math.round((completedGoals.length / dashboardData.goals.length) * 100)
  }

  const progressPercentage = getProgressPercentage()

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Welcome Section */}
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
                      {dashboardData.greeting}
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
            <ModernFinancialSummary consolidatedData={safeConsolidatedData} />
            
            {/* Goals Section */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Tus Objetivos Financieros</h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {dashboardData.goals.filter(g => g.progress >= 100 || (g.currentAmount >= g.targetAmount && g.targetAmount > 0)).length} de {dashboardData.goals.length} completados
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Ver todos
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {dashboardData.goals.slice(0, 4).map((goal) => (
                  <ModernGoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming & Milestones */}
          <div className="xl:col-span-4 space-y-6 md:space-y-8">
            {/* Upcoming Payments */}
            <ModernUpcomingPayments payments={mockPayments} />
            
            {/* CrediPal Message */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  Mensaje de CrediPal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-4 md:p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    {dashboardData.crediMessage.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {dashboardData.crediMessage.type}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Más consejos
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
