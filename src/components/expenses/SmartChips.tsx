
import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, TrendingUp, Plus, Calendar } from 'lucide-react'

interface SmartChipsProps {
  userState: {
    hasIncome: boolean
    hasSubscriptions: boolean
    hasOverduePayments: boolean
    isOnTrack: boolean
  }
  onRecalculatePlan: () => void
  onAddIncome: () => void
  onAddSubscription: () => void
  onViewPayments: () => void
  onViewProgress: () => void
}

export const SmartChips: React.FC<SmartChipsProps> = ({
  userState,
  onRecalculatePlan,
  onAddIncome,
  onAddSubscription,
  onViewPayments,
  onViewProgress
}) => {
  const getContextualSuggestion = () => {
    if (!userState.hasIncome) {
      return {
        text: "Registrar ingreso",
        icon: TrendingUp,
        action: onAddIncome,
        variant: "secondary" as const
      }
    }

    if (!userState.hasSubscriptions) {
      return {
        text: "Añadir suscripción",
        icon: Plus,
        action: onAddSubscription,
        variant: "outline" as const
      }
    }

    if (userState.hasOverduePayments) {
      return {
        text: "Ver pagos de esta semana",
        icon: Calendar,
        action: onViewPayments,
        variant: "destructive" as const
      }
    }

    if (userState.isOnTrack) {
      return {
        text: "¡Vas excelente! Ver progreso",
        icon: TrendingUp,
        action: onViewProgress,
        variant: "default" as const
      }
    }

    return null
  }

  const suggestion = getContextualSuggestion()

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Recalculate Plan Chip - appears after significant actions */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRecalculatePlan}
        className="h-8 text-xs"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Recalcular Plan
      </Button>

      {/* Contextual Suggestion */}
      {suggestion && (
        <Button
          variant={suggestion.variant}
          size="sm"
          onClick={suggestion.action}
          className="h-8 text-xs"
        >
          <suggestion.icon className="h-3 w-3 mr-1" />
          {suggestion.text}
        </Button>
      )}
    </div>
  )
}
