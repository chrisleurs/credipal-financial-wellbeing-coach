
import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'
import { DataConsolidationService } from '@/services/dataConsolidationService'
import { useQueryClient } from '@tanstack/react-query'

export const useDataCleanup = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isCleaningUp, setIsCleaningUp] = useState(false)
  const [cleanupStatus, setCleanupStatus] = useState<{
    hasOnboardingData: boolean
    hasConsolidatedData: boolean
    needsCleanup: boolean
  } | null>(null)

  // Analizar el estado de los datos del usuario
  const analyzeDataState = async () => {
    if (!user?.id) return

    try {
      // Verificar datos de onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_completed')
        .eq('user_id', user.id)
        .single()

      // Verificar datos consolidados
      const { data: incomes } = await supabase
        .from('income_sources')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      const { data: expenses } = await supabase
        .from('expenses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      const hasOnboardingData = profile?.onboarding_data && 
        typeof profile.onboarding_data === 'object' && 
        Object.keys(profile.onboarding_data).length > 0

      const hasConsolidatedData = (incomes && incomes.length > 0) || 
        (expenses && expenses.length > 0)

      const needsCleanup = hasOnboardingData && hasConsolidatedData

      setCleanupStatus({
        hasOnboardingData: !!hasOnboardingData,
        hasConsolidatedData,
        needsCleanup
      })

      console.log('📊 Data state analysis:', {
        hasOnboardingData: !!hasOnboardingData,
        hasConsolidatedData,
        needsCleanup,
        onboardingCompleted: profile?.onboarding_completed
      })

    } catch (error) {
      console.error('❌ Error analyzing data state:', error)
    }
  }

  // Ejecutar limpieza completa
  const executeCleanup = async () => {
    if (!user?.id || !cleanupStatus?.needsCleanup) return

    try {
      setIsCleaningUp(true)
      console.log('🧹 Starting data cleanup process...')

      // 1. Asegurar que los datos estén consolidados
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('user_id', user.id)
        .single()

      if (profile?.onboarding_data) {
        const onboardingData = profile.onboarding_data as any
        
        // Consolidar datos si aún no se ha hecho completamente
        const result = await DataConsolidationService.consolidateUserData(
          user.id,
          onboardingData,
          false // No marcar como completado todavía
        )

        if (result.success) {
          console.log('✅ Data consolidation completed:', result.migratedRecords)
        }
      }

      // 2. Limpiar datos temporales del onboarding
      await supabase
        .from('profiles')
        .update({
          onboarding_data: {} // Limpiar datos temporales
        })
        .eq('user_id', user.id)

      // 3. Limpiar tabla temporal de gastos del onboarding
      await supabase
        .from('onboarding_expenses')
        .delete()
        .eq('user_id', user.id)

      // 4. Recalcular resumen financiero
      await supabase.rpc('calculate_financial_summary', { 
        target_user_id: user.id 
      })

      // 5. Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string
          return key.includes('financial') || 
                 key.includes('optimized') || 
                 key.includes('consolidated') ||
                 key.includes('income') ||
                 key.includes('expense') ||
                 key.includes('debt') ||
                 key.includes('goal')
        }
      })

      console.log('🎉 Data cleanup completed successfully!')
      
      toast({
        title: "Datos limpiados exitosamente",
        description: "Se eliminaron duplicaciones y se unificaron las fuentes de datos",
      })

      // Re-analizar después de la limpieza
      setTimeout(analyzeDataState, 1000)

    } catch (error) {
      console.error('❌ Error during data cleanup:', error)
      toast({
        title: "Error en limpieza",
        description: "Hubo un problema al limpiar los datos",
        variant: "destructive"
      })
    } finally {
      setIsCleaningUp(false)
    }
  }

  // Auto-análisis al cargar
  useEffect(() => {
    if (user?.id) {
      analyzeDataState()
    }
  }, [user?.id])

  return {
    cleanupStatus,
    isCleaningUp,
    executeCleanup,
    analyzeDataState
  }
}
