
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'
import type { FinancialSummary } from '@/types/database'

export const useFinancialSummary = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch financial summary
  const {
    data: financialSummary,
    isLoading,
    error
  } = useQuery({
    queryKey: ['financial-summary', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('financial_summary')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (error) throw error
      return data as FinancialSummary | null
    },
    enabled: !!user?.id,
  })

  // Manually trigger calculation
  const recalculateMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { error } = await supabase.rpc('calculate_financial_summary', {
        target_user_id: user.id
      })
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] })
      toast({
        title: "Resumen actualizado",
        description: "Tu resumen financiero se ha recalculado exitosamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo recalcular el resumen financiero.",
        variant: "destructive",
      })
    },
  })

  return {
    financialSummary,
    isLoading,
    error,
    recalculate: recalculateMutation.mutate,
    isRecalculating: recalculateMutation.isPending,
  }
}
