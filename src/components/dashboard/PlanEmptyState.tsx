import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Plus, RefreshCw } from 'lucide-react'

interface PlanEmptyStateProps {
  onGeneratePlan: () => void
  isGenerating?: boolean
  hasCompleteData: boolean
}

export const PlanEmptyState: React.FC<PlanEmptyStateProps> = ({
  onGeneratePlan,
  isGenerating = false,
  hasCompleteData
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg">
            {hasCompleteData ? 'Generar Plan Financiero' : 'Datos Incompletos'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {hasCompleteData ? (
            <>
              <p className="text-sm text-muted-foreground">
                ¡Perfecto! Tienes suficientes datos para generar tu plan financiero personalizado con IA.
              </p>
              
              <Button 
                onClick={onGeneratePlan}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generando plan con IA...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Generar Mi Plan
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Necesitas completar tu información financiera para generar un plan personalizado.
              </p>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Asegúrate de tener:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ingresos mensuales</li>
                  <li>Gastos principales</li>
                  <li>Deudas (si las tienes)</li>
                  <li>Objetivos financieros</li>
                </ul>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/onboarding'}
                variant="outline"
                className="w-full"
              >
                Completar Información
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
