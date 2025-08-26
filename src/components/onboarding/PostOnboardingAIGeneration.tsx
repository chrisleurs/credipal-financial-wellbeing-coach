
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Brain, CheckCircle, Loader2, Sparkles, TrendingUp, Target } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface PostOnboardingAIGenerationProps {
  consolidatedData: any
  onPlanGenerated: (plan: any) => void
}

const generationSteps = [
  {
    id: 1,
    title: "Analizando tu situación financiera",
    description: "Procesando ingresos, gastos y deudas",
    icon: Brain,
    duration: 3000
  },
  {
    id: 2,
    title: "Generando recomendaciones personalizadas",
    description: "CrediPal está creando estrategias específicas para ti",
    icon: Sparkles,
    duration: 4000
  },
  {
    id: 3,
    title: "Optimizando tu plan financiero",
    description: "Definiendo metas alcanzables y timeline realista",
    icon: TrendingUp,
    duration: 3000
  },
  {
    id: 4,
    title: "Finalizando tu plan personalizado",
    description: "Tu roadmap hacia la libertad financiera está listo",
    icon: Target,
    duration: 2000
  }
]

export const PostOnboardingAIGeneration: React.FC<PostOnboardingAIGenerationProps> = ({
  consolidatedData,
  onPlanGenerated
}) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateAIPlan()
  }, [])

  const generateAIPlan = async () => {
    if (!user?.id || !consolidatedData) {
      setError('Información insuficiente para generar el plan')
      return
    }

    try {
      // Simular progreso a través de los pasos
      for (let i = 0; i < generationSteps.length; i++) {
        setCurrentStep(i)
        
        // Simular progreso gradual para cada paso
        const step = generationSteps[i]
        const stepProgress = (i / generationSteps.length) * 100
        
        for (let j = 0; j <= 100; j += 10) {
          const totalProgress = stepProgress + (j / generationSteps.length)
          setProgress(Math.min(totalProgress, 95))
          await new Promise(resolve => setTimeout(resolve, step.duration / 10))
        }
      }

      // Llamar a la función OpenAI
      const { data: aiPlan, error: functionError } = await supabase.functions.invoke(
        'generate-financial-plan',
        {
          body: {
            financialData: {
              name: user.email?.split('@')[0] || 'Usuario',
              monthlyIncome: consolidatedData.monthlyIncome || 0,
              monthlyExpenses: consolidatedData.monthlyExpenses || 0,
              extraIncome: consolidatedData.extraIncome || 0,
              currentSavings: consolidatedData.currentSavings || 0,
              savingsGoal: consolidatedData.savingsGoal || 0,
              debts: consolidatedData.debts || [],
              goals: consolidatedData.goals || [],
              expenseCategories: consolidatedData.expenseCategories || {},
              monthlyBalance: consolidatedData.savingsCapacity || 0,
              dataCompleteness: consolidatedData.hasRealData ? 85 : 50
            }
          }
        }
      )

      if (functionError) {
        throw new Error(functionError.message)
      }

      // Guardar el plan en la base de datos
      const { data: savedPlan, error: saveError } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          plan_type: 'openai-enhanced',
          plan_data: {
            ...aiPlan,
            consolidatedData,
            generatedAt: new Date().toISOString(),
            version: '1.0'
          },
          status: 'active'
        })
        .select()
        .single()

      if (saveError) {
        throw new Error(saveError.message)
      }

      setProgress(100)
      setIsComplete(true)
      
      // Pequeña pausa para mostrar la completitud
      setTimeout(() => {
        onPlanGenerated(savedPlan)
      }, 1500)

    } catch (error) {
      console.error('Error generando plan con IA:', error)
      setError('Hubo un problema generando tu plan. Intenta nuevamente.')
      
      toast({
        title: "Error generando plan",
        description: "No se pudo crear tu plan financiero. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error en la Generación</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Intentar Nuevamente
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isComplete ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <Brain className="w-10 h-10 text-emerald-600 animate-pulse" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isComplete ? '¡Tu plan está listo!' : 'CrediPal está creando tu plan financiero'}
          </CardTitle>
          <p className="text-gray-600">
            {isComplete 
              ? 'Tu roadmap personalizado hacia la libertad financiera'
              : 'Analizando tu información para crear el mejor plan para ti'
            }
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Barra de progreso principal */}
          <div className="mb-8">
            <Progress value={progress} className="h-3 mb-2" />
            <p className="text-center text-sm text-gray-600">
              {Math.round(progress)}% completado
            </p>
          </div>

          {/* Pasos de generación */}
          <div className="space-y-4">
            {generationSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === index && !isComplete
              const isCompleted = currentStep > index || isComplete
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-emerald-50 border-2 border-emerald-200' 
                      : isCompleted 
                        ? 'bg-green-50 border-2 border-green-200' 
                        : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div className={`p-3 rounded-full ${
                    isActive 
                      ? 'bg-emerald-100' 
                      : isCompleted 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                  }`}>
                    {isActive ? (
                      <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isActive 
                        ? 'text-emerald-800' 
                        : isCompleted 
                          ? 'text-green-800' 
                          : 'text-gray-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      isActive 
                        ? 'text-emerald-700' 
                        : isCompleted 
                          ? 'text-green-700' 
                          : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {isComplete && (
            <div className="mt-8 text-center">
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">
                  ¡Perfecto! Tu plan financiero personalizado está listo
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Serás redirigido al dashboard en unos segundos...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
