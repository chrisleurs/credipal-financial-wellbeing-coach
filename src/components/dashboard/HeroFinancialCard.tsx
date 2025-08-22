
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ArrowRight, Sparkles, TrendingUp, AlertCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useFinancialSnapshot } from '@/hooks/useFinancialSnapshot'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/utils/helpers'

export const HeroFinancialCard = () => {
  const { user } = useAuth()
  const { snapshot, isLoading } = useFinancialSnapshot()
  
  // Si está cargando, mostrar estado de loading
  if (isLoading || !snapshot) {
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

  const firstName = user?.user_metadata?.first_name || 'Usuario'
  const { dineroDisponible, porcentajeHaciaMeta, mensajeMotivador, necesitaOptimizacion } = snapshot

  // Determinar color del gradiente basado en la situación financiera
  const getGradientColors = () => {
    if (dineroDisponible < 0) return "from-[#F59E0B] to-[#D97706]" // Naranja para alerta
    if (dineroDisponible < 200) return "from-[#0891B2] to-[#0E7490]" // Azul para precaución
    return "from-[#10B981] to-[#059669]" // Verde para buena situación
  }

  return (
    <Card className={`bg-gradient-to-br ${getGradientColors()} text-white border-0 shadow-lg relative overflow-hidden`}>
      <CardContent className="p-6">
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Wallet className="h-4 w-4" />
            En Mi Bolsillo
          </div>
          
          <div className="mb-4">
            <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-2">
              {necesitaOptimizacion && <AlertCircle className="h-6 w-6 text-white/80" />}
              {formatCurrency(Math.abs(dineroDisponible))}
            </div>
            <p className="text-white/80 text-sm mb-2">
              {dineroDisponible >= 0 ? "Disponible hasta tu próximo ingreso" : "Oportunidad de optimización"}
            </p>
            
            {/* Progress ring visual - solo mostrar si hay progreso hacia meta */}
            {porcentajeHaciaMeta > 0 && (
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray={`${porcentajeHaciaMeta}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-sm text-white/90">
                  {Math.round(porcentajeHaciaMeta)}% hacia tu meta
                </span>
              </div>
            )}
          </div>

          {/* Mensaje motivador */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
            <p className="text-sm font-medium">
              ¡Hola {firstName}! {mensajeMotivador}
            </p>
          </div>

          <Button 
            variant="secondary" 
            size="sm"
            className="bg-white text-current hover:bg-white/90 font-semibold transition-colors"
          >
            Ver Mi Plan Completo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </CardContent>
    </Card>
  )
}
