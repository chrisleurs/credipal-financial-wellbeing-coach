
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PostOnboardingFlow } from '@/components/onboarding/PostOnboardingFlow'
import { useOptimizedOnboardingConsolidation } from '@/hooks/useOptimizedOnboardingConsolidation'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { consolidateData, isConsolidating } = useOptimizedOnboardingConsolidation()
  const { updateOnboardingStatus } = useOnboardingStatus()

  const handleComplete = async () => {
    try {
      console.log('Completing onboarding flow...')
      
      // First consolidate the data
      await consolidateData(false) // Don't mark as completed yet
      
      // Then mark onboarding as completed
      await updateOnboardingStatus(true)
      
      console.log('Onboarding completed successfully, navigating to dashboard')
      
      // Navigate to dashboard after successful completion
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1000) // Small delay to show success message
      
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // On error, still try to navigate to dashboard
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <PostOnboardingFlow 
      onComplete={handleComplete}
    />
  )
}
