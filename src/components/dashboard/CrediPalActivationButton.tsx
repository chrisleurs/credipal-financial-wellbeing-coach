
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { CrediPalPlanGenerator } from '@/services/crediPalPlanGenerator'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface CrediPalActivationButtonProps {
  onPlanActivated: () => void
}

export const CrediPalActivationButton: React.FC<CrediPalActivationButtonProps> = ({ onPlanActivated }) => {
  const [isActivating, setIsActivating] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const { consolidatedData } = useConsolidatedFinancialData()
  const { user } = useAuth()
  const { toast } = useToast()

  const activateCrediPal = async () => {
    if (!user?.id || !consolidatedData) {
      toast({
        title: "Error",
        description: "No se pudo activar CrediPal. Datos insuficientes.",
        variant: "destructive"
      })
      return
    }

    setIsActivating(true)

    try {
      // Generar el plan completo usando la metodología 3.2.1
      const completePlan = CrediPalPlanGenerator.generateCompletePlan(consolidatedData)
      completePlan.userId = user.id

      // Guardar en la base de datos
      const { error } = await supabase
        .from('financial_plans')
        .upsert({
          user_id: user.id,
          plan_type: 'credipal-complete',
          plan_data: completePlan as any,
          status: 'active'
        })

      if (error) throw error

      setIsActivated(true)
      
      toast({
        title: "¡CrediPal Activado! 🎉",
        description: "Tu coach financiero personal está listo. ¡Comencemos tu transformación!",
      })

      // Pequeña pausa para la celebración
      setTimeout(() => {
        onPlanActivated()
      }, 2000)

    } catch (error) {
      console.error('Error activating CrediPal:', error)
      toast({
        title: "Error",
        description: "No se pudo activar CrediPal. Intenta de nuevo.",
        variant: "destructive"
      })
    } finally {
      setIsActivating(false)
    }
  }

  if (!consolidatedData) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Datos Insuficientes</h3>
          <p className="text-muted-foreground mb-4">
            Necesitas completar tu información financiera antes de activar CrediPal
          </p>
          <Badge variant="outline" className="text-amber-700 border-amber-300">
            Completa tu onboarding primero
          </Badge>
        </CardContent>
      </Card>
    )
  }

  if (isActivated) {
    return (
      <Card className="border-green-200 bg-green-50/50 animate-pulse">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-2 text-green-800">¡CrediPal Activado!</h3>
          <p className="text-green-700 mb-4">
            Tu coach financiero está preparando tu plan personalizado...
          </p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600 animate-spin" />
            <span className="text-sm text-green-600">Cargando tu nueva experiencia</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Activa tu CrediPal</CardTitle>
            <p className="text-muted-foreground">Tu coach financiero personal te está esperando</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-primary/10">
              <Target className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Plan 3.2.1</p>
                <p className="text-xs text-muted-foreground">Metodología probada</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-primary/10">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-sm">Fondo Emergencia</p>
                <p className="text-xs text-muted-foreground">6 meses protegido</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-primary/10">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Crecimiento</p>
                <p className="text-xs text-muted-foreground">Inversión a futuro</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 rounded-xl p-4 border border-primary/10">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Lo que CrediPal hará por ti:
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Crear tu plan financiero personalizado siguiendo la metodología 3.2.1</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Generar mini-metas motivacionales al estilo Duolingo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Activar recordatorios inteligentes para evitar intereses</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Comenzar tu tracker de progreso trimestral</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Enviarte mensajes motivacionales personalizados</span>
              </li>
            </ul>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Basado en tu información financiera actual
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Ingresos mensuales:</span>
              <p className="font-semibold">${consolidatedData.monthlyIncome.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Capacidad de ahorro:</span>
              <p className="font-semibold">${consolidatedData.savingsCapacity.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={activateCrediPal}
          disabled={isActivating}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isActivating ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Activando CrediPal...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Activar Mi Coach Financiero
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          CrediPal analizará tu situación y creará un plan personalizado en segundos
        </p>
      </CardContent>
    </Card>
  )
}
