
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CrediPalActivationButton } from './CrediPalActivationButton'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AlertTriangle, Sparkles, TrendingUp, Target } from 'lucide-react'

interface PlanGenerationScreenProps {
  consolidatedData: any
  isGenerating: boolean
  onGeneratePlan: () => void
}

export const PlanGenerationScreen: React.FC<PlanGenerationScreenProps> = ({ 
  consolidatedData, 
  isGenerating, 
  onGeneratePlan 
}) => {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="CrediPal está creando tu plan personalizado..." />
      </div>
    )
  }

  if (!consolidatedData || !consolidatedData.hasRealData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <div>
                <CardTitle className="text-xl">Información Incompleta</CardTitle>
                <p className="text-muted-foreground">
                  CrediPal necesita tu información financiera para crear el mejor plan
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-amber-800">
                Para activar tu coach financiero personal, completa tu perfil con:
              </p>
              <ul className="list-disc list-inside space-y-2 text-amber-700">
                <li>Tus fuentes de ingresos mensuales</li>
                <li>Tus gastos principales por categoría</li>
                <li>Información sobre tus deudas actuales</li>
                <li>Tus metas de ahorro (opcional)</li>
              </ul>
              <div className="pt-4 border-t border-amber-200">
                <p className="text-sm text-amber-600">
                  💡 Consejo: Mientras más precisa sea tu información, mejor será tu plan personalizado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header inspiracional */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Tu información está lista
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Es hora de activar tu <span className="text-primary">CrediPal</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tu coach financiero personal está listo para crear un plan que transformará tu vida financiera
        </p>
      </div>

      {/* Preview de lo que se activará */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Plan 3.2.1</h3>
            <p className="text-sm text-muted-foreground">
              Metodología probada: eliminar deudas, crear fondo de emergencia, comenzar a invertir
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Seguimiento Inteligente</h3>
            <p className="text-sm text-muted-foreground">
              Mini-metas motivacionales y tracker de progreso trimestral automático
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Coach Personal</h3>
            <p className="text-sm text-muted-foreground">
              Mensajes motivacionales y recordatorios inteligentes para mantenerte en camino
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botón principal de activación */}
      <CrediPalActivationButton onPlanActivated={onGeneratePlan} />

      {/* Snapshot preview */}
      <Card className="bg-gradient-to-r from-muted/30 to-muted/10">
        <CardHeader>
          <CardTitle>Vista Previa de tu Situación</CardTitle>
          <p className="text-muted-foreground">
            Esto es lo que CrediPal usará para generar tu plan personalizado
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${consolidatedData.monthlyIncome.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                ${consolidatedData.monthlyExpenses.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Gastos Mensuales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                ${consolidatedData.totalDebtBalance.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Deuda Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ${consolidatedData.savingsCapacity.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Capacidad Mensual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
