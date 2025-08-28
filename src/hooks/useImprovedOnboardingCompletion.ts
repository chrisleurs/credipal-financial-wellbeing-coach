
import { useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'
import { FixedDataConsolidation } from '@/services/fixedDataConsolidation'

export const useImprovedOnboardingCompletion = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isCompleting, setIsCompleting] = useState(false)

  const completeOnboardingWithMigration = async () => {
    if (!user?.id) {
      console.error('❌ ONBOARDING: No user authenticated')
      return false
    }

    setIsCompleting(true)
    console.log('🔄 ONBOARDING: Starting improved completion process for user:', user.id)

    try {
      // PASO 1: Verificar si hay datos en onboarding_data
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_completed')
        .eq('user_id', user.id)
        .single()

      if (!profile) {
        console.error('❌ ONBOARDING: Profile not found')
        return false
      }

      const onboardingData = profile.onboarding_data as any || {}
      
      console.log('📊 ONBOARDING: Found onboarding data:', {
        monthlyIncome: onboardingData.monthlyIncome,
        extraIncome: onboardingData.extraIncome,
        debtsCount: onboardingData.debts?.length || 0,
        financialGoalsCount: onboardingData.financialGoals?.length || 0,
        expenseCategoriesKeys: Object.keys(onboardingData.expenseCategories || {})
      })

      // PASO 2: Migrar datos ANTES de marcar como completado
      if (onboardingData && Object.keys(onboardingData).length > 0) {
        console.log('🔄 ONBOARDING: Migrating data to consolidated tables...')
        
        const migrationResult = await FixedDataConsolidation.consolidateUserData(user.id)
        
        if (!migrationResult.success) {
          console.error('❌ ONBOARDING: Migration failed:', migrationResult.errors)
          toast({
            title: "Error en migración",
            description: "No se pudieron migrar todos los datos correctamente",
            variant: "destructive"
          })
          return false
        }

        console.log('✅ ONBOARDING: Migration successful:', migrationResult.migratedRecords)
      }

      // PASO 3: Marcar onboarding como completado Y limpiar datos temporales
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_step: 0,
          onboarding_data: {} // Limpiar datos temporales después de migrar
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('❌ ONBOARDING: Error updating profile:', updateError)
        return false
      }

      // PASO 4: Recalcular resumen financiero
      await supabase.rpc('calculate_financial_summary', {
        target_user_id: user.id
      })

      console.log('✅ ONBOARDING: Completion process finished successfully')
      
      toast({
        title: "¡Onboarding completado!",
        description: "Tus datos financieros han sido guardados exitosamente",
      })

      return true

    } catch (error) {
      console.error('❌ ONBOARDING: Error in completion process:', error)
      toast({
        title: "Error",
        description: "No se pudo completar el onboarding correctamente",
        variant: "destructive"
      })
      return false
    } finally {
      setIsCompleting(false)
    }
  }

  return {
    completeOnboardingWithMigration,
    isCompleting
  }
}
