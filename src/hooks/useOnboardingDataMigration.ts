
/**
 * Hook para migrar datos del onboarding a tablas consolidadas
 * Soluciona el problema de datos temporales vs datos finales
 */

import { useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'
import { FixedDataConsolidation } from '@/services/fixedDataConsolidation'

// Interface para los datos del onboarding
interface OnboardingData {
  monthlyIncome?: number
  extraIncome?: number
  currentSavings?: number
  debts?: Array<{
    name: string
    amount: number
    monthlyPayment: number
    interestRate?: number
  }>
  financialGoals?: string[]
  expenseCategories?: Record<string, number>
}

export const useOnboardingDataMigration = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<{
    onboardingData: OnboardingData
    tablesData: any
    needsMigration: boolean
  } | null>(null)

  const diagnoseData = async () => {
    if (!user?.id) return

    console.log('🔍 MIGRATION: Diagnosing data for user:', user.id)

    try {
      // 1. Obtener datos del onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_completed')
        .eq('user_id', user.id)
        .single()

      // 2. Verificar tablas consolidadas
      const [incomesResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        supabase.from('income_sources').select('*').eq('user_id', user.id),
        supabase.from('expenses').select('*').eq('user_id', user.id),
        supabase.from('debts').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id)
      ])

      // Properly cast the onboarding_data from Json to our interface
      const onboardingData: OnboardingData = (profile?.onboarding_data as OnboardingData) || {}
      
      const tablesData = {
        incomes: incomesResult.data?.length || 0,
        expenses: expensesResult.data?.length || 0,
        debts: debtsResult.data?.length || 0,
        goals: goalsResult.data?.length || 0
      }

      console.log('📊 MIGRATION: Onboarding data found:', {
        monthlyIncome: onboardingData.monthlyIncome,
        extraIncome: onboardingData.extraIncome,
        currentSavings: onboardingData.currentSavings,
        debtsCount: onboardingData.debts?.length || 0,
        financialGoalsCount: onboardingData.financialGoals?.length || 0,
        expenseCategoriesKeys: Object.keys(onboardingData.expenseCategories || {})
      })

      console.log('📊 MIGRATION: Tables data:', tablesData)

      const needsMigration = (
        (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0 && tablesData.incomes === 0) ||
        (onboardingData.debts && onboardingData.debts.length > 0 && tablesData.debts === 0) ||
        (onboardingData.financialGoals && onboardingData.financialGoals.length > 0 && tablesData.goals === 0)
      )

      setMigrationStatus({
        onboardingData,
        tablesData,
        needsMigration
      })

      return { onboardingData, tablesData, needsMigration }

    } catch (error) {
      console.error('❌ MIGRATION: Error diagnosing data:', error)
      return null
    }
  }

  const migrateAllData = async () => {
    if (!user?.id) return false

    setIsLoading(true)
    console.log('🔄 MIGRATION: Starting complete data migration using FixedDataConsolidation')

    try {
      // Usar el servicio robusto de consolidación
      const result = await FixedDataConsolidation.consolidateUserData(user.id)

      if (result.success) {
        console.log('✅ MIGRATION: Complete data migration successful')
        
        toast({
          title: "Migración completada",
          description: `Migrados: ${result.migratedRecords.incomes} ingresos, ${result.migratedRecords.debts} deudas, ${result.migratedRecords.goals} metas`,
        })

        // Recargar la página para mostrar los datos
        setTimeout(() => window.location.reload(), 1000)
        return true
      } else {
        console.error('❌ MIGRATION: Migration failed:', result.errors)
        toast({
          title: "Error en la migración",
          description: result.errors.join(', '),
          variant: "destructive"
        })
        return false
      }

    } catch (error) {
      console.error('❌ MIGRATION: Error during migration:', error)
      toast({
        title: "Error en la migración",
        description: "No se pudieron migrar todos los datos correctamente",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    migrationStatus,
    isLoading,
    diagnoseData,
    migrateAllData
  }
}
