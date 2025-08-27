
import React, { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Brain, CheckCircle2, Loader2 } from 'lucide-react'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import type { PlanGenerationData } from '@/types/financialPlan'

interface PlanGenerationFlowProps {
  planData: PlanGenerationData
  onPlanGenerated: () => void
}

export const PlanGenerationFlow: React.FC<PlanGenerationFlowProps> = ({
  planData,
  onPlanGenerated
}) => {
  const { generatePlan, isGenerating } = useFinancialPlanManager()
  const [progress, setProgress] = React.useState(0)
  const [currentStep, setCurrentStep] = React.useState(0)

  const steps = [
    { title: 'Analizando tu situación financiera', duration: 2000 },
    { title: 'Generando estrategias personalizadas', duration: 3000 },
    { title: 'Creando tu plan de acción', duration: 2000 },
    { title: 'Finalizando tu plan financiero', duration: 1000 }
  ]

  useEffect(() => {
    const generatePlanWithProgress = async () => {
      try {
        // Simular progreso visual mientras se genera
        let totalProgress = 0
        const progressInterval = setInterval(() => {
          totalProgress += 2
          setProgress(Math.min(totalProgress, 90))
          
          if (totalProgress >= 90) {
            clearInterval(progressInterval)
          }
        }, 100)

        // Animar pasos
        steps.forEach((_, index) => {
          setTimeout(() => {
            setCurrentStep(index)
          }, steps.slice(0, index).reduce((acc, step) => acc + step.duration, 0))
        })

        // Generar plan real
        await generatePlan(planData)
        
        // Completar progreso
        setProgress(100)
        setTimeout(() => {
          onPlanGenerated()
        }, 1000)
        
      } catch (error) {
        console.error('Error generating plan:', error)
        // En caso de error, aún completamos el flujo
        setTimeout(() => {
          onPlanGenerated()
        }, 2000)
      }
    }

    generatePlanWithProgress()
  }, [planData, generatePlan, onPlanGenerated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Creando tu plan financiero
          </h1>
          <p className="text-gray-600">
            CrediPal está diseñando tu estrategia personalizada
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress 
            value={progress} 
            className="h-3 bg-white/50 shadow-inner"
          />
          <div className="text-center mt-2">
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% completado
            </span>
          </div>
        </div>

        {/* Steps */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    index < currentStep 
                      ? 'bg-green-50 border border-green-200' 
                      : index === currentStep
                        ? 'bg-primary/5 border border-primary/20'
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    index < currentStep 
                      ? 'text-green-800' 
                      : index === currentStep
                        ? 'text-primary'
                        : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
