
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import { Target, TrendingUp, User, Database } from 'lucide-react'

interface FinancialGoalsSectionProps {
  goals: Array<{
    id: string
    title: string
    targetAmount: number
    currentAmount: number
    progress: number
    source: 'onboarding' | 'database'
  }>
}

export const FinancialGoalsSection: React.FC<FinancialGoalsSectionProps> = ({
  goals
}) => {
  const getSourceIcon = (source: string) => {
    return source === 'onboarding' 
      ? <User className="h-4 w-4 text-purple-600" />
      : <Database className="h-4 w-4 text-blue-600" />
  }

  const getSourceLabel = (source: string) => {
    return source === 'onboarding' ? 'Del onboarding' : 'Sistema'
  }

  const getSourceColor = (source: string) => {
    return source === 'onboarding' 
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800'
  }

  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas Financieras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes metas definidas
            </h3>
            <p className="text-gray-600 mb-4">
              Define tus objetivos financieros para crear un plan personalizado
            </p>
            <Button>Crear primera meta</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const completedGoals = goals.filter(goal => goal.progress >= 100)
  const activeGoals = goals.filter(goal => goal.progress < 100)

  return (
    <div className="space-y-6">
      {/* Resumen de metas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas Financieras
            <Badge variant="secondary">
              {completedGoals.length}/{goals.length} completadas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Metas Completadas</p>
              <p className="text-2xl font-bold text-green-700">
                {completedGoals.length}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">En Progreso</p>
              <p className="text-2xl font-bold text-blue-700">
                {activeGoals.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de metas */}
      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getSourceIcon(goal.source)}
                      <Badge
                        variant="outline"
                        className={`text-xs ${getSourceColor(goal.source)}`}
                      >
                        {getSourceLabel(goal.source)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {goal.progress >= 100 && (
                  <Badge className="bg-green-100 text-green-800">
                    ¡Completada!
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">
                      {Math.min(Math.round(goal.progress), 100)}%
                    </span>
                  </div>
                  <Progress value={Math.min(goal.progress, 100)} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Actual</p>
                    <p className="font-semibold text-lg">
                      {formatCurrency(goal.currentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Objetivo</p>
                    <p className="font-semibold text-lg">
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                {goal.progress < 100 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      Falta: {formatCurrency(goal.targetAmount - goal.currentAmount)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
