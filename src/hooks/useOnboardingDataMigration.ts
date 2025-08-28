
/**
 * Hook para migrar datos del onboarding a tablas consolidadas
 * Soluciona el problema de datos temporales vs datos finales
 */

import { useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from './use-toast'

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
    if (!user?.id || !migrationStatus?.onboardingData) return false

    setIsLoading(true)
    console.log('🔄 MIGRATION: Starting complete data migration')

    try {
      const { onboardingData } = migrationStatus

      // 1. MIGRAR INGRESOS
      if (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0) {
        const incomesToCreate = []
        
        if (onboardingData.monthlyIncome > 0) {
          incomesToCreate.push({
            user_id: user.id,
            source_name: 'Ingreso Principal',
            amount: Number(onboardingData.monthlyIncome),
            frequency: 'monthly' as const,
            is_active: true
          })
        }

        if (onboardingData.extraIncome && onboardingData.extraIncome > 0) {
          incomesToCreate.push({
            user_id: user.id,
            source_name: 'Ingresos Adicionales',
            amount: Number(onboardingData.extraIncome),
            frequency: 'monthly' as const,
            is_active: true
          })
        }

        if (incomesToCreate.length > 0) {
          await supabase.from('income_sources').insert(incomesToCreate)
          console.log('✅ MIGRATION: Created income sources:', incomesToCreate.length)
        }
      }

      // 2. MIGRAR DEUDAS
      if (onboardingData.debts && Array.isArray(onboardingData.debts)) {
        const debtsToCreate = onboardingData.debts.map((debt) => ({
          user_id: user.id,
          creditor: debt.name || 'Acreedor',
          original_amount: Number(debt.amount || 0),
          current_balance: Number(debt.amount || 0),
          monthly_payment: Number(debt.monthlyPayment || 0),
          interest_rate: Number(debt.interestRate || 0),
          status: 'active' as const
        })).filter((debt) => debt.current_balance > 0)

        if (debtsToCreate.length > 0) {
          await supabase.from('debts').insert(debtsToCreate)
          console.log('✅ MIGRATION: Created debts:', debtsToCreate.length)
        }
      }

      // 3. MIGRAR METAS/AHORROS
      if (onboardingData.financialGoals && Array.isArray(onboardingData.financialGoals)) {
        const goalsToCreate = onboardingData.financialGoals.map((goalTitle: string) => ({
          user_id: user.id,
          title: goalTitle,
          description: `Meta financiera: ${goalTitle}`,
          target_amount: 50000, // Valor base
          current_amount: Math.floor((onboardingData.currentSavings || 0) / onboardingData.financialGoals!.length),
          priority: 'medium' as const,
          status: 'active' as const
        }))

        if (goalsToCreate.length > 0) {
          await supabase.from('goals').insert(goalsToCreate)
          console.log('✅ MIGRATION: Created goals:', goalsToCreate.length)
        }
      }

      // 4. ACTUALIZAR RESUMEN FINANCIERO
      await supabase.rpc('calculate_financial_summary', { target_user_id: user.id })

      // 5. MARCAR ONBOARDING COMO COMPLETADO
      await supabase.from('profiles').update({
        onboarding_completed: true,
        onboarding_step: 0
      }).eq('user_id', user.id)

      console.log('✅ MIGRATION: Complete data migration successful')
      
      toast({
        title: "Migración completada",
        description: "Todos tus datos han sido migrados correctamente al dashboard",
      })

      // Recargar la página para mostrar los datos
      setTimeout(() => window.location.reload(), 1000)

      return true

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
