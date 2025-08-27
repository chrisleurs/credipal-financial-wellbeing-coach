
/**
 * Servicio centralizado para consolidación de datos
 * Optimiza el flujo del onboarding al dashboard
 */

import { supabase } from '@/integrations/supabase/client'
import { FinancialData } from '@/types/unified'

export interface ConsolidationResult {
  success: boolean
  migratedRecords: {
    expenses: number
    incomes: number
    debts: number
    goals: number
  }
  errors: string[]
}

export class DataConsolidationService {
  static async consolidateUserData(
    userId: string, 
    onboardingData: Partial<FinancialData>,
    markCompleted: boolean = false
  ): Promise<ConsolidationResult> {
    const result: ConsolidationResult = {
      success: false,
      migratedRecords: { expenses: 0, incomes: 0, debts: 0, goals: 0 },
      errors: []
    }

    try {
      console.log('🔄 Starting optimized data consolidation for user:', userId)
      console.log('📊 Onboarding data received:', onboardingData)

      // 1. Migrate expenses (from onboarding_expenses + categories)
      const expensesCount = await this.migrateExpenses(userId, onboardingData)
      result.migratedRecords.expenses = expensesCount

      // 2. Migrate incomes (CRITICAL - this was missing proper handling)
      const incomesCount = await this.migrateIncomes(userId, onboardingData)
      result.migratedRecords.incomes = incomesCount

      // 3. Migrate debts (if any)
      const debtsCount = await this.migrateDebts(userId, onboardingData)
      result.migratedRecords.debts = debtsCount

      // 4. Migrate goals
      const goalsCount = await this.migrateGoals(userId, onboardingData)
      result.migratedRecords.goals = goalsCount

      // 5. Clean up temporary data
      await this.cleanupTemporaryData(userId)

      // 6. Mark onboarding as completed if requested
      if (markCompleted) {
        await this.markOnboardingCompleted(userId)
      }

      // 7. Trigger financial summary recalculation
      await supabase.rpc('calculate_financial_summary', { target_user_id: userId })

      result.success = true
      console.log('✅ Data consolidation completed successfully', result.migratedRecords)

    } catch (error) {
      console.error('❌ Error during data consolidation:', error)
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return result
  }

  private static async migrateExpenses(
    userId: string, 
    onboardingData: Partial<FinancialData>
  ): Promise<number> {
    let migratedCount = 0

    try {
      // Get detailed expenses from onboarding_expenses table
      const { data: onboardingExpenses } = await supabase
        .from('onboarding_expenses')
        .select('*')
        .eq('user_id', userId)

      const expensesToCreate = []

      if (onboardingExpenses && onboardingExpenses.length > 0) {
        // Use detailed expenses
        for (const expense of onboardingExpenses) {
          expensesToCreate.push({
            user_id: userId,
            amount: expense.amount,
            category: expense.category,
            subcategory: expense.subcategory,
            description: expense.subcategory || expense.category,
            date: new Date().toISOString().split('T')[0],
            is_recurring: true
          })
        }
      } else if (onboardingData.expenseCategories) {
        // Use category totals as fallback
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
              user_id: userId,
              amount: amount,
              category: categoryMapping[key] || 'Otros',
              subcategory: 'Presupuesto Mensual',
              description: `Gastos mensuales en ${categoryMapping[key] || key}`,
              date: new Date().toISOString().split('T')[0],
              is_recurring: true
            })
          }
        })
      }

      if (expensesToCreate.length > 0) {
        const { error } = await supabase.from('expenses').insert(expensesToCreate)
        if (!error) {
          migratedCount = expensesToCreate.length
          console.log(`✅ Migrated ${migratedCount} expenses`)
        } else {
          console.error('❌ Error migrating expenses:', error)
        }
      }
    } catch (error) {
      console.error('❌ Error in migrateExpenses:', error)
    }

    return migratedCount
  }

  private static async migrateIncomes(
    userId: string, 
    onboardingData: Partial<FinancialData>
  ): Promise<number> {
    let migratedCount = 0

    try {
      console.log('💰 Migrating incomes for user:', userId)
      console.log('💰 Income data:', {
        monthlyIncome: onboardingData.monthlyIncome,
        extraIncome: onboardingData.extraIncome
      })

      const incomesToCreate = []

      // Primary income
      if (onboardingData.monthlyIncome && onboardingData.monthlyIncome > 0) {
        incomesToCreate.push({
          user_id: userId,
          source_name: 'Ingreso Principal',
          amount: onboardingData.monthlyIncome,
          frequency: 'monthly',
          is_active: true
        })
      }

      // Extra income
      if (onboardingData.extraIncome && onboardingData.extraIncome > 0) {
        incomesToCreate.push({
          user_id: userId,
          source_name: 'Ingresos Adicionales',
          amount: onboardingData.extraIncome,
          frequency: 'monthly',
          is_active: true
        })
      }

      if (incomesToCreate.length > 0) {
        console.log('💰 Creating income sources:', incomesToCreate)
        
        const { error } = await supabase.from('income_sources').insert(incomesToCreate)
        if (!error) {
          migratedCount = incomesToCreate.length
          console.log(`✅ Migrated ${migratedCount} income sources`)
        } else {
          console.error('❌ Error migrating incomes:', error)
        }
      } else {
        console.log('⚠️ No income data to migrate')
      }
    } catch (error) {
      console.error('❌ Error in migrateIncomes:', error)
    }

    return migratedCount
  }

  private static async migrateDebts(
    userId: string, 
    onboardingData: Partial<FinancialData>
  ): Promise<number> {
    let migratedCount = 0

    try {
      if (onboardingData.debts && onboardingData.debts.length > 0) {
        const debtsToCreate = onboardingData.debts.map(debt => ({
          user_id: userId,
          creditor: debt.name || 'Acreedor',
          original_amount: debt.amount || 0,
          current_balance: debt.amount || 0,
          monthly_payment: debt.monthlyPayment || 0,
          interest_rate: 0, // Default, user can update later
          status: 'active' as const
        }))

        const { error } = await supabase.from('debts').insert(debtsToCreate)
        if (!error) {
          migratedCount = debtsToCreate.length
          console.log(`✅ Migrated ${migratedCount} debts`)
        } else {
          console.error('❌ Error migrating debts:', error)
        }
      }
    } catch (error) {
      console.error('❌ Error in migrateDebts:', error)
    }

    return migratedCount
  }

  private static async migrateGoals(
    userId: string, 
    onboardingData: Partial<FinancialData>
  ): Promise<number> {
    let migratedCount = 0

    try {
      if (onboardingData.financialGoals && onboardingData.financialGoals.length > 0) {
        const goalsToCreate = onboardingData.financialGoals.map(goalTitle => ({
          user_id: userId,
          title: goalTitle,
          description: `Meta establecida durante el onboarding: ${goalTitle}`,
          target_amount: onboardingData.monthlySavingsCapacity ? onboardingData.monthlySavingsCapacity * 12 : 10000,
          current_amount: onboardingData.currentSavings || 0,
          priority: 'medium' as const,
          status: 'active' as const
        }))

        const { error } = await supabase.from('goals').insert(goalsToCreate)
        if (!error) {
          migratedCount = goalsToCreate.length
          console.log(`✅ Migrated ${migratedCount} goals`)
        } else {
          console.error('❌ Error migrating goals:', error)
        }
      }
    } catch (error) {
      console.error('❌ Error in migrateGoals:', error)
    }

    return migratedCount
  }

  private static async cleanupTemporaryData(userId: string): Promise<void> {
    try {
      // Clean up onboarding expenses
      await supabase.from('onboarding_expenses').delete().eq('user_id', userId)
      console.log('🧹 Cleaned up temporary onboarding data')
    } catch (error) {
      console.error('❌ Error cleaning up temporary data:', error)
    }
  }

  private static async markOnboardingCompleted(userId: string): Promise<void> {
    try {
      await supabase.from('profiles').update({
        onboarding_completed: true,
        onboarding_step: 0,
        onboarding_data: {}
      }).eq('user_id', userId)
      
      console.log('✅ Marked onboarding as completed')
    } catch (error) {
      console.error('❌ Error marking onboarding completed:', error)
    }
  }
}
