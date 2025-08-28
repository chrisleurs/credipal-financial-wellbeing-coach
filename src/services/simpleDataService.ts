
/**
 * Servicio simplificado para consolidación de datos
 * Reemplaza DataConsolidationService con lógica más simple
 */

import { supabase } from '@/integrations/supabase/client'

export interface SimpleConsolidationResult {
  success: boolean
  migratedRecords: number
  errors: string[]
}

export class SimpleDataService {
  static async consolidateUserData(userId: string): Promise<SimpleConsolidationResult> {
    const result: SimpleConsolidationResult = {
      success: false,
      migratedRecords: 0,
      errors: []
    }

    try {
      console.log('🔄 Starting simple data consolidation for user:', userId)

      // 1. Obtener datos del onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('user_id', userId)
        .single()

      if (!profile?.onboarding_data) {
        console.log('ℹ️ No onboarding data found')
        result.success = true
        return result
      }

      const onboardingData = profile.onboarding_data as any
      let recordsCreated = 0

      // 2. Crear fuentes de ingreso si no existen
      const { data: existingIncome } = await supabase
        .from('income_sources')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (!existingIncome?.length && onboardingData.monthlyIncome > 0) {
        const incomesToCreate = []
        
        if (onboardingData.monthlyIncome > 0) {
          incomesToCreate.push({
            user_id: userId,
            source_name: 'Ingreso Principal',
            amount: onboardingData.monthlyIncome,
            frequency: 'monthly',
            is_active: true
          })
        }

        if (onboardingData.extraIncome > 0) {
          incomesToCreate.push({
            user_id: userId,
            source_name: 'Ingresos Adicionales',
            amount: onboardingData.extraIncome,
            frequency: 'monthly',
            is_active: true
          })
        }

        if (incomesToCreate.length > 0) {
          const { error } = await supabase.from('income_sources').insert(incomesToCreate)
          if (!error) {
            recordsCreated += incomesToCreate.length
            console.log(`✅ Created ${incomesToCreate.length} income sources`)
          }
        }
      }

      // 3. Crear gastos básicos si no existen
      const { data: existingExpenses } = await supabase
        .from('expenses')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (!existingExpenses?.length && onboardingData.monthlyExpenses > 0) {
        const { error } = await supabase.from('expenses').insert({
          user_id: userId,
          amount: onboardingData.monthlyExpenses,
          category: 'Gastos Generales',
          description: 'Gastos mensuales del onboarding',
          date: new Date().toISOString().split('T')[0],
          is_recurring: true
        })

        if (!error) {
          recordsCreated += 1
          console.log('✅ Created basic expense record')
        }
      }

      // 4. Crear metas si no existen
      const { data: existingGoals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (!existingGoals?.length && onboardingData.financialGoals?.length) {
        const goalsToCreate = onboardingData.financialGoals.map((goalTitle: string) => ({
          user_id: userId,
          title: goalTitle,
          description: `Meta del onboarding: ${goalTitle}`,
          target_amount: 50000,
          current_amount: onboardingData.currentSavings || 0,
          priority: 'medium' as const,
          status: 'active' as const
        }))

        const { error } = await supabase.from('goals').insert(goalsToCreate)
        if (!error) {
          recordsCreated += goalsToCreate.length
          console.log(`✅ Created ${goalsToCreate.length} goals`)
        }
      }

      // 5. Recalcular resumen financiero
      await supabase.rpc('calculate_financial_summary', { target_user_id: userId })

      result.success = true
      result.migratedRecords = recordsCreated
      console.log('✅ Simple consolidation completed:', result)

    } catch (error) {
      console.error('❌ Error in simple consolidation:', error)
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return result
  }

  static async markOnboardingCompleted(userId: string): Promise<void> {
    try {
      await supabase.from('profiles').update({
        onboarding_completed: true,
        onboarding_step: 0
      }).eq('user_id', userId)
      
      console.log('✅ Marked onboarding as completed')
    } catch (error) {
      console.error('❌ Error marking onboarding completed:', error)
    }
  }
}
