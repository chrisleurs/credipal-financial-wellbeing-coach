
import { supabase } from '@/integrations/supabase/client'
import { Income } from '@/types/income'

export const getIncomes = async (userId: string): Promise<{ data: Income[] | null, error: any }> => {
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const insertIncome = async (income: {
  user_id: string
  source: string
  amount: number
  frequency: string
}): Promise<{ data: Income | null, error: any }> => {
  const { data, error } = await supabase
    .from('incomes')
    .insert(income)
    .select()
    .single()
  
  return { data, error }
}

export const updateIncome = async (id: string, updates: Partial<Income>): Promise<{ data: Income | null, error: any }> => {
  const { data, error } = await supabase
    .from('incomes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export const deleteIncome = async (id: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('incomes')
    .update({ is_active: false })
    .eq('id', id)
  
  return { error }
}

export const getTotalMonthlyIncome = (incomes: Income[]): number => {
  return incomes.reduce((sum, inc) => {
    const multiplier = inc.frequency === 'weekly' ? 4 : 
                      inc.frequency === 'biweekly' ? 2 : 1
    return sum + (inc.amount * multiplier)
  }, 0)
}
