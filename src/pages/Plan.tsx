
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PlanGenerationModal } from '@/components/dashboard/PlanGenerationModal'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { CheckCircle, Clock, TrendingUp, Target, Sparkles, Plus } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

const Plan = () => {
  const navigate = useNavigate()
  const { dashboardData, isLoading, hasActivePlan, updateGoalProgress, refetch } = useFinancialPlan()
  const { 
    isGenerating, 
    generatedPlan, 
    generatePlan, 
    savePlan, 
    clearPlan 
  } = useFinancialPlanGenerator()
  
  const [showGenerationModal, setShowGenerationModal] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleGenerateNewPlan = async () => {
    const success = await generatePlan()
    if (success && generatedPlan) {
      setShowGenerationModal(true)
    }
  }

  const handleConfirmPlan = async () => {
    setIsConfirming(true)
    try {
      const success = await savePlan()
      if (success) {
        setShowGenerationModal(false)
        clearPlan()
        await refetch() // Refresh the data
      }
    } finally {
      setIsConfirming(false)
    }
  }

  const handleAdjustPlan = () => {
    // For now, close modal and allow regeneration
    // In production, this could open an adjustment interface
    setShowGenerationModal(false)
    clearPlan()
  }

  const handleCloseModal = () => {
    setShowGenerationModal(false)
    clearPlan()
  }

  const handleGoalAction = (goalId: string) => {
    // Mock action - in production this would open a contribution modal
    const amount = 50
    updateGoalProgress(goalId, amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu plan financiero..." />
      </div>
    )
  }

  // No Active Plan State
  if (!hasActivePlan || !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tu Plan Financiero Personalizado
          </h1>
          <p className="text-muted-foreground">
            Deja que Credi analice tu situación y cree un plan inteligente para ti
          </p>
        </div>

        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                ¡Es hora de crear tu plan financiero!
              </h2>
              <p className="text-muted-foreground mb-6">
                Credi utilizará tu información existente para generar automáticamente 
                un plan de 3 metas basado en la metodología probada 3-2-1.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleGenerateNewPlan}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Credi está analizando...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Crear mi Plan con Credi
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground">
                No te preocupes, podrás ajustarlo después de verlo
              </p>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-3">¿Qué incluye tu plan?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span>Meta corto plazo</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                  <span>Meta mediano plazo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span>Meta largo plazo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Modal */}
        {generatedPlan && (
          <PlanGenerationModal
            isOpen={showGenerationModal}
            onClose={handleCloseModal}
            goals={generatedPlan.goals}
            analysis={generatedPlan.analysis}
            motivationalMessage={generatedPlan.motivationalMessage}
            monthlyCapacity={generatedPlan.monthlyCapacity}
            onConfirm={handleConfirmPlan}
            onAdjust={handleAdjustPlan}
            isConfirming={isConfirming}
          />
        )}
      </div>
    )
  }

  // Active Plan State
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {dashboardData.greeting}
        </h1>
        <p className="text-muted-foreground">
          {dashboardData.motivationalMessage}
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {dashboardData.goals.map((goal) => (
          <Card key={goal.id} className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{goal.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {goal.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {goal.type === 'short' ? 'Corto plazo' : 
                       goal.type === 'medium' ? 'Mediano plazo' : 'Largo plazo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progreso</span>
                  <span className="text-sm font-medium">{Math.round(goal.progress)}%</span>
                </div>
                <Progress value={goal.progress} className="h-3 mb-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">
                    {formatCurrency(goal.currentAmount)}
                  </span>
                  <span className="text-muted-foreground">
                    de {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </div>

              {/* Action */}
              <Button
                onClick={() => handleGoalAction(goal.id)}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={goal.status === 'completed'}
              >
                {goal.status === 'completed' ? 'Completada' : goal.actionText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regenerate Plan Button */}
      <div className="text-center pt-6">
        <Button
          onClick={handleGenerateNewPlan}
          disabled={isGenerating}
          variant="outline"
          size="lg"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Generando nuevo plan...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Actualizar mi Plan con Credi
            </>
          )}
        </Button>
      </div>

      {/* Generation Modal */}
      {generatedPlan && (
        <PlanGenerationModal
          isOpen={showGenerationModal}
          onClose={handleCloseModal}
          goals={generatedPlan.goals}
          analysis={generatedPlan.analysis}
          motivationalMessage={generatedPlan.motivationalMessage}
          monthlyCapacity={generatedPlan.monthlyCapacity}
          onConfirm={handleConfirmPlan}
          onAdjust={handleAdjustPlan}
          isConfirming={isConfirming}
        />
      )}
    </div>
  )
}

export default Plan
