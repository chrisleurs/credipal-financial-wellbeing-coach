
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/helpers'
import { CheckCircle, Clock, Target, Calendar } from 'lucide-react'

interface GoalCardProps {
  goal: {
    id: string
    type: 'short' | 'medium' | 'long'
    title: string
    emoji: string
    targetAmount: number
    currentAmount: number
    deadline: string
    status: 'pending' | 'in_progress' | 'completed'
    progress: number
    actionText: string
  }
  onAction?: (goalId: string) => void
  onViewDetails?: (goalId: string) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onAction, onViewDetails }) => {
  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Target className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getTypeColor = () => {
    switch (goal.type) {
      case 'short':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'long':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleAction = () => {
    if (onAction) {
      onAction(goal.id)
    }
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(goal.id)
    }
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{goal.emoji}</span>
            <div>
              <h3 className="font-semibold text-lg">{goal.title}</h3>
              <Badge variant="outline" className={`text-xs ${getTypeColor()}`}>
                {goal.type === 'short' ? 'Corto plazo' : 
                 goal.type === 'medium' ? 'Mediano plazo' : 'Largo plazo'}
              </Badge>
            </div>
          </div>
          {getStatusIcon()}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{Math.round(goal.progress)}%</span>
            </div>
            <Progress value={goal.progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Actual</p>
              <p className="font-semibold">{formatCurrency(goal.currentAmount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Meta</p>
              <p className="font-semibold">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(goal.deadline).toLocaleDateString('es-ES')}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              disabled={goal.status === 'completed'}
              variant={goal.status === 'completed' ? 'secondary' : 'default'}
              onClick={handleAction}
            >
              {goal.status === 'completed' ? '¡Completado!' : goal.actionText}
            </Button>
            
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewDetails}
              >
                Ver detalles
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
