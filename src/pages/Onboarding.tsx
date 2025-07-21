import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinancialStore } from '@/store/financialStore'
import Step1Income from '@/components/onboarding/Step1Income'
import Step2Expenses from '@/components/onboarding/Step2Expenses'
import Step3Debts from '@/components/onboarding/Step3Debts'
import Step4Savings from '@/components/onboarding/Step4Savings'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { currentStep, setCurrentStep } = useFinancialStore()

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1)
    } else {
      // Completar onboarding y ir al plan
      navigate('/plan')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/auth')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Income onNext={handleNext} onBack={handleBack} />
      case 1:
        return <Step2Expenses onNext={handleNext} onBack={handleBack} />
      case 2:
        return <Step3Debts onNext={handleNext} onBack={handleBack} />
      case 3:
        return <Step4Savings onNext={handleNext} onBack={handleBack} />
      default:
        return <LoadingSpinner />
    }
  }

  return <div>{renderStep()}</div>
}

export default Onboarding;