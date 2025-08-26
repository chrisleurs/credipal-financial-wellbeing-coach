
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/helpers'
import { 
  Target,
  Trophy,
  Clock,
  ArrowUp
} from 'lucide-react'

interface BigGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  progress: number
  status: 'active' | 'completed' | 'paused'
  timeline?: string
  emoji: string
}

interface BigGoalsSectionProps {
  goals: BigGoal[]
  onUpdateGoal: (goalId: string, updates: any) => void
  isUpdating: boolean
}

export const BigGoalsSection: React.FC<BigGoalsSectionProps> = ({
  goals,
  onUpdateGoal,
  isUpdating
}) => {
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
      <div className="space-y-6">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
    </div>
  )
}
