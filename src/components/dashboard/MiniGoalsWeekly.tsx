
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2,
  Sparkles
} from 'lucide-react'

interface MiniGoal {
  id: string
  title: string
  description: string
  points: number
  isCompleted: boolean
  completedAt?: string
  emoji: string
  currentValue?: number
  targetValue?: number
  unit?: string
}

interface MiniGoalsWeeklyProps {
  userId: string
  miniGoals: MiniGoal[]
  onCompleteMiniGoal: (goalId: string) => void
  isUpdating: boolean
}

export const MiniGoalsWeekly: React.FC<MiniGoalsWeeklyProps> = ({
  userId,
  miniGoals,
  onCompleteMiniGoal,
  isUpdating
}) => {
  const completedGoals = miniGoals?.filter(g => g.isCompleted) || []
  const activeGoals = miniGoals?.filter(g => !g.isCompleted) || []

  return (
    <div className="space-y-6">
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
    </div>
  )
}
