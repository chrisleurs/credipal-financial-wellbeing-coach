
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ArrowRight, Sparkles } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const HeroFinancialCard = () => {
  // Placeholder mientras se implementa la lógica real
  const isCalculating = true
  
  if (isCalculating) {
    return (
      <Card className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Calculando tu plan financiero
            </div>
            
            <LoadingSpinner size="lg" className="mb-4" />
            
            <p className="text-white/90 text-sm mb-4">
              Estamos analizando tu información para crear tu plan personalizado...
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm">Progreso del análisis</span>
                <span className="text-white font-semibold">75%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white text-[#10B981] hover:bg-white/90 font-semibold"
              disabled
            >
              Tu Plan se está Creando
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Esta será la estructura final una vez implementada la lógica
  return (
    <Card className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-3">
            <Wallet className="h-4 w-4" />
            En Mi Bolsillo
          </div>
          <div className="text-3xl font-bold mb-1">$2,450</div>
          <p className="text-white/80 text-sm">Disponible hasta tu próximo ingreso</p>
        </div>
      </CardContent>
    </Card>
  )
}
