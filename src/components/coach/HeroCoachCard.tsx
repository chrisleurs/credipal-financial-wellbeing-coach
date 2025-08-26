import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, TrendingUp, Target } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { AnimatedProgressRing } from '../shared/AnimatedProgressRing'

interface HeroCoachCardProps {
  userData: any
  aiPlan?: any
  onGeneratePlan?: () => void
  onRefresh?: () => void
  isGenerating?: boolean
  lastSyncTime?: Date | null
}

export const HeroCoachCard = ({ 
  userData, 
  aiPlan,
  onGeneratePlan, 
  onRefresh,
  isGenerating = false,
  lastSyncTime
}: HeroCoachCardProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const calculateHealthScore = (): number => {
    let score = 50 // Base score
    
    // Reward savings
    if (userData.currentSavings > 0) {
      score += 15
    }

    // Reward low debt
    if (userData.totalDebtBalance < userData.monthlyIncome * 3) {
      score += 20
    }

    // Reward positive balance
    if (userData.monthlyBalance > 0) {
      score += 15
    }

    return Math.min(score, 100)
  }

  const getCoachMood = (): { mood: string; color: string; emoji: string; message: string } => {
    const { monthlyBalance } = userData

    if (monthlyBalance > 1000) {
      return {
        mood: 'great',
        color: 'from-green-400 to-green-600',
        emoji: '🚀',
        message: '¡Estás en excelente forma financiera!'
      }
    } else if (monthlyBalance > 0) {
      return {
        mood: 'good',
        color: 'from-blue-400 to-blue-600',
        emoji: '👍',
        message: 'Vas por buen camino, sigue así.'
      }
    } else {
      return {
        mood: 'neutral',
        color: 'from-orange-400 to-orange-600',
        emoji: '🤔',
        message: 'Analicemos cómo mejorar tus finanzas.'
      }
    }
  }

  const generateCoachMessage = (): string => {
    // If we have AI plan message, use it
    if (aiPlan?.coachMessage?.text) {
      return aiPlan.coachMessage.text
    }
    
    const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Usuario'
    const { savingsCapacity, totalDebtBalance, monthlyIncome } = userData
    
    if (savingsCapacity > 5000) {
      return `¡${firstName}, tu fondo de emergencia está muy bien! Sigue ahorrando.`
    } else if (totalDebtBalance > monthlyIncome * 5) {
      return `¡${firstName}, enfócate en reducir tus deudas!`
    } else {
      return `¡${firstName}, revisa tus gastos y ahorra más!`
    }
  }

  const handleGeneratePlan = async () => {
    if (onGeneratePlan) {
      onGeneratePlan()
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      if (onRefresh) {
        await onRefresh()
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  const mood = getCoachMood()
  const healthScore = calculateHealthScore()
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Usuario'

  return (
    <Card className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${mood.color} text-white`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.1)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.0)' }} />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gradient)" />
        </svg>
      </div>

      <CardContent className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Health Score Ring */}
          <div className="flex flex-col items-center space-y-2">
            <AnimatedProgressRing 
              progress={healthScore} 
              size={120}
              strokeWidth={8}
              className="text-white"
            />
            <div className="text-center">
              <div className="text-sm opacity-90">Salud Financiera</div>
              <div className="text-2xl font-bold">{healthScore}/100</div>
            </div>
          </div>

          {/* Center: Coach Message & Stats */}
          <div className="text-center space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-lg leading-relaxed">
                {generateCoachMessage()}
              </p>
            </div>
            
            {/* AI Plan Stats */}
            {aiPlan && (
              <div className="flex justify-center gap-4 text-sm">
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  🎯 {aiPlan.stats.completedBigGoals}/3 metas
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  ⚡ {aiPlan.stats.completedMiniGoals} mini-metas
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  🏆 {aiPlan.stats.totalPoints} puntos
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generando Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {aiPlan ? 'Actualizar Plan' : 'Generar Plan AI'}
                </>
              )}
            </Button>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar Datos
                </>
              )}
            </Button>

            {/* Next Action Badge */}
            {aiPlan?.immediateAction && !aiPlan.immediateAction.isCompleted && (
              <div className="bg-orange-500/20 border border-orange-300/30 rounded-lg p-3">
                <div className="text-xs font-semibold opacity-90 mb-1">PRÓXIMA ACCIÓN</div>
                <div className="text-sm">{aiPlan.immediateAction.title}</div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Mood & Sync Status */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-sm opacity-90">{mood.message}</span>
          </div>
          
          {lastSyncTime && (
            <div className="text-xs opacity-75">
              Actualizado: {lastSyncTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
