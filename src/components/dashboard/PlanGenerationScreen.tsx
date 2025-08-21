
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/helpers'
import { 
  Sparkles,
  TrendingUp, 
  Target, 
  DollarSign,
  CreditCard,
  PiggyBank,
  ArrowRight
} from 'lucide-react'

interface PlanGenerationScreenProps {
  consolidatedData: any
  isGenerating: boolean
  onGeneratePlan: () => void
}

export const PlanGenerationScreen = ({ 
  consolidatedData, 
  isGenerating, 
  onGeneratePlan 
}: PlanGenerationScreenProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header con CrediPal branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-primary">CrediPal</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Tu asistente financiero personal
          </p>
          <p className="text-lg text-muted-foreground">
            Analiza tu información y crea un plan financiero personalizado
          </p>
        </div>

        {/* Resumen de datos del onboarding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tu Perfil Financiero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(consolidatedData?.monthlyIncome || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <CreditCard className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(consolidatedData?.monthlyExpenses || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Gastos Mensuales</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <PiggyBank className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(consolidatedData?.currentSavings || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Ahorros Actuales</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(consolidatedData?.savingsCapacity || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Capacidad de Ahorro</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qué incluye el plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              ¿Qué incluye tu plan CrediPal?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Objetivos Financieros Personalizados</h3>
                    <p className="text-sm text-muted-foreground">
                      Metas específicas basadas en tu situación actual
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Calendario de Pagos</h3>
                    <p className="text-sm text-muted-foreground">
                      Próximos pagos y vencimientos importantes
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Metas a Corto Plazo</h3>
                    <p className="text-sm text-muted-foreground">
                      Hitos alcanzables para mantener tu motivación
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Recomendaciones Inteligentes</h3>
                    <p className="text-sm text-muted-foreground">
                      Consejos personalizados para mejorar tus finanzas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de generar plan */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Listo para crear tu plan!</h2>
              <p className="text-muted-foreground">
                CrediPal analizará tu información y creará un plan financiero personalizado en segundos
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={onGeneratePlan}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  CrediPal está creando tu plan...
                </>
              ) : (
                <>
                  Generar Mi Plan Financiero
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
