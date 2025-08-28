
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useImprovedOnboardingCompletion } from '@/hooks/useImprovedOnboardingCompletion'
import { CheckCircle, ArrowRight } from 'lucide-react'

interface ImprovedOnboardingCompletionProps {
  onComplete: () => void
}

export const ImprovedOnboardingCompletion: React.FC<ImprovedOnboardingCompletionProps> = ({
  onComplete
}) => {
  const { completeOnboardingWithMigration, isCompleting } = useImprovedOnboardingCompletion()

  const handleComplete = async () => {
    const success = await completeOnboardingWithMigration()
    if (success) {
      // Retrasar un poco para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        onComplete()
        // Recargar la página para mostrar los datos migrados
        window.location.reload()
      }, 1500)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-xl">¡Casi terminamos!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Hemos recopilado toda tu información financiera. 
          Al finalizar, migraremos tus datos y calcularemos tu resumen financiero personalizado.
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Ingresos registrados</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Gastos categorizados</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Deudas registradas</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Metas definidas</span>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isCompleting}
          className="w-full"
          size="lg"
        >
          {isCompleting ? (
            'Procesando datos...'
          ) : (
            <>
              Finalizar y ver mi dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        
        {isCompleting && (
          <p className="text-xs text-center text-muted-foreground">
            Esto puede tomar unos segundos mientras procesamos tu información...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
