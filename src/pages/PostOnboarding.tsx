
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ConsolidationLoader } from '@/components/shared/ConsolidationLoader'
import { FixedDataConsolidation } from '@/services/fixedDataConsolidation'
import { useToast } from '@/hooks/use-toast'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

export default function PostOnboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const { toast } = useToast()
  const [isConsolidating, setIsConsolidating] = useState(true)

  useEffect(() => {
    const consolidateAndComplete = async () => {
      if (!user?.id) return

      try {
        console.log('🔧 FIXED: Starting ROBUST consolidation process')
        
        // Usar el servicio de consolidación ROBUSTO
        const result = await FixedDataConsolidation.consolidateUserData(user.id)
        
        if (result.success) {
          console.log('✅ FIXED: Consolidation successful:', result.migratedRecords)
          
          toast({
            title: "Welcome to CrediPal! 🎉",
            description: `Successfully migrated your data: ${result.migratedRecords.incomes} incomes, ${result.migratedRecords.expenses} expenses, ${result.migratedRecords.debts} debts, ${result.migratedRecords.goals} goals`
          })
        } else {
          console.error('❌ FIXED: Consolidation failed:', result.errors)
          toast({
            title: "Data Migration Issues",
            description: result.errors.join(', '),
            variant: "destructive"
          })
        }

        // Marcar onboarding como completado
        await updateOnboardingStatus(true)
        
        // Dar tiempo para que se vea el mensaje
        setTimeout(() => {
          setIsConsolidating(false)
          navigate('/dashboard', { replace: true })
        }, 3000)

      } catch (error) {
        console.error('❌ FIXED: Error in consolidation process:', error)
        toast({
          title: "Error in Setup",
          description: "There was an issue setting up your dashboard. Redirecting...",
          variant: "destructive"
        })
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 2000)
      }
    }

    consolidateAndComplete()
  }, [user?.id, navigate, toast, updateOnboardingStatus])

  if (isConsolidating) {
    return (
      <ConsolidationLoader 
        onComplete={() => {}}
        autoComplete={false}
      />
    )
  }

  return null
}
