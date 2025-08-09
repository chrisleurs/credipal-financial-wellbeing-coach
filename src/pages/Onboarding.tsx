
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import OnboardingWelcome from '@/components/onboarding/OnboardingWelcome'
import Step1Income from '@/components/onboarding/Step1Income'
import Step2Expenses from '@/components/onboarding/Step2Expenses'
import Step3Debts from '@/components/onboarding/Step3Debts'
import Step4Savings from '@/components/onboarding/Step4Savings'
import Step5Goals from '@/components/onboarding/Step5Goals'
import Step6Complete from '@/components/onboarding/Step6Complete'
import Step7Summary from '@/components/onboarding/Step7Summary'
import Step8Processing from '@/components/onboarding/Step8Processing'
import { useOnboardingStore } from '@/store/modules/onboardingStore'
import { useOnboardingDataConsolidation } from '@/hooks/useOnboardingDataConsolidation'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'

const TOTAL_STEPS = 6

const stepTitles = [
  'Bienvenida',
  'Ingresos',
  'Gastos',
  'Deudas',
  'Ahorros',
  'Metas',
  'Completar'
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { 
    currentStep, 
    setCurrentStep, 
    isOnboardingComplete,
    loadOnboardingProgress,
    saveOnboardingProgress,
    resetOnboardingData 
  } = useOnboardingStore()
  
  const { consolidateOnboardingData } = useOnboardingDataConsolidation()
  const [isInitializing, setIsInitializing] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize onboarding data when component mounts
  useEffect(() => {
    const initializeOnboarding = async () => {
      if (!user) return
      
      try {
        console.log('🚀 Initializing onboarding for user:', user.id)
        await loadOnboardingProgress()
        
        // Reset if we're starting fresh and set to welcome step
        if (currentStep === 0) {
          resetOnboardingData()
          setCurrentStep(0) // Start with welcome screen (step 0)
        }
        
        setIsInitializing(false)
      } catch (error) {
        console.error('❌ Error initializing onboarding:', error)
        setIsInitializing(false)
      }
    }

    initializeOnboarding()
  }, [user, loadOnboardingProgress, currentStep, resetOnboardingData, setCurrentStep])

  // Redirect if onboarding is complete
  useEffect(() => {
    if (isOnboardingComplete && !isProcessing) {
      console.log('✅ Onboarding complete, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isOnboardingComplete, navigate, isProcessing])

  // Ensure current step is within bounds
  useEffect(() => {
    if (currentStep > TOTAL_STEPS && currentStep < 7) {
      console.log('📝 Adjusting step from', currentStep, 'to', TOTAL_STEPS)
      setCurrentStep(TOTAL_STEPS)
    }
    if (currentStep < 0 && !isInitializing && !isOnboardingComplete) {
      console.log('📝 Setting initial step to 0 (welcome)')
      setCurrentStep(0)
    }
  }, [currentStep, setCurrentStep, isInitializing, isOnboardingComplete])

  const handleNext = async () => {
    console.log('➡️ Moving to next step from:', currentStep)
    
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      await saveOnboardingProgress()
      console.log('✅ Moved to step:', nextStep)
    } else if (currentStep === TOTAL_STEPS) {
      // Complete onboarding
      setIsProcessing(true)
      setCurrentStep(7) // Summary step
      await saveOnboardingProgress()
    }
  }

  const handleBack = async () => {
    console.log('⬅️ Moving to previous step from:', currentStep)
    
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      await saveOnboardingProgress()
      console.log('✅ Moved to step:', prevStep)
    }
  }

  const handleComplete = async () => {
    console.log('🎉 Starting completion process')
    setIsProcessing(true)
    
    try {
      // Consolidate all onboarding data
      const success = await consolidateOnboardingData()
      
      if (success) {
        setCurrentStep(8) // Processing step
        console.log('✅ Data consolidated, showing processing step')
      } else {
        console.error('❌ Failed to consolidate data')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('❌ Error completing onboarding:', error)
      setIsProcessing(false)
    }
  }

  const handleProcessingComplete = () => {
    console.log('🎯 Processing complete, redirecting to dashboard')
    navigate('/dashboard', { replace: true })
  }

  const renderStepContent = () => {
    if (isInitializing) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Cargando tu progreso...</p>
        </div>
      )
    }

    switch (currentStep) {
      case 0:
        return <OnboardingWelcome onNext={handleNext} onBack={handleBack} />
      case 1:
        return <Step1Income onNext={handleNext} onBack={handleBack} />
      case 2:
        return <Step2Expenses onNext={handleNext} onBack={handleBack} />
      case 3:
        return <Step3Debts onNext={handleNext} onBack={handleBack} />
      case 4:
        return <Step4Savings onNext={handleNext} onBack={handleBack} />
      case 5:
        return <Step5Goals onNext={handleNext} onBack={handleBack} />
      case 6:
        return <Step6Complete onBack={handleBack} />
      case 7:
        return <Step7Summary onNext={handleComplete} onBack={handleBack} />
      case 8:
        return <Step8Processing onNext={handleProcessingComplete} onBack={handleBack} />
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Paso no encontrado</p>
          </div>
        )
    }
  }

  const getProgressValue = () => {
    if (currentStep <= TOTAL_STEPS) {
      return (currentStep / TOTAL_STEPS) * 100
    }
    return 100
  }

  const getCurrentStepTitle = () => {
    if (currentStep <= stepTitles.length - 1) {
      return stepTitles[currentStep]
    }
    if (currentStep === 7) return 'Resumen'
    if (currentStep === 8) return 'Procesando'
    return 'Completar'
  }

  // For welcome step (step 0), render full-screen component
  if (currentStep === 0 && !isInitializing) {
    return renderStepContent()
  }

  if (isInitializing) {
    return (
      <div className="container h-screen flex items-center justify-center">
        <Card className="w-[90%] md:w-[600px] shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Inicializando onboarding...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container h-screen flex items-center justify-center">
      <Card className="w-[90%] md:w-[600px] shadow-xl">
        <CardHeader>
          <CardTitle>Bienvenido a Credipal</CardTitle>
          <CardDescription>
            {getCurrentStepTitle()}: Completa los datos para personalizar tu plan financiero.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Paso {Math.min(currentStep, TOTAL_STEPS)} de {TOTAL_STEPS}</span>
              <span>{Math.round(getProgressValue())}% completado</span>
            </div>
            <Progress value={getProgressValue()} />
          </div>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  )
}
