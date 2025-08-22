
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Target, MapPin, Trophy, Sparkles, Clock, TrendingUp } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { usePlan321Generator } from '@/hooks/usePlan321Generator'
import { formatCurrency } from '@/utils/helpers'

export const Plan321Section = () => {
  const { milestones, totalProgress, isLoading, hasDebtPriority, dineroDisponibleMensual } = usePlan321Generator()

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Tu Plan 3.2.1</h2>
          <Sparkles className="h-5 w-5 text-[#F59E0B]" />
        </div>
        
        <Card className="border-[#10B981]/20 bg-[#10B981]/5">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-[#10B981]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Preparando tu roadmap financiero</p>
                <p className="text-sm text-gray-500 mb-3">
                  Creando 3 hitos principales para los próximos 12 meses
                </p>
                <LoadingSpinner size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Tu Plan 3.2.1</h2>
          <Target className="h-5 w-5 text-[#10B981]" />
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progreso General</div>
          <div className="text-lg font-bold text-[#10B981]">{totalProgress}%</div>
        </div>
      </div>

      {dineroDisponibleMensual > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Capacidad mensual: {formatCurrency(dineroDisponibleMensual)}
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <Card 
            key={milestone.id} 
            className={`
              border-2 transition-all duration-200
              ${milestone.priority === 'high' ? 'border-red-200 bg-red-50' : 
                milestone.priority === 'medium' ? 'border-blue-200 bg-blue-50' : 
                'border-green-200 bg-green-50'}
            `}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${milestone.priority === 'high' ? 'bg-red-100' : 
                      milestone.priority === 'medium' ? 'bg-blue-100' : 
                      'bg-green-100'}
                  `}>
                    {milestone.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {index + 1}. {milestone.title}
                    </h3>
                    <p className="text-xs text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {formatCurrency(milestone.targetAmount)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {milestone.estimatedMonths} meses
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {formatCurrency(milestone.currentAmount)} de {formatCurrency(milestone.targetAmount)}
                  </span>
                  <span className={milestone.color}>
                    {milestone.progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`
                      h-2 rounded-full transition-all duration-500
                      ${milestone.priority === 'high' ? 'bg-red-500' : 
                        milestone.priority === 'medium' ? 'bg-blue-500' : 
                        'bg-green-500'}
                    `}
                    style={{ width: `${Math.min(milestone.progress, 100)}%` }}
                  />
                </div>
              </div>

              {milestone.priority === 'high' && hasDebtPriority && (
                <div className="mt-3 text-xs text-red-600 font-medium">
                  ⚡ Prioridad alta - Eliminar primero para ahorrar intereses
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {milestones.length === 0 && (
        <Card className="border-[#10B981]/20 bg-[#10B981]/5">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-[#10B981] mx-auto mb-3" />
            <p className="font-medium text-gray-900 mb-1">¡Perfecto inicio!</p>
            <p className="text-sm text-gray-600">
              Estamos preparando tu plan personalizado con los datos disponibles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
