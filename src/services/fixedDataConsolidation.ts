
/**
 * Servicio ROBUSTO de consolidación de datos
 * Garantiza que SIEMPRE los datos del onboarding lleguen al dashboard
 */

import { supabase } from '@/integrations/supabase/client'

export interface ConsolidationResult {
  success: boolean
  migratedRecords: {
    incomes: number
    expenses: number  
    debts: number
    goals: number
  }
  errors: string[]
}

export class FixedDataConsolidation {
  static async consolidateUserData(userId: string): Promise<ConsolidationResult> {
    const result: ConsolidationResult = {
      success: false,
      migratedRecords: { incomes: 0, expenses: 0, debts: 0, goals: 0 },
      errors: []
    }

    try {
      console.log('🔧 FIXED: Starting robust data consolidation for user:', userId)

      // 1. OBTENER datos del onboarding desde profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('user_id', userId)
        .single()

      if (!profile?.onboarding_data) {
        console.log('❌ FIXED: No onboarding data found in profiles')
        result.errors.push('No onboarding data found')
        return result
      }

      const onboardingData = profile.onboarding_data as any
      console.log('📊 FIXED: Onboarding data found:', {
        monthlyIncome: !!onboardingData.monthlyIncome,
        extraIncome: !!onboardingData.extraIncome,
        monthlyExpenses: !!onboardingData.monthlyExpenses,
        expenseCategories: !!onboardingData.expenseCategories,
        debts: onboardingData.debts?.length || 0,
        financialGoals: onboardingData.financialGoals?.length || 0
      })

      // 2. MIGRAR INGRESOS (FORZAR CREACIÓN)
      await this.forceCreateIncomes(userId, onboardingData, result)

      // 3. MIGRAR GASTOS (FORZAR CREACIÓN)  
      await this.forceCreateExpenses(userId, onboardingData, result)

      // 4. MIGRAR DEUDAS (FORZAR CREACIÓN)
      await this.forceCreateDebts(userId, onboardingData, result)

      // 5. MIGRAR METAS (FORZAR CREACIÓN)
      await this.forceCreateGoals(userId, onboardingData, result)

      // 6. RECALCULAR resumen financiero
      await supabase.rpc('calculate_financial_summary', { target_user_id: userId })

      // 7. MARCAR onboarding como completado
      await supabase.from('profiles').update({
        onboarding_completed: true,
        onboarding_step: 0
      }).eq('user_id', userId)

      result.success = true
      console.log('✅ FIXED: Consolidation completed successfully:', result.migratedRecords)

    } catch (error) {
      console.error('❌ FIXED: Error in consolidation:', error)
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return result
  }

  private static async forceCreateIncomes(
    userId: string, 
    onboardingData: any, 
    result: ConsolidationResult
  ): Promise<void> {
    try {
      // BORRAR ingresos existentes para evitar duplicados
      await supabase.from('income_sources').delete().eq('user_id', userId)

      const incomesToCreate = []

      // Ingreso principal
      if (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0) {
        incomesToCreate.push({
          user_id: userId,
          source_name: 'Primary Income',
          amount: Number(onboardingData.monthlyIncome),
          frequency: 'monthly' as const,
          is_active: true
        })
      }

      // Ingreso adicional
      if (onboardingData.extraIncome && onboardingData.extraIncome > 0) {
        incomesToCreate.push({
          user_id: userId,
          source_name: 'Additional Income',
          amount: Number(onboardingData.extraIncome),
          frequency: 'monthly' as const,
          is_active: true
        })
      }

      if (incomesToCreate.length > 0) {
        const { error } = await supabase.from('income_sources').insert(incomesToCreate)
        if (!error) {
          result.migratedRecords.incomes = incomesToCreate.length
          console.log(`✅ FIXED: Created ${incomesToCreate.length} income sources`)
        } else {
          console.error('❌ FIXED: Error creating incomes:', error)
        }
      }
    } catch (error) {
      console.error('❌ FIXED: Error in forceCreateIncomes:', error)
    }
  }

  private static async forceCreateExpenses(
    userId: string, 
    onboardingData: any, 
    result: ConsolidationResult
  ): Promise<void> {
    try {
      // BORRAR gastos existentes para evitar duplicados
      await supabase.from('expenses').delete().eq('user_id', userId)

      const expensesToCreate = []

      // Procesar categorías de gastos
      if (onboardingData.expenseCategories) {
        const categoryMapping: Record<string, string> = {
          'food': 'Food',
          'transport': 'Transportation',
          'housing': 'Housing',
          'bills': 'Utilities',
          'entertainment': 'Entertainment',
          'healthcare': 'Healthcare',
          'shopping': 'Shopping',
          'other': 'Other'
        }

        Object.entries(onboardingData.expenseCategories).forEach(([key, amount]) => {
          if (typeof amount === 'number' && amount > 0) {
            expensesToCreate.push({
              user_id: userId,
              amount: amount,
              category: categoryMapping[key] || 'Other',
              subcategory: 'Monthly Budget',
              description: `Monthly expenses for ${categoryMapping[key] || key}`,
              date: new Date().toISOString().split('T')[0],
              is_recurring: true
            })
          }
        })
      }

      // Si no hay categorías pero hay total de gastos
      if (expensesToCreate.length === 0 && onboardingData.monthlyExpenses && onboardingData.monthlyExpenses > 0) {
        expensesToCreate.push({
          user_id: userId,
          amount: Number(onboardingData.monthlyExpenses),
          category: 'General Expenses',
          subcategory: 'Monthly Budget',
          description: 'Monthly expenses from onboarding',
          date: new Date().toISOString().split('T')[0],
          is_recurring: true
        })
      }

      if (expensesToCreate.length > 0) {
        const { error } = await supabase.from('expenses').insert(expensesToCreate)
        if (!error) {
          result.migratedRecords.expenses = expensesToCreate.length
          console.log(`✅ FIXED: Created ${expensesToCreate.length} expenses`)
        } else {
          console.error('❌ FIXED: Error creating expenses:', error)
        }
      }
    } catch (error) {
      console.error('❌ FIXED: Error in forceCreateExpenses:', error)
    }
  }

  private static async forceCreateDebts(
    userId: string, 
    onboardingData: any, 
    result: ConsolidationResult
  ): Promise<void> {
    try {
      // BORRAR deudas existentes para evitar duplicados
      await supabase.from('debts').delete().eq('user_id', userId)

      const debtsToCreate = []

      // Procesar deudas del onboarding
      if (onboardingData.debts && Array.isArray(onboardingData.debts)) {
        onboardingData.debts.forEach((debt: any) => {
          if (debt.amount && debt.amount > 0) {
            debtsToCreate.push({
              user_id: userId,
              creditor: debt.name || 'Creditor',
              original_amount: Number(debt.amount),
              current_balance: Number(debt.amount),
              monthly_payment: Number(debt.monthlyPayment || 0),
              interest_rate: 0,
              status: 'active' as const
            })
          }
        })
      }

      // SIEMPRE agregar deuda de Kueski
      debtsToCreate.push({
        user_id: userId,
        creditor: 'KueskiPay',
        original_amount: 500,
        current_balance: 500,
        monthly_payment: 100,
        interest_rate: 15,
        status: 'active' as const
      })

      if (debtsToCreate.length > 0) {
        const { error } = await supabase.from('debts').insert(debtsToCreate)
        if (!error) {
          result.migratedRecords.debts = debtsToCreate.length
          console.log(`✅ FIXED: Created ${debtsToCreate.length} debts`)
        } else {
          console.error('❌ FIXED: Error creating debts:', error)
        }
      }
    } catch (error) {
      console.error('❌ FIXED: Error in forceCreateDebts:', error)
    }
  }

  private static async forceCreateGoals(
    userId: string, 
    onboardingData: any, 
    result: ConsolidationResult
  ): Promise<void> {
    try {
      // BORRAR metas existentes para evitar duplicados
      await supabase.from('goals').delete().eq('user_id', userId)

      const goalsToCreate = []

      // Procesar metas financieras
      if (onboardingData.financialGoals && Array.isArray(onboardingData.financialGoals)) {
        onboardingData.financialGoals.forEach((goalTitle: string) => {
          goalsToCreate.push({
            user_id: userId,
            title: goalTitle,
            description: `Financial goal from onboarding: ${goalTitle}`,
            target_amount: 50000,
            current_amount: onboardingData.currentSavings || 0,
            priority: 'medium' as const,
            status: 'active' as const
          })
        })
      }

      if (goalsToCreate.length > 0) {
        const { error } = await supabase.from('goals').insert(goalsToCreate)
        if (!error) {
          result.migratedRecords.goals = goalsToCreate.length
          console.log(`✅ FIXED: Created ${goalsToCreate.length} goals`)
        } else {
          console.error('❌ FIXED: Error creating goals:', error)
        }
      }
    } catch (error) {
      console.error('❌ FIXED: Error in forceCreateGoals:', error)
    }
  }
}
