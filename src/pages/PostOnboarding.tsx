
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PostOnboardingFlow } from '@/components/onboarding/PostOnboardingFlow'
import { useOnboardingDataConsolidation } from '@/hooks/useOnboardingDataConsolidation'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { consolidateOnboardingData } = useOnboardingDataConsolidation()

  const handleComplete = async () => {
    // Consolidar datos del onboarding antes de ir al dashboard
    await consolidateOnboardingData(true)
    
    // Redirigir al dashboard
    navigate('/dashboard')
  }

  return <PostOnboardingFlow onComplete={handleComplete} />
}
