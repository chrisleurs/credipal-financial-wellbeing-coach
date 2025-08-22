
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Zap, Target, Star, Trophy } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useMiniGoals } from '@/hooks/useMiniGoals'

export const MiniGoalsSection = () => {
  const { 
    goals, 
    completedThisWeek, 
    getProgressPercentage, 
    getMotivationalMessage,
    completeGoal,
    isLoading 
  } = useMiniGoals()

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap
      case 'Target': return Target
      case 'Star': return Star
      default: return Target
    }
  }

  const getCardStyles = (isCompleted: boolean, category: string) => {
    if (isCompleted) {
      return {
        border: 'border-[#10B981]/40',
        bg: 'bg-[#10B981]/10',
        iconBg: 'bg-[#10B981]/20',
        iconColor: 'text-[#10B981]'
      }
    }
    
    switch (category) {
      case 'expense':
        return {
          border: 'border-[#F59E0B]/20',
          bg: 'bg-[#F59E0B]/5',
          iconBg: 'bg-[#F59E0B]/20',
          iconColor: 'text-[#F59E0B]'
        }
      case 'saving':
        return {
          border: 'border-[#0891B2]/20',
          bg: 'bg-[#0891B2]/5',
          iconBg: 'bg-[#0891B2]/20',
          iconColor: 'text-[#0891B2]'
        }
      case 'debt':
        return {
          border: 'border-[#EF4444]/20',
          bg: 'bg-[#EF4444]/5',
          iconBg: 'bg-[#EF4444]/20',
          iconColor: 'text-[#EF4444]'
        }
      default:
        return {
          border: 'border-[#6366F1]/20',
          bg: 'bg-[#6366F1]/5',
          iconBg: 'bg-[#6366F1]/20',
          iconColor: 'text-[#6366F1]'
        }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Retos de la Semana</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-[#F59E0B]/20 bg-[#F59E0B]/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">Generando tu primer reto</p>
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
          
          <Card className="border-[#0891B2]/20 bg-[#0891B2]/5">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#0891B2]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-5 w-5 text-[#0891B2]" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">Preparando tu segundo reto</p>
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Retos de la Semana</h2>
        {completedThisWeek >= 3 && (
          <div className="flex items-center gap-1 text-sm text-[#10B981] font-medium">
            <Trophy className="h-4 w-4" />
            <span>¡Streak! 🔥</span>
          </div>
        )}
      </div>

      {/* Motivational message */}
      <div className="text-center">
        <p className="text-sm text-gray-600 font-medium">
          {getMotivationalMessage()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {completedThisWeek} de {goals.length} completados esta semana
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => {
          const IconComponent = getIconComponent(goal.icon)
          const styles = getCardStyles(goal.isCompleted, goal.category)
          const progress = getProgressPercentage(goal)
          
          return (
            <Card 
              key={goal.id} 
              className={`${styles.border} ${styles.bg} cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
              onClick={() => !goal.isCompleted && completeGoal(goal.id)}
            >
              <CardContent className="p-4">
                <div className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className={`h-5 w-5 ${styles.iconColor}`} />
                </div>
                
                <div className="text-center mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1 leading-tight">
                    {goal.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {goal.description}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="space-y-2">
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {goal.currentValue}/{goal.targetValue}
                    </span>
                    {goal.isCompleted && (
                      <span className="text-[#10B981] font-medium">
                        ¡Completado! ✨
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge preview */}
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {goal.badge}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Celebration message for streak */}
      {completedThisWeek >= 3 && (
        <div className="text-center p-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
          <p className="text-sm font-medium text-[#10B981]">
            🏆 ¡Streak de campeón! Has completado {completedThisWeek} retos esta semana
          </p>
        </div>
      )}
    </div>
  )
}
