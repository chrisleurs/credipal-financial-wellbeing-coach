
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinancialStore } from '@/store/financialStore'
import { useAuth } from '@/hooks/useAuth'
import Step1Income from '@/components/onboarding/Step1Income'
import Step2Expenses from '@/components/onboarding/Step2Expenses'
import Step3Debts from '@/components/onboarding/Step3Debts'
import Step4Savings from '@/components/onboarding/Step4Savings'
import Step5Goals from '@/components/onboarding/Step5Goals'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentStep, setCurrentStep, loadOnboardingProgress, reset } = useFinancialStore()
  const [isLoadingProgress, setIsLoadingProgress] = useState(true)
  const [hasExistingProgress, setHasExistingProgress] = useState(false)

  // Scroll to top on component mount and step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [currentStep])

  useEffect(() => {
    const initializeOnboarding = async () => {
      if (!user) return

      try {
        console.log('Initializing onboarding for user:', user.id)
        
        // Load existing progress
        await loadOnboardingProgress()
        
        // Check if there's existing progress (step > 0)
        const store = useFinancialStore.getState()
        if (store.currentStep > 0) {
          setHasExistingProgress(true)
          console.log('Found existing progress at step:', store.currentStep)
        }
      } catch (error) {
        console.error('Error initializing onboarding:', error)
      } finally {
        setIsLoadingProgress(false)
      }
    }

    initializeOnboarding()
  }, [user, loadOnboardingProgress])

  const handleNext = () => {
    console.log('handleNext called, currentStep:', currentStep)
    // New flow: Income (0) → Expenses (1) → Debts (2) → Savings (3) → Goals (4) → Dashboard
    if (currentStep === 0) {
      setCurrentStep(1) // Go to expenses
    } else if (currentStep === 1) {
      setCurrentStep(2) // Go to debts
    } else if (currentStep === 2) {
      setCurrentStep(3) // Go to savings
    } else if (currentStep === 3) {
      setCurrentStep(4) // Go to goals
    } else {
      console.log('Last step reached, navigating to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }

  const handleBack = () => {
    console.log('handleBack called, currentStep:', currentStep)
    // Handle back navigation
    if (currentStep === 1) {
      setCurrentStep(0) // Go back to income from expenses
    } else if (currentStep === 2) {
      setCurrentStep(1) // Go back to expenses from debts
    } else if (currentStep === 3) {
      setCurrentStep(2) // Go back to debts from savings
    } else if (currentStep === 4) {
      setCurrentStep(3) // Go back to savings from goals
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/auth')
    }
  }

  const handleStartOver = () => {
    console.log('Starting onboarding from beginning')
    reset()
    setHasExistingProgress(false)
  }

  const handleContinue = () => {
    console.log('Continuing from saved progress')
    setHasExistingProgress(false)
  }

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <LoadingSpinner size="lg" text="Loading your progress..." />
      </div>
    )
  }

  // Show continuation prompt if there's existing progress
  if (hasExistingProgress) {
    // Convert internal step to display step for user
    const getDisplayStep = (internalStep: number) => {
      return internalStep + 1 // Simple 1-based indexing now
    }
    
    const displayStep = getDisplayStep(currentStep)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Let's pick up where you left off!
            </h1>
            <p className="text-gray-600">
              We found that you had progressed to step {displayStep} of 5. 
              Would you like to continue from there or start over?
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl"
            >
              Continue from step {displayStep}
            </Button>
            
            <Button 
              onClick={handleStartOver}
              variant="outline"
              className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl"
            >
              Start fresh
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    console.log('Rendering step:', currentStep)
    switch (currentStep) {
      case 0:
        return <Step1Income onNext={handleNext} onBack={handleBack} />
      case 1:
        return <Step2Expenses onNext={handleNext} onBack={handleBack} />
      case 2:
        return <Step3Debts onNext={handleNext} onBack={handleBack} />
      case 3:
        return <Step4Savings onNext={handleNext} onBack={handleBack} />
      case 4:
        return <Step5Goals onNext={handleNext} onBack={handleBack} />
      default:
        return <LoadingSpinner />
    }
  }

  return <div className="scroll-smooth">{renderStep()}</div>
}

export default Onboarding
