
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Star, Zap, Target, Plus } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/LanguageContext'

interface MetaData {
  id: string
  titulo: string
  meta: number
  progreso: number
  tipo: 'ahorro' | 'gasto'
  completada: boolean
  fechaLimite?: string
}

interface MetasCortoPlazoData {
  semanales: MetaData[]
  mensuales: MetaData[]
}

interface MetasCortoPlazoProps {
  data: MetasCortoPlazoData
}

export const MetasCortoPlazo = ({ data }: MetasCortoPlazoProps) => {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [localData, setLocalData] = useState(data)

  const handleCompleteGoal = (tipo: 'semanales' | 'mensuales', goalId: string) => {
    setLocalData(prev => ({
      ...prev,
      [tipo]: prev[tipo].map(goal => 
        goal.id === goalId 
          ? { ...goal, completada: true, progreso: goal.meta }
          : goal
      )
    }))

    toast({
      title: t('goal_completed'),
      description: "Has logrado una nueva meta financiera",
    })
  }

  const getProgressColor = (progreso: number, meta: number, completada: boolean) => {
    if (completada) return 'text-green-600'
    const porcentaje = (progreso / meta) * 100
    if (porcentaje >= 80) return 'text-green-600'
    if (porcentaje >= 50) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getTypeColor = (tipo: string) => {
    return tipo === 'ahorro' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const renderGoalCard = (goal: MetaData, tipo: 'semanales' | 'mensuales') => {
    const porcentaje = Math.round((goal.progreso / goal.meta) * 100)
    
    return (
      <Card 
        key={goal.id} 
        className={`transition-all duration-200 ${
          goal.completada 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
            : 'hover:shadow-md'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                {goal.completada ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                {goal.titulo}
              </h4>
              <Badge variant="outline" className={getTypeColor(goal.tipo)}>
                {goal.tipo}
              </Badge>
            </div>
            
            {goal.completada && (
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            )}
          </div>

          {/* Progress section */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">{t('progress')}</span>
              <span className={`text-xs font-medium ${getProgressColor(goal.progreso, goal.meta, goal.completada)}`}>
                {porcentaje}%
              </span>
            </div>
            <Progress 
              value={porcentaje} 
              className="h-2"
            />
          </div>

          {/* Amount details */}
          <div className="flex justify-between items-center mb-3 text-sm">
            <span className="text-gray-600">{t('current')}:</span>
            <span className="font-semibold">{formatCurrency(goal.progreso)}</span>
          </div>
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-gray-600">{t('target')}:</span>
            <span className="font-semibold">{formatCurrency(goal.meta)}</span>
          </div>

          {/* Action button */}
          {!goal.completada && porcentaje >= 80 && (
            <Button
              size="sm"
              className="w-full"
              onClick={() => handleCompleteGoal(tipo, goal.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {t('mark_completed')}
            </Button>
          )}

          {goal.fechaLimite && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              {t('deadline')}: {new Date(goal.fechaLimite).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          {t('short_term_goals')}
        </CardTitle>
        <CardDescription>
          {t('weekly_monthly_objectives')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Metas Semanales */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                {t('weekly_goals')}
              </h3>
              <Badge variant="outline">
                {localData.semanales.filter(m => m.completada).length}/{localData.semanales.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {localData.semanales.map(goal => renderGoalCard(goal, 'semanales'))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-3">
              <Plus className="h-4 w-4 mr-1" />
              {t('add_weekly_goal')}
            </Button>
          </div>

          {/* Metas Mensuales */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                {t('monthly_goals')}
              </h3>
              <Badge variant="outline">
                {localData.mensuales.filter(m => m.completada).length}/{localData.mensuales.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {localData.mensuales.map(goal => renderGoalCard(goal, 'mensuales'))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-3">
              <Plus className="h-4 w-4 mr-1" />
              {t('add_monthly_goal')}
            </Button>
          </div>
        </div>

        {/* Gamification summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {localData.semanales.filter(m => m.completada).length + localData.mensuales.filter(m => m.completada).length}
              </div>
              <div className="text-sm text-purple-700">{t('goals_completed')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">
                {Math.round(
                  ((localData.semanales.filter(m => m.completada).length + localData.mensuales.filter(m => m.completada).length) /
                  (localData.semanales.length + localData.mensuales.length)) * 100
                )}%
              </div>
              <div className="text-sm text-pink-700">{t('success_rate')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {localData.semanales.filter(m => m.completada).length * 10 + localData.mensuales.filter(m => m.completada).length * 25}
              </div>
              <div className="text-sm text-indigo-700">{t('points_earned')}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
