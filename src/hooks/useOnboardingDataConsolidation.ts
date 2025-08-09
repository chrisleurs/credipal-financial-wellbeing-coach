
import { useFinancialStore } from '@/store/financialStore'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export const useOnboardingDataConsolidation = () => {
  const { user } = useAuth()
  
  const consolidateOnboardingData = async () => {
    try {
      if (!user?.id) {
        console.error('No user ID found')
        return false
      }
      
      const store = useFinancialStore.getState()
      const financialData = store.financialData
      
      console.log('📊 Consolidating data for user:', user.id)
      console.log('💾 Financial data to save:', financialData)
      
      // 1. Guardar en user_financial_data
      const consolidatedData = {
        user_id: user.id,
        ingresos: financialData.monthlyIncome || 0,
        ingresos_extras: financialData.extraIncome || 0,
        gastos_totales: financialData.monthlyExpenses || 0,
        gastos_categorizados: Object.entries(financialData.expenseCategories || {}).map(([category, amount]) => ({
          category: category,
          subcategory: category,
          amount: amount
        })),
        deudas: financialData.debts || [],
        ahorros_actuales: financialData.currentSavings || 0,
        capacidad_ahorro: financialData.monthlySavingsCapacity || 0,
        metas_financieras: financialData.financialGoals || []
      }
      
      const { error: dataError } = await supabase
        .from('user_financial_data')
        .upsert(consolidatedData, { onConflict: 'user_id' })
      
      if (dataError) {
        console.error('Error saving user_financial_data:', dataError)
        throw dataError
      }
      
      // 2. Guardar deudas en tabla debts
      if (financialData.debts && financialData.debts.length > 0) {
        const debtsToInsert = financialData.debts.map((debt) => ({
          user_id: user.id,
          creditor_name: debt.name,
          total_amount: debt.amount,
          current_balance: debt.amount,
          minimum_payment: debt.monthlyPayment,
          due_day: debt.paymentDueDate || 1,
          annual_interest_rate: 0,
          description: `Term: ${debt.termInMonths || 0} months`
        }))
        
        const { error: debtsError } = await supabase
          .from('debts')
          .insert(debtsToInsert)
        
        if (debtsError && !debtsError.message.includes('duplicate')) {
          console.error('Error saving debts:', debtsError)
        }
      }
      
      // 3. Guardar goals en tabla goals
      if (financialData.financialGoals && financialData.financialGoals.length > 0) {
        const goalsToInsert = financialData.financialGoals.map((goal) => ({
          user_id: user.id,
          goal_name: goal,
          target_amount: 0,
          current_amount: 0,
          status: 'pending',
          priority: 'medium'
        }))
        
        const { error: goalsError } = await supabase
          .from('goals')
          .insert(goalsToInsert)
        
        if (goalsError && !goalsError.message.includes('duplicate')) {
          console.error('Error saving goals:', goalsError)
        }
      }
      
      // 4. Migrar gastos de onboarding_expenses a expenses
      const { data: onboardingExpenses } = await supabase
        .from('onboarding_expenses')
        .select('*')
        .eq('user_id', user.id)
      
      if (onboardingExpenses && onboardingExpenses.length > 0) {
        const expensesToInsert = onboardingExpenses.map((exp) => ({
          user_id: user.id,
          amount: exp.amount || 0,
          category: exp.category || 'Other',
          description: exp.subcategory || '',
          date: new Date().toISOString(),
          is_recurring: true
        }))
        
        const { error: expensesError } = await supabase
          .from('expenses')
          .insert(expensesToInsert)
        
        if (expensesError && !expensesError.message.includes('duplicate')) {
          console.error('Error migrating expenses:', expensesError)
        }
      }
      
      // 5. Marcar onboarding como completado
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id)
      
      console.log('✅ Onboarding data consolidated successfully')
      return true
      
    } catch (error) {
      console.error('❌ Error consolidating onboarding data:', error)
      return false
    }
  }
  
  return {
    consolidateOnboardingData
  }
}
