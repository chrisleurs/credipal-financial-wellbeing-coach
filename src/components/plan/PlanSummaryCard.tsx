
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Target, Calendar, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { FinancialPlan } from '@/types/financialPlan'

interface PlanSummaryCardProps {
  plan: FinancialPlan
  onUpdatePlan?: () => void
}

export const PlanSummaryCard: React.FC<PlanSummaryCardProps> = ({ 
  plan, 
  onUpdatePlan 
}) => {
  const navigate = useNavigate()

  // Calcular progreso general del plan con validaciones defensivas
  const overallProgress = React.useMemo(() => {
    if (!plan?.actionRoadmap || !Array.isArray(plan.actionRoadmap) || plan.actionRoadmap.length === 0) {
      return 0
    }
    
    const completedActions = plan.actionRoadmap.filter(action => action?.completed).length
    return Math.round((completedActions / plan.actionRoadmap.length) * 100)
  }, [plan?.actionRoadmap])

  // Próxima acción pendiente con validación
  const nextAction = React.useMemo(() => {
    if (!plan?.actionRoadmap || !Array.isArray(plan.actionRoadmap)) {
      return null
    }
    return plan.actionRoadmap.find(action => action && !action.completed)
  }, [plan?.actionRoadmap])

  // Validar que el plan existe y tiene las propiedades mínimas necesarias
  if (!plan) {
    return (
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No hay plan financiero disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Mi Plan Financiero
          </CardTitle>
          {onUpdatePlan && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onUpdatePlan}
              className="text-primary hover:text-primary/80"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progreso General */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Progreso General
            </span>
            <span className="text-sm font-bold text-primary">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Métricas Clave */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              ${plan.emergencyFund?.currentAmount?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              Fondo Emergencia
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              ${plan.currentSnapshot?.totalDebt?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              Deuda Restante
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              ${plan.wealthGrowth?.year1?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              Meta Año 1
            </div>
          </div>
        </div>

        {/* Próxima Acción */}
        {nextAction && (
          <div className="p-3 bg-white rounded-lg border border-primary/10">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {nextAction.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fecha objetivo: {nextAction.targetDate ? new Date(nextAction.targetDate).toLocaleDateString() : 'Sin fecha'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botón Ver Plan Completo */}
        <Button 
          onClick={() => navigate('/progress')}
          className="w-full"
          variant="outline"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Ver Plan Completo
        </Button>
      </CardContent>
    </Card>
  )
}
