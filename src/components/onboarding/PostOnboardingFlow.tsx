
import React, { useState } from 'react'
import { PostOnboardingWelcome } from './PostOnboardingWelcome'
import { PostOnboardingLoading } from './PostOnboardingLoading'

interface PostOnboardingFlowProps {
  onComplete: () => void
}

type FlowStep = 'welcome' | 'loading'

export const PostOnboardingFlow: React.FC<PostOnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome')

  const handleCreatePlan = () => {
    setCurrentStep('loading')
  }

  const handleLoadingComplete = () => {
    onComplete()
  }

  return (
    <>
      {currentStep === 'welcome' && (
        <PostOnboardingWelcome onCreatePlan={handleCreatePlan} />
      )}
      {currentStep === 'loading' && (
        <PostOnboardingLoading onComplete={handleLoadingComplete} />
      )}
    </>
  )
}
