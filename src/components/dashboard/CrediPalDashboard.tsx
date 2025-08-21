
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { GoalCard } from './GoalCard'
import { FinancialSummary } from './FinancialSummary'
import { UpcomingPayments } from './UpcomingPayments'
import { 
  Sparkles,
  RefreshCw,
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

export const CrediPalDashboard = () => {
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
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={regeneratePlan}>Intentar de nuevo</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!generatedPlan || !consolidatedProfile) {
    return null
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CrediPal</h1>
              <p className="text-muted-foreground">Tu asistente financiero personal</p>
            </div>
          </div>
          <Button variant="outline" onClick={regeneratePlan} disabled={isGenerating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar Plan
          </Button>
        </div>
        
        <div className="bg-white/50 rounded-lg p-4">
          <p className="text-lg font-medium text-primary">
            {generatedPlan.motivationalMessage}
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <FinancialSummary consolidatedData={consolidatedProfile} />

      {/* Goals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🎯 Tus Objetivos Financieros
          </h2>
          <span className="text-sm text-muted-foreground">
            {generatedPlan.goals.filter(g => g.status === 'completed').length} de {generatedPlan.goals.length} completados
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedPlan.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <UpcomingPayments payments={generatedPlan.nextPayments} />

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedPlan.upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(milestone.progress)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {milestone.description}
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedPlan.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
