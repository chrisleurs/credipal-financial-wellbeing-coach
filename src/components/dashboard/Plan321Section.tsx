
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Target, MapPin, Trophy, Sparkles } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const Plan321Section = () => {
  // Placeholder mientras se implementa la lógica real
  const isPreparingRoadmap = true

  if (isPreparingRoadmap) {
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

  // Estructura final preparada
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-gray-900">Tu Plan 3.2.1</h2>
        <Target className="h-5 w-5 text-[#10B981]" />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {/* Hitos del plan se implementarán aquí */}
      </div>
    </div>
  )
}
