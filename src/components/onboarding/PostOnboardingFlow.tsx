
import React, { useState } from 'react'
import { PostOnboardingWelcome } from './PostOnboardingWelcome'
import { PostOnboardingAIGeneration } from './PostOnboardingAIGeneration'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'

interface PostOnboardingFlowProps {
  onComplete: () => void
}

type FlowStep = 'welcome' | 'generating'

export const PostOnboardingFlow: React.FC<PostOnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome')
  const { consolidatedData } = useConsolidatedFinancialData()

  const handleCreatePlan = () => {
    setCurrentStep('generating')
  }

  const handlePlanGenerated = (plan: any) => {
    console.log('Plan generado exitosamente:', plan)
    onComplete()
  }

  return (
    <>
      {currentStep === 'welcome' && (
        <PostOnboardingWelcome onCreatePlan={handleCreatePlan} />
      )}
      {currentStep === 'generating' && (
        <PostOnboardingAIGeneration 
          consolidatedData={consolidatedData}
          onPlanGenerated={handlePlanGenerated}
        />
      )}
    </>
  )
}
