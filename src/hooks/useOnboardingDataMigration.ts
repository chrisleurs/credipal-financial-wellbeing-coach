
import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { DataConsolidationService } from '@/services/dataConsolidationService'
import { useToast } from './use-toast'

export const useOnboardingDataMigration = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isMigrating, setIsMigrating] = useState(false)
  const [hasCheckedMigration, setHasCheckedMigration] = useState(false)

  useEffect(() => {
    const checkAndMigrateOnboardingData = async () => {
      if (!user?.id || hasCheckedMigration) return

      try {
        setIsMigrating(true)

        // Check if user has onboarding data but no consolidated data
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_data')
          .eq('user_id', user.id)
          .single()

        if (!profile?.onboarding_completed) {
          setHasCheckedMigration(true)
          return
        }

        // Check if data is already consolidated by looking for income sources
        const { data: existingIncomes } = await supabase
          .from('income_sources')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)

        // If no consolidated data exists but onboarding is complete, migrate
        if (!existingIncomes || existingIncomes.length === 0) {
          console.log('🔄 Migrating onboarding data to permanent tables...')
          
          const onboardingData = profile.onboarding_data as any || {}
          
          // Consolidate the data
          const result = await DataConsolidationService.consolidateUserData(
            user.id,
            onboardingData,
            false // Don't mark as completed again
          )

          if (result.success) {
            console.log('✅ Onboarding data migrated successfully:', result.migratedRecords)
            
            // Trigger financial summary calculation
            await supabase.rpc('calculate_financial_summary', { 
              target_user_id: user.id 
            })
            
            toast({
              title: "Datos sincronizados",
              description: "Tu información financiera ha sido actualizada exitosamente",
            })
          } else {
            console.error('❌ Error migrating data:', result.errors)
          }
        }

        setHasCheckedMigration(true)
      } catch (error) {
        console.error('Error checking migration:', error)
      } finally {
        setIsMigrating(false)
      }
    }

    checkAndMigrateOnboardingData()
  }, [user?.id, hasCheckedMigration, toast])

  return {
    isMigrating,
    hasCheckedMigration
  }
}
