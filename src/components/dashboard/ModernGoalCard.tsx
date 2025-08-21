
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/helpers'
import { CheckCircle, Clock, Target, Calendar, ArrowRight, TrendingUp } from 'lucide-react'

interface ModernGoalCardProps {
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
}

export const ModernGoalCard: React.FC<ModernGoalCardProps> = ({ goal, onAction }) => {
  const getStatusConfig = () => {
    switch (goal.status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'in_progress':
        return {
          icon: Target,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        }
    }
  }

  const getTypeConfig = () => {
    switch (goal.type) {
      case 'short':
        return { label: 'Corto plazo', color: 'bg-green-100 text-green-800' }
      case 'medium':
        return { label: 'Mediano plazo', color: 'bg-blue-100 text-blue-800' }
      case 'long':
        return { label: 'Largo plazo', color: 'bg-purple-100 text-purple-800' }
    }
  }

  const statusConfig = getStatusConfig()
  const typeConfig = getTypeConfig()
  const StatusIcon = statusConfig.icon
  const remainingAmount = goal.targetAmount - goal.currentAmount
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${statusConfig.borderColor} ${statusConfig.bgColor}/20`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{goal.emoji}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
                <Badge variant="outline" className={`text-xs ${typeConfig.color}`}>
                  {typeConfig.label}
                </Badge>
              </div>
            </div>
            <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-semibold">{Math.round(goal.progress)}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>

            {/* Amount Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Actual</p>
                <p className="font-bold text-lg">{formatCurrency(goal.currentAmount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Objetivo</p>
                <p className="font-bold text-lg">{formatCurrency(goal.targetAmount)}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{daysLeft > 0 ? `${daysLeft} días` : 'Vencido'}</span>
              </div>
              {remainingAmount > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>{formatCurrency(remainingAmount)} restante</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className={`px-6 py-4 ${statusConfig.bgColor} border-t ${statusConfig.borderColor}`}>
          <Button 
            className="w-full group-hover:scale-105 transition-transform"
            disabled={goal.status === 'completed'}
            variant={goal.status === 'completed' ? 'secondary' : 'default'}
            onClick={() => onAction?.(goal.id)}
          >
            {goal.status === 'completed' ? (
              '¡Completado!'
            ) : (
              <>
                {goal.actionText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
