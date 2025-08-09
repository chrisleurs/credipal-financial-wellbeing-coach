

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Step1Income from '@/components/onboarding/Step1Income'
import Step2Expenses from '@/components/onboarding/Step2Expenses'
import Step3Debts from '@/components/onboarding/Step3Debts'
import Step4Savings from '@/components/onboarding/Step4Savings'
import Step5Goals from '@/components/onboarding/Step5Goals'
import Step6Complete from '@/components/onboarding/Step6Complete'
import Step7Summary from '@/components/onboarding/Step7Summary'
import Step8Processing from '@/components/onboarding/Step8Processing'
import { useOnboardingStore } from '@/store/modules/onboardingStore'

const TOTAL_STEPS = 6

const stepTitles = [
  'Ingresos',
  'Gastos',
  'Deudas',
  'Ahorros',
  'Metas',
  'Completar'
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { currentStep, setCurrentStep, financialData, isOnboardingComplete } = useOnboardingStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOnboardingComplete) {
      navigate('/dashboard')
    }
  }, [isOnboardingComplete, navigate])

  useEffect(() => {
    if (currentStep > TOTAL_STEPS) {
      setCurrentStep(TOTAL_STEPS)
    }
  }, [currentStep, setCurrentStep])

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
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
        return <Step7Summary onNext={handleNext} onBack={handleBack} />
      case 8:
        return <Step8Processing onNext={handleNext} onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <div className="container h-screen flex items-center justify-center">
      <Card className="w-[90%] md:w-[600px] shadow-xl">
        <CardHeader>
          <CardTitle>Bienvenido a Credi</CardTitle>
          <CardDescription>
            {stepTitles[currentStep - 1]}: Completa los datos para personalizar tu plan financiero.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Progress value={(currentStep / TOTAL_STEPS) * 100} />
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  )
}

