
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PostOnboardingFlow } from '@/components/onboarding/PostOnboardingFlow'
import { useOptimizedOnboardingConsolidation } from '@/hooks/useOptimizedOnboardingConsolidation'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useToast } from '@/hooks/use-toast'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { consolidateData, isConsolidating } = useOptimizedOnboardingConsolidation()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const { toast } = useToast()

  const handleComplete = async () => {
    try {
      console.log('🚀 Starting onboarding completion process...')
      
      // Show loading state immediately
      toast({
        title: "Finalizando configuración...",
        description: "Preparando tu dashboard personalizado"
      })
      
      // First consolidate the data
      console.log('📊 Consolidating onboarding data...')
      await consolidateData(false) // Don't mark as completed yet
      
      // Small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Then mark onboarding as completed
      console.log('✅ Marking onboarding as completed...')
      await updateOnboardingStatus(true)
      
      // Another small delay for state propagation
      await new Promise(resolve => setTimeout(resolve, 300))
      
      console.log('🎉 Onboarding completed successfully, navigating to dashboard')
      
      toast({
        title: "¡Configuración completada!",
        description: "Redirigiendo a tu dashboard..."
      })
      
      // Navigate immediately without delay
      navigate('/dashboard', { replace: true })
      
    } catch (error) {
      console.error('❌ Error completing onboarding:', error)
      
      toast({
        title: "Error al completar configuración",
        description: "Redirigiendo al dashboard de todas formas...",
        variant: "destructive"
      })
      
      // On error, still navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1000)
    }
  }

  // Prevent showing loading if already consolidating from parent
  if (isConsolidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Consolidando información...</p>
        </div>
      </div>
    )
  }

  return (
    <PostOnboardingFlow 
      onComplete={handleComplete}
    />
  )
}
