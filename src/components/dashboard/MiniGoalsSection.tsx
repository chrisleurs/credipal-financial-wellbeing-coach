
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Target, Star } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const MiniGoalsSection = () => {
  // Placeholder mientras se implementa la lógica real
  const isGeneratingChallenges = true

  if (isGeneratingChallenges) {
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

  // Estructura final preparada
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Retos de la Semana</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Mini-goals se implementarán aquí */}
      </div>
    </div>
  )
}
