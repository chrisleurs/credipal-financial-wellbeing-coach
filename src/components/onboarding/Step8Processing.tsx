
import React, { useEffect, useState } from 'react'
import { Brain, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useOnboardingStore } from '@/store/modules/onboardingStore'
import { useFinancialStore } from '@/store/financialStore'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

interface Step8ProcessingProps {
  onNext: () => void
  onBack: () => void
}

const Step8Processing: React.FC<Step8ProcessingProps> = ({ onNext, onBack }) => {
  const { financialData, completeOnboarding } = useOnboardingStore()
  const { generateAIPlan, generateActionPlan, isLoading, error } = useFinancialStore()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    {
      title: "Analizando tu información financiera",
      description: "Procesando ingresos, gastos y deudas",
      icon: Brain
    },
    {
      title: "Generando recomendaciones personalizadas",
      description: "Creando estrategias basadas en tu situación",
      icon: Sparkles
    },
    {
      title: "Preparando tu plan de acción",
      description: "Definiendo tareas y objetivos específicos",
      icon: CheckCircle
    }
  ]

  useEffect(() => {
    const generatePlans = async () => {
      try {
        console.log('🤖 Starting AI plan generation...')
        setCurrentStep(0)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        console.log('📊 Generating AI plan...')
        setCurrentStep(1)
        await generateAIPlan(financialData)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('📝 Generating action plan...')
        setCurrentStep(2)
        await generateActionPlan()
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('✅ Completing onboarding...')
        await completeOnboarding()
        await updateOnboardingStatus(true)
        
        setIsComplete(true)
        setTimeout(() => {
          console.log('🎯 Redirecting to dashboard...')
          onNext()
        }, 1500)
      } catch (error) {
        console.error('❌ Error generating plans:', error)
      }
    }

    generatePlans()
  }, [generateAIPlan, generateActionPlan, completeOnboarding, updateOnboardingStatus, onNext, financialData])

  const canProceed = false // No se puede proceder manualmente

  return (
    <OnboardingStep
      currentStep={7}
      totalSteps={9}
      title="Generando tu plan financiero personalizado"
      subtitle="Estamos creando un plan único para ti usando inteligencia artificial"
      onNext={onNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText="Procesando..."
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-8 rounded-full">
              <Brain className="h-16 w-16 text-emerald-600" />
            </div>
            {(isLoading || !isComplete) && (
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === index
            const isCompleted = currentStep > index || isComplete
            
            return (
              <div 
                key={index}
                className={`bg-white border-2 rounded-xl p-4 transition-all ${
                  isActive 
                    ? 'border-emerald-300 bg-emerald-50' 
                    : isCompleted 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    isActive 
                      ? 'bg-emerald-100' 
                      : isCompleted 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                  }`}>
                    {isActive && !isComplete ? (
                      <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Icon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${
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
              </div>
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <p className="text-red-800 text-center">
              Hubo un error generando tu plan. Por favor, inténtalo nuevamente.
            </p>
          </div>
        )}

        {isComplete && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                ¡Tu plan financiero está listo!
              </p>
            </div>
            <p className="text-green-700 text-sm text-center mt-2">
              Redirigiendo al dashboard...
            </p>
          </div>
        )}
      </div>
    </OnboardingStep>
  )
}

export default Step8Processing
