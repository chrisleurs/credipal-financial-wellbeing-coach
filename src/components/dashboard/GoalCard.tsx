
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/helpers'
import type { FinancialGoal } from '@/types/financialPlan'
import { CheckCircle, Clock, Target } from 'lucide-react'

interface GoalCardProps {
  goal: FinancialGoal
  onAction: (goalId: string) => void
  onViewDetails: (goalId: string) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onAction, onViewDetails }) => {
  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'in_progress':
        return <Target className="h-6 w-6 text-primary" />
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'border-green-200 bg-green-50'
      case 'in_progress':
        return 'border-primary/20 bg-primary/5'
      default:
        return 'border-muted bg-muted/20'
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Vencido'
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    if (diffDays < 30) return `${diffDays} días`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} meses`
    return `${Math.ceil(diffDays / 365)} años`
  }

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${getStatusColor()}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{goal.emoji}</span>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {goal.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getStatusIcon()}
                <span className="capitalize">{goal.type} plazo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progreso</span>
            <span className="text-sm font-medium">{Math.round(goal.progress)}%</span>
          </div>
          <Progress 
            value={goal.progress} 
            className="h-3 mb-2"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-primary">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-muted-foreground">
              de {formatCurrency(goal.targetAmount)}
            </span>
          </div>
        </div>

        {/* Deadline */}
        <div className="mb-4 p-3 bg-background rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tiempo restante:</span>
            <span className="text-sm font-medium">
              {formatDeadline(goal.deadline)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onAction(goal.id)}
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={goal.status === 'completed'}
          >
            {goal.status === 'completed' ? 'Completada' : goal.actionText}
          </Button>
          <Button
            onClick={() => onViewDetails(goal.id)}
            variant="outline"
            size="sm"
          >
            Ver detalles
          </Button>
        </div>

        {/* Success indicator */}
        {goal.status === 'completed' && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ¡Lograda!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
