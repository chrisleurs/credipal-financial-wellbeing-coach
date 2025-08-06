
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GoalCard } from './GoalCard'
import { JourneyProgress } from './JourneyProgress'
import { CrediAssistant } from './CrediAssistant'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { 
  BarChart3, 
  History, 
  Settings, 
  Plus, 
  Trophy,
  HelpCircle,
  RefreshCw
} from 'lucide-react'

export const FinancialPlanDashboard = () => {
  const { 
    dashboardData, 
    isLoading, 
    updateGoalProgress, 
    markGoalCompleted 
  } = useFinancialPlan()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu plan financiero..." />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No hay datos del plan</h2>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  const handleGoalAction = (goalId: string) => {
    // En producción, abriría un modal para registrar el progreso
    const amount = 50 // Mock amount
    updateGoalProgress(goalId, amount)
  }

  const handleViewDetails = (goalId: string) => {
    console.log('Ver detalles de la meta:', goalId)
    // Aquí se abriría un modal con detalles de la meta
  }

  const handleUpdatePlan = () => {
    console.log('Actualizar plan con Credi')
    // Aquí se abriría el modal de recalculación
  }

  const handleChatWithCredi = () => {
    console.log('Abrir chat con Credi')
    // Aquí se abriría el chat con Credi
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Principal */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {dashboardData.greeting}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dashboardData.motivationalMessage}
            </p>
          </div>

          {/* Navegación Secundaria */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Ver mis Números
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historial
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección Central: Las 3 Metas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            🎯 Tus 3 Metas Activas
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dashboardData.goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAction={handleGoalAction}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        {/* Línea de Progreso del Journey */}
        <div className="mb-8">
          <JourneyProgress journey={dashboardData.journey} />
        </div>

        {/* Centro de Comando con Credi */}
        <div className="mb-8">
          <CrediAssistant 
            message={dashboardData.crediMessage}
            onChat={handleChatWithCredi}
          />
        </div>

        {/* Acciones Principales */}
        <div className="space-y-4">
          {/* Botón Primario */}
          <div className="text-center">
            <Button
              onClick={handleUpdatePlan}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Actualizar mi Plan con Credi
            </Button>
          </div>

          {/* Botones Secundarios */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Registrar Progreso
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Celebrar Logro
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Necesito Ayuda
            </Button>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                💡 Tu plan financiero personal
              </h3>
              <p className="text-muted-foreground">
                Este plan se adapta a tu ritmo de vida y se actualiza automáticamente. 
                Credi está aquí para celebrar tus logros y ayudarte cuando lo necesites.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
