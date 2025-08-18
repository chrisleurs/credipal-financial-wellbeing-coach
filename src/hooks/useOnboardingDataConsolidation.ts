
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
      
      // 1. Save income sources
      if (financialData.monthlyIncome > 0) {
        await supabase
          .from('income_sources')
          .insert({
            user_id: user.id,
            source_name: 'Ingresos principales',
            amount: financialData.monthlyIncome,
            frequency: 'monthly',
            is_active: true
          })
      }

      // 2. Save expenses
      if (financialData.expenseCategories) {
        const expensesToInsert = Object.entries(financialData.expenseCategories).map(([category, amount]) => ({
          user_id: user.id,
          category: category,
          subcategory: category,
          amount: amount as number,
          date: new Date().toISOString().split('T')[0],
          description: `Onboarding expense for ${category}`,
          is_recurring: true
        }))
        
        if (expensesToInsert.length > 0) {
          await supabase
            .from('expenses')
            .insert(expensesToInsert)
        }
      }
      
      // 3. Save debts
      if (financialData.debts && financialData.debts.length > 0) {
        const debtsToInsert = financialData.debts.map((debt) => ({
          user_id: user.id,
          creditor: debt.name,
          original_amount: debt.amount,
          current_balance: debt.amount,
          monthly_payment: debt.monthlyPayment,
          interest_rate: 0,
          status: 'active' as const
        }))
        
        await supabase
          .from('debts')
          .insert(debtsToInsert)
      }
      
      // 4. Save goals
      if (financialData.financialGoals && financialData.financialGoals.length > 0) {
        const goalsToInsert = financialData.financialGoals.map((goal) => ({
          user_id: user.id,
          title: goal,
          description: `Meta financiera: ${goal}`,
          target_amount: 0, // Would need more data from onboarding
          current_amount: 0,
          priority: 'medium' as const,
          status: 'active' as const
        }))
        
        await supabase
          .from('goals')
          .insert(goalsToInsert)
      }
      
      // 5. Mark onboarding as completed
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
