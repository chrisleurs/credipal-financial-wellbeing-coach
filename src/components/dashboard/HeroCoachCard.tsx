
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap,
  ChevronRight,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type MotivationLevel = 'low' | 'medium' | 'high' | 'celebration'

interface HeroCoachCardProps {
  userName?: string
  coachMessage?: string
  overallProgress?: number // 0-100
  motivationLevel?: MotivationLevel
  isLoading?: boolean
  onUpdatePlan?: () => void
  className?: string
}

const getMotivationConfig = (level: MotivationLevel) => {
  const configs = {
    low: {
      gradient: 'from-blue-500 via-blue-600 to-indigo-700',
      icon: Target,
      emoji: '🎯',
      accent: 'text-blue-100',
      ring: 'stroke-blue-200',
      button: 'bg-white/20 hover:bg-white/30 text-white'
    },
    medium: {
      gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      icon: TrendingUp,
      emoji: '📈',
      accent: 'text-emerald-100',
      ring: 'stroke-emerald-200',
      button: 'bg-white/20 hover:bg-white/30 text-white'
    },
    high: {
      gradient: 'from-violet-500 via-purple-600 to-indigo-700',
      icon: Zap,
      emoji: '⚡',
      accent: 'text-violet-100',
      ring: 'stroke-violet-200',
      button: 'bg-white/20 hover:bg-white/30 text-white'
    },
    celebration: {
      gradient: 'from-pink-500 via-rose-600 to-orange-600',
      icon: Sparkles,
      emoji: '🎉',
      accent: 'text-pink-100',
      ring: 'stroke-pink-200',
      button: 'bg-white/20 hover:bg-white/30 text-white'
    }
  }
  return configs[level]
}

export const HeroCoachCard: React.FC<HeroCoachCardProps> = ({
  userName = 'Usuario',
  coachMessage = '¡Vamos a alcanzar tus metas financieras juntos!',
  overallProgress = 0,
  motivationLevel = 'medium',
  isLoading = false,
  onUpdatePlan,
  className
}) => {
  const config = getMotivationConfig(motivationLevel)
  const Icon = config.icon
  const firstName = userName?.split(' ')[0] || 'Usuario'

  if (isLoading) {
    return (
      <Card className={cn(
        "relative overflow-hidden border-0 shadow-xl",
        `bg-gradient-to-br ${config.gradient}`,
        className
      )}>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center text-white space-y-4">
            <div className="flex items-center gap-2 opacity-80">
              <Heart className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">Preparando tu coach...</span>
            </div>
            
            <LoadingSpinner size="lg" className="mb-2" />
            
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded-full animate-pulse w-48"></div>
              <div className="h-3 bg-white/15 rounded-full animate-pulse w-32 mx-auto"></div>
            </div>

            <Button 
              disabled
              className="bg-white/10 text-white cursor-not-allowed opacity-60"
              size="sm"
            >
              Cargando...
              <LoadingSpinner size="sm" className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl",
      `bg-gradient-to-br ${config.gradient}`,
      className
    )}>
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      <div className="absolute top-1/2 right-8 opacity-20">
        <Icon className="h-16 w-16 text-white/30" />
      </div>

      <CardContent className="relative p-6 md:p-8">
        <div className="text-white space-y-6">
          {/* Header with Greeting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  ¡Hola {firstName}! {config.emoji}
                </h2>
                <p className={cn("text-sm", config.accent)}>
                  Tu coach financiero personal
                </p>
              </div>
            </div>
          </div>

          {/* Coach Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-base md:text-lg font-medium leading-relaxed">
              {coachMessage}
            </p>
          </div>

          {/* Progress Section */}
          {overallProgress > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso General</span>
                <span className="text-lg font-bold">{Math.round(overallProgress)}%</span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={overallProgress} 
                  className="h-3 bg-white/20 border-0"
                />
                <div 
                  className="absolute top-0 left-0 h-3 bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span className={config.accent}>
                  {overallProgress >= 80 
                    ? '¡Casi lo logras!' 
                    : overallProgress >= 50 
                    ? 'Vas muy bien'
                    : 'Cada paso cuenta'
                  }
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={onUpdatePlan}
              className={cn(
                "w-full md:w-auto group transition-all duration-200",
                config.button,
                "hover:scale-105 active:scale-95"
              )}
              size="lg"
              role="button"
              aria-label="Actualizar plan financiero"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Actualizar mi Plan
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Storybook Examples
export const HeroCoachCardExamples = {
  // Loading state
  Loading: (
    <HeroCoachCard 
      isLoading={true}
      motivationLevel="medium"
    />
  ),

  // Low motivation
  LowMotivation: (
    <HeroCoachCard
      userName="María González"
      coachMessage="No te preocupes, vamos paso a paso. Hoy es un buen día para empezar a organizarte. 🌱"
      overallProgress={15}
      motivationLevel="low"
      onUpdatePlan={() => console.log('Update plan clicked')}
    />
  ),

  // Medium motivation
  MediumMotivation: (
    <HeroCoachCard
      userName="Carlos Ramírez"
      coachMessage="¡Vas por buen camino! Tus esfuerzos están dando frutos. Sigamos construyendo tu futuro financiero. 💪"
      overallProgress={55}
      motivationLevel="medium"
      onUpdatePlan={() => console.log('Update plan clicked')}
    />
  ),

  // High motivation
  HighMotivation: (
    <HeroCoachCard
      userName="Ana Sofía"
      coachMessage="¡Increíble progreso! Estás dominando tus finanzas como un pro. ¡Vamos por esas metas! ⚡"
      overallProgress={78}
      motivationLevel="high"
      onUpdatePlan={() => console.log('Update plan clicked')}
    />
  ),

  // Celebration
  Celebration: (
    <HeroCoachCard
      userName="Roberto"
      coachMessage="¡WOW! ¡Has completado tu meta! Esto merece una celebración. ¡Eres imparable! 🎉✨"
      overallProgress={100}
      motivationLevel="celebration"
      onUpdatePlan={() => console.log('Update plan clicked')}
    />
  )
}
