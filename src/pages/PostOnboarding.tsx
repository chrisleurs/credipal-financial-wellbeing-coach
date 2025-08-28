
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { ConsolidationLoader } from '@/components/shared/ConsolidationLoader'
import { SimpleDataService } from '@/services/simpleDataService'
import { useToast } from '@/hooks/use-toast'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: consolidatedData, isLoading } = useConsolidatedData()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const { toast } = useToast()
  const [isConsolidating, setIsConsolidating] = useState(true)
  const [hasCompleted, setHasCompleted] = useState(false)

  // Consolidar datos al montar el componente
  useEffect(() => {
    const consolidateData = async () => {
      if (!user?.id || hasCompleted) return

      try {
        console.log('🔄 PostOnboarding: Starting data consolidation for user:', user.id)
        setIsConsolidating(true)
        
        // Dar tiempo para que se vea la animación
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const result = await SimpleDataService.consolidateUserData(user.id)
        
        if (result.success) {
          console.log('✅ PostOnboarding: Data consolidated successfully')
        } else {
          console.error('❌ PostOnboarding: Consolidation had errors:', result.errors)
        }
      } catch (error) {
        console.error('❌ PostOnboarding: Error during consolidation:', error)
        toast({
          title: "Error en consolidación",
          description: "Hubo un problema al procesar tus datos. Continuaremos al dashboard.",
          variant: "destructive"
        })
      } finally {
        setIsConsolidating(false)
      }
    }

    consolidateData()
  }, [user?.id, toast, hasCompleted])

  const handleConsolidationComplete = async () => {
    if (!user?.id || hasCompleted) return

    try {
      console.log('🔄 PostOnboarding: Completing onboarding process for user:', user.id)
      setHasCompleted(true)
      
      // Marcar onboarding como completado usando el hook
      await updateOnboardingStatus(true)
      console.log('✅ PostOnboarding: Onboarding marked as completed')
      
      // Esperar un momento para que se propague el cambio
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "¡Bienvenido a CrediPal!",
        description: "Tu plan financiero está listo"
      })
      
      // Forzar navegación al dashboard
      console.log('🔄 PostOnboarding: Navigating to dashboard')
      navigate('/dashboard', { replace: true })
      
    } catch (error) {
      console.error('❌ PostOnboarding: Error completing onboarding:', error)
      toast({
        title: "Error completando configuración",
        description: "Continuaremos al dashboard",
        variant: "destructive"
      })
      // Aún así navegar al dashboard
      navigate('/dashboard', { replace: true })
    }
  }

  // Mostrar loader mientras consolida
  if (isConsolidating || isLoading) {
    return (
      <ConsolidationLoader 
        onComplete={handleConsolidationComplete}
        autoComplete={true}
      />
    )
  }

  // Si ya no está consolidando y no ha completado, completar ahora
  if (!hasCompleted) {
    handleConsolidationComplete()
  }

  return null
}
