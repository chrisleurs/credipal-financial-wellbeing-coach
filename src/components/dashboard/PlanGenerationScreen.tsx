
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { FinancialSummary } from './FinancialSummary'
import { 
  Sparkles,
  ArrowRight,
  Target,
  TrendingUp,
  Shield,
  Zap
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">CrediPal</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Tu asistente financiero personal</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analiza tu información financiera y crea un plan personalizado para alcanzar tus objetivos
        </p>
      </div>

      {/* Financial Summary */}
      {consolidatedData && <FinancialSummary consolidatedData={consolidatedData} />}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Objetivos Personalizados</h3>
            <p className="text-sm text-muted-foreground">
              Metas específicas basadas en tu situación financiera actual
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Seguimiento Inteligente</h3>
            <p className="text-sm text-muted-foreground">
              Monitoreo automático de tu progreso y recomendaciones dinámicas
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Seguro y Privado</h3>
            <p className="text-sm text-muted-foreground">
              Tu información está protegida con los más altos estándares de seguridad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">¿Qué incluye tu plan CrediPal?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Objetivos Inteligentes</h4>
                  <p className="text-sm text-muted-foreground">
                    Fondo de emergencia, reducción de deudas y metas de ahorro
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Plan de Acción</h4>
                  <p className="text-sm text-muted-foreground">
                    Pasos específicos y fechas para alcanzar tus metas
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Recomendaciones</h4>
                  <p className="text-sm text-muted-foreground">
                    Consejos personalizados para optimizar tus finanzas
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Seguimiento</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitoreo continuo y ajustes automáticos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">¡Listo para comenzar!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              CrediPal analizará tu información y creará tu plan financiero personalizado
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
  )
}
