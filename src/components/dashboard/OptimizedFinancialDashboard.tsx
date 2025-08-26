import React, { Suspense } from 'react'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { useAuth } from '@/hooks/useAuth'
import { HeroCoachCard } from './HeroCoachCard'
import { ModernFinancialSummary } from './ModernFinancialSummary'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/helpers'
import { useToast } from '@/hooks/use-toast'
import { 
  PlusCircle, 
  TrendingUp, 
  CheckCircle2, 
  Target,
  Sparkles,
  ChevronRight,
  ArrowUp,
  Trophy,
  Clock,
  RefreshCw
} from 'lucide-react'

// Sticky Navigation Component
const StickyNavigation = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">CrediPal Dashboard</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('hero')}>
              Coach
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('goals')}>
              Metas
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('mini-goals')}>
              Semanal
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('summary')}>
              Resumen
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Big Goals Section Component
const BigGoalsSection = ({ goals, onUpdateGoal, isUpdating }: {
  goals: any[]
  onUpdateGoal: (goalId: string, updates: any) => void
  isUpdating: boolean
}) => {
  const { toast } = useToast()

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (goal) {
      const newCurrentAmount = (newProgress / 100) * goal.targetAmount
      onUpdateGoal(goalId, { 
        currentAmount: newCurrentAmount,
        progress: newProgress 
      })
    }
  }

  if (!goals || goals.length === 0) {
    return (
      <section id="goals" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Metas Principales</h2>
          <Badge variant="secondary">0/3 completadas</Badge>
        </div>
        <Card className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No tienes metas definidas</h3>
          <p className="text-muted-foreground mb-4">
            Genera tu plan financiero para establecer metas personalizadas
          </p>
        </Card>
      </section>
    )
  }

  return (
    <section id="goals" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Metas Principales</h2>
        <Badge variant="secondary">
          {goals.filter(g => g.status === 'completed').length}/{goals.length} completadas
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{goal.emoji}</span>
                  <CardTitle className="text-base">{goal.title}</CardTitle>
                </div>
                <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                  {goal.status === 'completed' ? 'Completada' : 'Activa'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progreso</span>
                  <span className="font-medium">{Math.round(goal.progress)}%</span>
                </div>
                
                <Progress value={goal.progress} className="h-2" />
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>

              {goal.timeline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Meta: {goal.timeline}</span>
                </div>
              )}

              {goal.status !== 'completed' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleProgressUpdate(goal.id, Math.min(100, goal.progress + 10))}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +10%
                  </Button>
                  
                  {goal.progress >= 90 && (
                    <Button
                      size="sm"
                      onClick={() => handleProgressUpdate(goal.id, 100)}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      <Trophy className="h-3 w-3 mr-1" />
                      Completar
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
            
            {goal.status === 'completed' && (
              <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                <div className="bg-green-500 text-white rounded-full p-3">
                  <Trophy className="h-6 w-6" />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

// Mini Goals Weekly Component
const MiniGoalsWeekly = ({ userId, miniGoals, onCompleteMiniGoal, isUpdating }: {
  userId: string
  miniGoals: any[]
  onCompleteMiniGoal: (goalId: string) => void
  isUpdating: boolean
}) => {
  const completedGoals = miniGoals?.filter(g => g.isCompleted) || []
  const activeGoals = miniGoals?.filter(g => !g.isCompleted) || []

  return (
    <section id="mini-goals" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Metas de Esta Semana</h2>
        <Badge variant="outline">
          {completedGoals.length}/{miniGoals?.length || 0} completadas
        </Badge>
      </div>

      {(!miniGoals || miniGoals.length === 0) ? (
        <Card className="p-6 text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Sin mini-metas esta semana</h3>
          <p className="text-sm text-muted-foreground">
            Genera tu plan para obtener mini-metas semanales
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{goal.emoji}</span>
                      <h3 className="font-medium">{goal.title}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {goal.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">+{goal.points} puntos</Badge>
                        {goal.currentValue !== undefined && (
                          <span className="text-muted-foreground">
                            {goal.currentValue}/{goal.targetValue} {goal.unit}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => onCompleteMiniGoal(goal.id)}
                        disabled={isUpdating}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {completedGoals.map((goal) => (
            <Card key={goal.id} className="opacity-75 bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">{goal.title}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +{goal.points} puntos
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

// Quick Actions Section Component
const QuickActionsSection = ({ userId }: { userId: string }) => {
  const { toast } = useToast()

  const quickActions = [
    {
      id: 'add-expense',
      title: 'Registrar Gasto',
      description: 'Anota un gasto rápidamente',
      icon: PlusCircle,
      variant: 'primary',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Registro rápido de gastos estará disponible pronto",
        })
      }
    },
    {
      id: 'add-income',
      title: 'Registrar Ingreso',
      description: 'Añade un nuevo ingreso',
      icon: TrendingUp,
      variant: 'success',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Registro rápido de ingresos estará disponible pronto",
        })
      }
    },
    {
      id: 'pay-debt',
      title: 'Pagar Deuda',
      description: 'Registra un pago de deuda',
      icon: CheckCircle2,
      variant: 'warning',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Registro de pagos estará disponible pronto",
        })
      }
    },
    {
      id: 'update-goal',
      title: 'Actualizar Meta',
      description: 'Modifica tus objetivos',
      icon: Target,
      variant: 'secondary',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Actualización de metas estará disponible pronto",
        })
      }
    }
  ]

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Acciones Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map(action => (
          <Card 
            key={action.id} 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            onClick={action.action}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

// Main Dashboard Component
export const OptimizedFinancialDashboard = () => {
  const { user } = useAuth()
  const { data: financialData, isLoading: financialLoading, error: financialError } = useUnifiedFinancialData()
  
  const {
    aiPlan,
    loading: planLoading,
    isUpdatingGoal,
    isGeneratingPlan,
    isRefreshingData,
    updateBigGoal,
    completeMiniGoal,
    generateNewPlan,
    refreshAll,
    error: planError
  } = useFinancialPlan()

  const loading = financialLoading || planLoading
  const error = financialError || planError

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StickyNavigation />
        <main className="pt-14 container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size="lg" text="Cargando tu dashboard financiero..." />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <StickyNavigation />
        <main className="pt-14 container mx-auto px-4 py-6">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
              <p className="text-muted-foreground mb-4">
                No se pudieron cargar tus datos financieros.
              </p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Intentar de nuevo
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const userName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Usuario'

  // Convertir datos unificados al formato esperado por ModernFinancialSummary
  const consolidatedData = financialData ? {
    monthlyIncome: financialData.totalMonthlyIncome,
    monthlyExpenses: financialData.monthlyExpenses,
    currentSavings: financialData.currentSavings,
    savingsCapacity: financialData.monthlySavingsCapacity
  } : {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    savingsCapacity: 0
  }

  return (
    <div className="min-h-screen bg-background">
      <StickyNavigation />
      
      <main className="pt-14 container mx-auto px-4 py-6 space-y-8">
        {/* 1. Hero Coach Card */}
        <section id="hero">
          <HeroCoachCard
            userName={userName}
            coachMessage={aiPlan?.coachMessage?.text || `¡Hola ${userName}! Vamos a alcanzar tus metas financieras juntos.`}
            overallProgress={aiPlan?.overallProgress || 0}
            motivationLevel={
              aiPlan?.overallProgress >= 80 ? 'celebration' :
              aiPlan?.overallProgress >= 50 ? 'high' :
              aiPlan?.overallProgress >= 25 ? 'medium' : 'low'
            }
            isLoading={isGeneratingPlan || isRefreshingData}
            onUpdatePlan={generateNewPlan}
          />
        </section>

        {/* 2. Big Goals Section */}
        <section id="goals">
          <Suspense fallback={<LoadingSpinner size="md" text="Cargando metas..." />}>
            <BigGoalsSection
              goals={aiPlan?.bigGoals || []}
              onUpdateGoal={updateBigGoal}
              isUpdating={isUpdatingGoal}
            />
          </Suspense>
        </section>

        {/* 3. Mini Goals Weekly */}
        <section id="mini-goals">
          <Suspense fallback={<LoadingSpinner size="md" text="Cargando mini-metas..." />}>
            <MiniGoalsWeekly
              userId={user?.id || ''}
              miniGoals={aiPlan?.miniGoals || []}
              onCompleteMiniGoal={completeMiniGoal}
              isUpdating={isUpdatingGoal}
            />
          </Suspense>
        </section>

        {/* 4. Financial Summary */}
        <section id="summary">
          <Suspense fallback={<LoadingSpinner size="md" text="Cargando resumen..." />}>
            <ModernFinancialSummary consolidatedData={consolidatedData} />
          </Suspense>
        </section>

        {/* 5. Quick Actions */}
        <section>
          <QuickActionsSection userId={user?.id || ''} />
        </section>

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20 md:h-8" />
      </main>
    </div>
  )
}
