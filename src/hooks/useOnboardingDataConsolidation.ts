
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { FinancialData } from '@/types/unified'

export const useOnboardingDataConsolidation = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  const onboardingData = useQuery({
    queryKey: ['onboarding-data', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_completed')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  const consolidateOnboardingData = async (isCompleting: boolean = false) => {
    if (!user?.id) {
      console.error('User not authenticated for data consolidation')
      return
    }

    try {
      console.log('🔄 Starting onboarding data consolidation...')
      
      // 1. Get current onboarding data from store and type it properly
      const rawOnboardingData = onboardingData.data?.onboarding_data
      
      // Type guard to ensure we have a valid object - convert via unknown first
      const onboardingDataFromProfile: Partial<FinancialData> = 
        rawOnboardingData && typeof rawOnboardingData === 'object' && !Array.isArray(rawOnboardingData)
          ? (rawOnboardingData as unknown) as FinancialData
          : {}
      
      console.log('Onboarding data from profile:', onboardingDataFromProfile)

      // 2. Get existing onboarding expenses
      const { data: existingOnboardingExpenses, error: expensesError } = await supabase
        .from('onboarding_expenses')
        .select('*')
        .eq('user_id', user.id)

      if (expensesError) {
        console.error('Error fetching onboarding expenses:', expensesError)
      }

      // 3. Create basic expenses if none exist
      const expensesToCreate = []
      
      // If we have detailed expenses from onboarding_expenses, use those
      if (existingOnboardingExpenses && existingOnboardingExpenses.length > 0) {
        console.log('Found detailed onboarding expenses, migrating to main expenses table...')
        
        for (const expense of existingOnboardingExpenses) {
          expensesToCreate.push({
            user_id: user.id,
            amount: expense.amount,
            category: expense.category,
            subcategory: expense.subcategory,
            description: expense.subcategory || expense.category,
            date: new Date().toISOString().split('T')[0],
            is_recurring: true // Assume onboarding expenses are monthly recurring
          })
        }
      } 
      // If we have category totals from store, create basic expenses
      else if (onboardingDataFromProfile.expenseCategories && typeof onboardingDataFromProfile.expenseCategories === 'object') {
        console.log('Found expense categories from store, creating basic expenses...')
        
        const categoryMapping: Record<string, string> = {
          'food': 'Food & Dining',
          'transport': 'Transportation',
          'housing': 'Housing & Utilities',
          'bills': 'Bills & Services',
          'entertainment': 'Entertainment'
        }

        Object.entries(onboardingDataFromProfile.expenseCategories).forEach(([key, amount]) => {
          if (typeof amount === 'number' && amount > 0) {
            expensesToCreate.push({
              user_id: user.id,
              amount: amount,
              category: categoryMapping[key] || 'Other',
              subcategory: 'Monthly Budget',
              description: `Monthly ${categoryMapping[key] || key} expenses`,
              date: new Date().toISOString().split('T')[0],
              is_recurring: true
            })
          }
        })
      }
      // Fallback: Create minimal expenses if nothing exists
      else if (typeof onboardingDataFromProfile.monthlyExpenses === 'number' && onboardingDataFromProfile.monthlyExpenses > 0) {
        console.log('Creating fallback basic expense from total amount...')
        
        expensesToCreate.push({
          user_id: user.id,
          amount: onboardingDataFromProfile.monthlyExpenses,
          category: 'Other',
          subcategory: 'Monthly Total',
          description: 'Total monthly expenses from onboarding',
          date: new Date().toISOString().split('T')[0],
          is_recurring: true
        })
      }

      // 4. Insert expenses into main expenses table
      if (expensesToCreate.length > 0) {
        console.log(`Inserting ${expensesToCreate.length} expenses into main table...`)
        
        const { error: insertError } = await supabase
          .from('expenses')
          .insert(expensesToCreate)

        if (insertError) {
          console.error('Error inserting consolidated expenses:', insertError)
        } else {
          console.log('✅ Successfully migrated expenses to main table')
        }
      }

      // 5. Create income sources if they exist
      if (typeof onboardingDataFromProfile.monthlyIncome === 'number' && onboardingDataFromProfile.monthlyIncome > 0) {
        console.log('Creating income source from onboarding data...')
        
        const { error: incomeError } = await supabase
          .from('income_sources')
          .insert({
            user_id: user.id,
            source_name: 'Primary Income',
            amount: onboardingDataFromProfile.monthlyIncome,
            frequency: 'monthly',
            is_active: true
          })

        if (incomeError) {
          console.error('Error creating income source:', incomeError)
        } else {
          console.log('✅ Successfully created income source')
        }

        // Add extra income if it exists
        if (typeof onboardingDataFromProfile.extraIncome === 'number' && onboardingDataFromProfile.extraIncome > 0) {
          const { error: extraIncomeError } = await supabase
            .from('income_sources')
            .insert({
              user_id: user.id,
              source_name: 'Additional Income',
              amount: onboardingDataFromProfile.extraIncome,
              frequency: 'monthly',
              is_active: true
            })

          if (extraIncomeError) {
            console.error('Error creating extra income source:', extraIncomeError)
          }
        }
      }

      // 6. Create goals if they exist
      if (Array.isArray(onboardingDataFromProfile.financialGoals) && onboardingDataFromProfile.financialGoals.length > 0) {
        console.log('Creating goals from onboarding data...')
        
        const goalsToCreate = onboardingDataFromProfile.financialGoals.map((goalTitle: string) => ({
          user_id: user.id,
          title: goalTitle,
          description: `Goal set during onboarding: ${goalTitle}`,
          target_amount: (typeof onboardingDataFromProfile.monthlySavingsCapacity === 'number' ? onboardingDataFromProfile.monthlySavingsCapacity * 12 : 10000),
          current_amount: (typeof onboardingDataFromProfile.currentSavings === 'number' ? onboardingDataFromProfile.currentSavings : 0),
          priority: 'medium' as const,
          status: 'active' as const
        }))

        const { error: goalsError } = await supabase
          .from('goals')
          .insert(goalsToCreate)

        if (goalsError) {
          console.error('Error creating goals:', goalsError)
        } else {
          console.log('✅ Successfully created goals')
        }
      }

      // 7. Clean up onboarding expenses after migration
      if (existingOnboardingExpenses && existingOnboardingExpenses.length > 0) {
        console.log('Cleaning up onboarding expenses table...')
        
        const { error: cleanupError } = await supabase
          .from('onboarding_expenses')
          .delete()
          .eq('user_id', user.id)

        if (cleanupError) {
          console.error('Error cleaning up onboarding expenses:', cleanupError)
        } else {
          console.log('✅ Successfully cleaned up onboarding expenses')
        }
      }

      // 8. If completing onboarding, mark as completed
      if (isCompleting) {
        console.log('Marking onboarding as completed...')
        
        const { error: completionError } = await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            onboarding_step: 0, // Reset step
            onboarding_data: {} // Clear temporary data
          })
          .eq('user_id', user.id)

        if (completionError) {
          console.error('Error marking onboarding as completed:', completionError)
        } else {
          console.log('✅ Onboarding marked as completed')
        }
      }

      console.log('🎉 Data consolidation completed successfully!')
      
      toast({
        title: "¡Datos consolidados!",
        description: "Tu información financiera ha sido procesada exitosamente.",
      })

    } catch (error) {
      console.error('Error during data consolidation:', error)
      toast({
        title: "Error en consolidación",
        description: "Hubo un problema al procesar tus datos. Por favor intenta nuevamente.",
        variant: "destructive"
      })
    }
  }

  return {
    onboarding_data: onboardingData.data?.onboarding_data || {},
    isCompleted: onboardingData.data?.onboarding_completed || false,
    isLoading: onboardingData.isLoading,
    error: onboardingData.error,
    consolidateOnboardingData
  }
}
