
import type { FinancialData, AIGeneratedPlan, ActionPlan } from '@/types'
import { supabase } from '@/integrations/supabase/client'

// Real OpenAI service implementation using Supabase edge functions
export async function generateFinancialPlan(data: FinancialData): Promise<AIGeneratedPlan> {
  console.log('Generating financial plan with real AI:', data)
  
  try {
    const { data: result, error } = await supabase.functions.invoke('generate-financial-plan', {
      body: { financialData: data }
    })

    if (error) {
      console.error('Error calling OpenAI function:', error)
      throw new Error(`Failed to generate plan: ${error.message}`)
    }

    return {
      recommendations: result.recommendations || [
        'Crea un presupuesto 50/30/20: 50% gastos esenciales, 30% gastos personales, 20% ahorros',
        'Establece un fondo de emergencia equivalente a 3-6 meses de gastos',
        'Paga primero las deudas con mayor tasa de interés',
        'Automatiza tus ahorros para que se transfieran automáticamente'
      ],
      monthlyBalance: result.monthlyBalance || (data.monthlyIncome + data.extraIncome - data.monthlyExpenses),
      savingsSuggestion: result.savingsSuggestion || Math.max((data.monthlyIncome + data.extraIncome - data.monthlyExpenses) * 0.2, 0),
      budgetBreakdown: result.budgetBreakdown || {
        fixedExpenses: data.monthlyExpenses * 0.6,
        variableExpenses: data.monthlyExpenses * 0.4,
        savings: Math.max((data.monthlyIncome + data.extraIncome - data.monthlyExpenses) * 0.2, 0),
        emergency: Math.max((data.monthlyIncome + data.extraIncome - data.monthlyExpenses) * 0.1, 0)
      },
      timeEstimate: result.timeEstimate || '6-12 meses para ver resultados significativos',
      motivationalMessage: result.motivationalMessage || '¡Estás en el camino correcto! Con disciplina y estos ajustes, mejorarás tu situación financiera.'
    }
  } catch (error) {
    console.error('Error generating financial plan:', error)
    throw new Error('No se pudo generar el plan financiero. Intenta nuevamente.')
  }
}

export async function generateActionPlan(data: FinancialData): Promise<ActionPlan> {
  console.log('Generating action plan with real AI:', data)
  
  try {
    const { data: result, error } = await supabase.functions.invoke('generate-action-plan', {
      body: { 
        financialPlan: await generateFinancialPlan(data),
        userData: data 
      }
    })

    if (error) {
      console.error('Error calling OpenAI action plan function:', error)
      throw new Error(`Failed to generate action plan: ${error.message}`)
    }

    return {
      tasks: result.tasks || [
        {
          id: '1',
          title: 'Registrar gastos diarios',
          description: 'Anota todos tus gastos durante una semana',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: false
        }
      ],
      nextReviewDate: result.nextReviewDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      whatsappReminders: data.whatsappOptin
    }
  } catch (error) {
    console.error('Error generating action plan:', error)
    throw new Error('No se pudo generar el plan de acción. Intenta nuevamente.')
  }
}

// Enhanced interfaces for real-time assistance
export interface ChatAIResponse {
  message: string;
  functionExecuted?: string;
  functionResult?: any;
  suggestions?: string[];
}

export interface FinancialInsight {
  type: 'alert' | 'celebration' | 'suggestion' | 'trend';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

// Function to save generated plan to Supabase
export async function saveFinancialPlan(plan: AIGeneratedPlan, userId: string): Promise<void> {
  const { error } = await supabase
    .from('financial_plans')
    .upsert({
      user_id: userId,
      plan_data: plan,
      recommendations: plan.recommendations,
      monthly_balance: plan.monthlyBalance,
      savings_suggestion: plan.savingsSuggestion,
      status: 'active'
    })

  if (error) {
    throw new Error(`Failed to save plan: ${error.message}`)
  }
}
