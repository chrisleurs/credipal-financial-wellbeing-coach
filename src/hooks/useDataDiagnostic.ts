
/**
 * Hook de diagnóstico para identificar y reparar problemas de datos
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export interface DataDiagnostic {
  profileExists: boolean
  onboardingCompleted: boolean
  onboardingDataExists: boolean
  onboardingDataContent: any
  tablesData: {
    incomes: number
    expenses: number
    debts: number
    goals: number
  }
  needsRepair: boolean
  repairActions: string[]
}

export const useDataDiagnostic = () => {
  const { user } = useAuth()

  const { data: diagnostic, isLoading, error } = useQuery({
    queryKey: ['data-diagnostic', user?.id],
    queryFn: async (): Promise<DataDiagnostic> => {
      if (!user?.id) throw new Error('User not authenticated')

      console.log('🔍 DIAGNOSTIC: Starting comprehensive data analysis for user:', user.id)

      const result: DataDiagnostic = {
        profileExists: false,
        onboardingCompleted: false,
        onboardingDataExists: false,
        onboardingDataContent: null,
        tablesData: { incomes: 0, expenses: 0, debts: 0, goals: 0 },
        needsRepair: false,
        repairActions: []
      }

      // 1. Verificar perfil y datos de onboarding
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        result.profileExists = true
        result.onboardingCompleted = profile.onboarding_completed || false
        result.onboardingDataExists = !!(profile.onboarding_data && 
          typeof profile.onboarding_data === 'object' && 
          Object.keys(profile.onboarding_data).length > 0)
        result.onboardingDataContent = profile.onboarding_data

        console.log('📊 DIAGNOSTIC: Profile found:', {
          onboardingCompleted: result.onboardingCompleted,
          onboardingDataExists: result.onboardingDataExists,
          onboardingDataKeys: result.onboardingDataExists ? Object.keys(profile.onboarding_data) : []
        })
      }

      // 2. Verificar datos en tablas consolidadas
      const [incomesResult, expensesResult, debtsResult, goalsResult] = await Promise.all([
        supabase.from('income_sources').select('id').eq('user_id', user.id),
        supabase.from('expenses').select('id').eq('user_id', user.id),
        supabase.from('debts').select('id').eq('user_id', user.id),
        supabase.from('goals').select('id').eq('user_id', user.id)
      ])

      result.tablesData = {
        incomes: incomesResult.data?.length || 0,
        expenses: expensesResult.data?.length || 0,
        debts: debtsResult.data?.length || 0,
        goals: goalsResult.data?.length || 0
      }

      console.log('📊 DIAGNOSTIC: Tables data:', result.tablesData)

      // 3. Determinar si necesita reparación
      if (result.onboardingDataExists && result.tablesData.incomes === 0) {
        result.needsRepair = true
        result.repairActions.push('Migrate income data from onboarding')
      }

      if (result.onboardingDataExists && result.tablesData.expenses === 0) {
        result.needsRepair = true
        result.repairActions.push('Migrate expense categories from onboarding')
      }

      if (result.onboardingDataExists && result.tablesData.goals === 0) {
        result.needsRepair = true
        result.repairActions.push('Migrate financial goals from onboarding')
      }

      if (!result.onboardingCompleted && result.onboardingDataExists) {
        result.needsRepair = true
        result.repairActions.push('Mark onboarding as completed')
      }

      console.log('🔧 DIAGNOSTIC: Repair needed:', result.needsRepair)
      console.log('🔧 DIAGNOSTIC: Repair actions:', result.repairActions)

      return result
    },
    enabled: !!user?.id,
  })

  const repairData = async () => {
    if (!diagnostic?.needsRepair || !user?.id) return false

    console.log('🔧 REPAIR: Starting data repair process')

    try {
      const onboardingData = diagnostic.onboardingDataContent as any

      // Reparar ingresos
      if (diagnostic.repairActions.includes('Migrate income data from onboarding')) {
        const incomesToCreate = []
        
        if (onboardingData.monthlyIncome > 0) {
          incomesToCreate.push({
            user_id: user.id,
            source_name: 'Ingreso Principal',
            amount: Number(onboardingData.monthlyIncome),
            frequency: 'monthly',
            is_active: true
          })
        }

        if (onboardingData.extraIncome > 0) {
          incomesToCreate.push({
            user_id: user.id,
            source_name: 'Ingresos Adicionales',
            amount: Number(onboardingData.extraIncome),
            frequency: 'monthly',
            is_active: true
          })
        }

        if (incomesToCreate.length > 0) {
          await supabase.from('income_sources').insert(incomesToCreate)
          console.log('✅ REPAIR: Created income sources')
        }
      }

      // Reparar gastos
      if (diagnostic.repairActions.includes('Migrate expense categories from onboarding')) {
        const expensesToCreate = []

        if (onboardingData.expenseCategories) {
          const categoryMapping: Record<string, string> = {
            'food': 'Alimentación',
            'transport': 'Transporte', 
            'housing': 'Vivienda',
            'bills': 'Servicios',
            'entertainment': 'Entretenimiento',
            'healthcare': 'Salud',
            'shopping': 'Compras',
            'other': 'Otros'
          }

          Object.entries(onboardingData.expenseCategories).forEach(([key, amount]) => {
            if (typeof amount === 'number' && amount > 0) {
              expensesToCreate.push({
                user_id: user.id,
                amount: amount,
                category: categoryMapping[key] || key,
                description: `Gastos de ${categoryMapping[key] || key} - del onboarding`,
                date: new Date().toISOString().split('T')[0],
                is_recurring: true
              })
            }
          })
        }

        if (expensesToCreate.length > 0) {
          await supabase.from('expenses').insert(expensesToCreate)
          console.log('✅ REPAIR: Created expense categories')
        }
      }

      // Reparar metas
      if (diagnostic.repairActions.includes('Migrate financial goals from onboarding')) {
        if (onboardingData.financialGoals?.length > 0) {
          const goalsToCreate = onboardingData.financialGoals.map((goalTitle: string) => ({
            user_id: user.id,
            title: goalTitle,
            description: `Meta financiera: ${goalTitle}`,
            target_amount: 50000,
            current_amount: onboardingData.currentSavings || 0,
            priority: 'medium' as const,
            status: 'active' as const
          }))

          await supabase.from('goals').insert(goalsToCreate)
          console.log('✅ REPAIR: Created financial goals')
        }
      }

      // Marcar onboarding como completado
      if (diagnostic.repairActions.includes('Mark onboarding as completed')) {
        await supabase.from('profiles').update({
          onboarding_completed: true,
          onboarding_step: 0
        }).eq('user_id', user.id)
        console.log('✅ REPAIR: Marked onboarding as completed')
      }

      // Recalcular resumen financiero
      await supabase.rpc('calculate_financial_summary', { target_user_id: user.id })

      console.log('✅ REPAIR: Data repair completed successfully')
      return true

    } catch (error) {
      console.error('❌ REPAIR: Error during data repair:', error)
      return false
    }
  }

  return {
    diagnostic,
    isLoading,
    error,
    repairData,
    needsRepair: diagnostic?.needsRepair || false
  }
}
