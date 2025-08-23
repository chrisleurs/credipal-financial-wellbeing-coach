
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PostOnboardingFlow } from '@/components/onboarding/PostOnboardingFlow'
import { useOptimizedOnboardingConsolidation } from '@/hooks/useOptimizedOnboardingConsolidation'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { consolidateData, isConsolidating } = useOptimizedOnboardingConsolidation()

  const handleComplete = async () => {
    // Use optimized consolidation service
    consolidateData(true) // Mark as completed
    
    // Navigate to dashboard after consolidation
    setTimeout(() => {
      navigate('/dashboard')
    }, 1000) // Small delay to show success message
  }

  return (
    <PostOnboardingFlow 
      onComplete={handleComplete}
      isProcessing={isConsolidating}
    />
  )
}
