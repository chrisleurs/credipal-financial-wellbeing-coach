
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useFinancialStore } from '@/store/financialStore'
import { useOnboardingExpenses } from './useOnboardingExpenses'
import { useToast } from './use-toast'

export const useOnboardingDataConsolidation = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const { expenses: onboardingExpenses } = useOnboardingExpenses()

  const consolidateOnboardingData = async () => {
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    console.log('🔄 Iniciando consolidación de datos del onboarding...')
    
    try {
      // Obtener datos del store de Zustand
      const financialStore = useFinancialStore.getState()
      console.log('📊 Datos del financial store:', financialStore)
      console.log('📋 Gastos del onboarding:', onboardingExpenses)

      // 1. Preparar gastos categorizados desde onboarding_expenses
      const gastosCategorizados = onboardingExpenses.map(expense => ({
        category: expense.category,
        subcategory: expense.subcategory,
        amount: expense.amount
      }))

      const gastosTotales = onboardingExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      // 2. Consolidar todos los datos en user_financial_data
      const consolidatedData = {
        user_id: user.id,
        ingresos: financialStore.financialData?.monthlyIncome || 0,
        ingresos_extras: financialStore.financialData?.extraIncome || 0,
        gastos_totales: gastosTotales,
        gastos_categorizados: gastosCategorizados,
        deudas: financialStore.financialData?.debts || [],
        ahorros_actuales: financialStore.financialData?.currentSavings || 0,
        capacidad_ahorro: financialStore.financialData?.monthlySavingsCapacity || 0,
        metas_financieras: financialStore.financialData?.financialGoals || [],
        ahorros: {
          actual: financialStore.financialData?.currentSavings || 0,
          mensual: financialStore.financialData?.monthlySavingsCapacity || 0
        },
        metas: financialStore.financialData?.financialGoals || [],
        user_data: {
          whatsapp_opt_in: financialStore.whatsAppOptIn || false,
          onboarding_completed: true
        }
      }

      console.log('💾 Datos consolidados a guardar:', consolidatedData)

      // 3. Guardar en user_financial_data usando upsert
      const { error: dataError } = await supabase
        .from('user_financial_data')
        .upsert(consolidatedData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })

      if (dataError) {
        console.error('❌ Error guardando user_financial_data:', dataError)
        throw dataError
      }

      console.log('✅ Datos consolidados guardados en user_financial_data')

      // 4. Guardar deudas en tabla debts si existen
      const debts = financialStore.financialData?.debts || []
      if (debts.length > 0) {
        console.log('🏦 Guardando deudas:', debts)
        
        const debtsToInsert = debts.map(debt => ({
          user_id: user.id,
          creditor_name: debt.name || 'Deuda',
          total_amount: debt.amount || 0,
          current_balance: debt.amount || 0,
          minimum_payment: debt.monthlyPayment || 0,
          due_day: debt.paymentDueDate || 1,
          annual_interest_rate: 0,
          description: ''
        }))

        const { error: debtsError } = await supabase
          .from('debts')
          .insert(debtsToInsert)

        if (debtsError) {
          console.error('❌ Error guardando deudas:', debtsError)
          // No lanzamos error aquí, las deudas son opcionales
        } else {
          console.log('✅ Deudas guardadas exitosamente')
        }
      }

      // 5. Guardar metas en tabla goals si existen
      const goals = financialStore.financialData?.financialGoals || []
      if (goals.length > 0) {
        console.log('🎯 Guardando metas:', goals)
        
        const goalsToInsert = goals.map((goal, index) => ({
          user_id: user.id,
          goal_name: goal || `Meta ${index + 1}`,
          goal_type: 'financial',
          target_amount: 0,
          current_amount: 0,
          target_date: null,
          priority: 'medium',
          status: 'active'
        }))

        const { error: goalsError } = await supabase
          .from('goals')
          .insert(goalsToInsert)

        if (goalsError) {
          console.error('❌ Error guardando metas:', goalsError)
          // No lanzamos error aquí, las metas son opcionales
        } else {
          console.log('✅ Metas guardadas exitosamente')
        }
      }

      // 6. Marcar onboarding como completado en profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          onboarding_step: 6 
        })
        .eq('user_id', user.id)

      if (profileError) {
        console.error('❌ Error actualizando perfil:', profileError)
        throw profileError
      }

      console.log('✅ Onboarding marcado como completado')

      toast({
        title: "¡Datos consolidados!",
        description: "Tu información financiera ha sido guardada exitosamente.",
      })

      return { success: true }

    } catch (error) {
      console.error('❌ Error en consolidación:', error)
      toast({
        title: "Error",
        description: "Hubo un problema guardando tus datos. Intenta de nuevo.",
        variant: "destructive"
      })
      throw error
    }
  }

  return {
    consolidateOnboardingData
  }
}
