
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/helpers'
import { Target, Trophy, Clock, User, Database } from 'lucide-react'

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
    switch (source) {
      case 'onboarding':
        return <User className="h-4 w-4 text-purple-600" />
      default:
        return <Database className="h-4 w-4 text-gray-600" />
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'onboarding':
        return 'Del onboarding'
      default:
        return 'Sistema'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'onboarding':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mis Metas Financieras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Define tus metas financieras
            </h3>
            <p className="text-gray-600">
              Establece objetivos claros para alcanzar la libertad financiera
            </p>
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
            Resumen de Metas
            <Badge variant="secondary">{goals.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-600 mb-1">Completadas</p>
              <p className="text-2xl font-bold text-green-700">
                {completedGoals.length}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-600 mb-1">En Progreso</p>
              <p className="text-2xl font-bold text-blue-700">
                {activeGoals.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de metas */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Metas Financieras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">
                        Meta: {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getSourceColor(goal.source)}
                  >
                    <div className="flex items-center gap-1">
                      {getSourceIcon(goal.source)}
                      {getSourceLabel(goal.source)}
                    </div>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">{Math.round(goal.progress)}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Actual: {formatCurrency(goal.currentAmount)}</span>
                    <span>Restante: {formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                  </div>
                </div>

                {goal.progress >= 100 && (
                  <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>¡Meta completada! 🎉</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
