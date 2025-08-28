
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { ConsolidationLoader } from '@/components/shared/ConsolidationLoader'
import { SimpleDataService } from '@/services/simpleDataService'
import { useToast } from '@/hooks/use-toast'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: consolidatedData, isLoading } = useConsolidatedData()
  const { toast } = useToast()
  const [isConsolidating, setIsConsolidating] = useState(true)

  // Consolidar datos al montar el componente
  useEffect(() => {
    const consolidateData = async () => {
      if (!user?.id) return

      try {
        setIsConsolidating(true)
        
        // Dar tiempo para que se vea la animación
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const result = await SimpleDataService.consolidateUserData(user.id)
        
        if (result.success) {
          console.log('✅ Data consolidated successfully')
        } else {
          console.error('❌ Consolidation had errors:', result.errors)
        }
      } catch (error) {
        console.error('❌ Error during consolidation:', error)
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
  }, [user?.id, toast])

  const handleConsolidationComplete = async () => {
    if (!user?.id) return

    try {
      // Marcar onboarding como completado
      await SimpleDataService.markOnboardingCompleted(user.id)
      
      toast({
        title: "¡Bienvenido a CrediPal!",
        description: "Tu plan financiero está listo"
      })
      
      // Navegar al dashboard
      navigate('/dashboard', { replace: true })
      
    } catch (error) {
      console.error('Error completing onboarding:', error)
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

  // Si ya no está consolidando, ir directo al dashboard
  React.useEffect(() => {
    handleConsolidationComplete()
  }, [])

  return null
}
