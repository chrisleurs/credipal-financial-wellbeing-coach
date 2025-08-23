
/**
 * Hook optimizado para consolidación de datos del onboarding
 * Reemplaza useOnboardingDataConsolidation con mejor performance
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'
import { useFinancialStore } from '@/store/financialStore'
import { DataConsolidationService } from '@/services/dataConsolidationService'

export const useOptimizedOnboardingConsolidation = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { financialData } = useFinancialStore()

  const consolidationMutation = useMutation({
    mutationFn: async (markCompleted: boolean = false) => {
      if (!user?.id) throw new Error('User not authenticated')
      
      return DataConsolidationService.consolidateUserData(
        user.id, 
        financialData, 
        markCompleted
      )
    },
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate all financial data queries
        queryClient.invalidateQueries({ 
          predicate: (query) => {
            const key = query.queryKey[0] as string
            return key.includes('financial') || key.includes('income') || 
                   key.includes('expense') || key.includes('debt') || key.includes('goal')
          }
        })

        toast({
          title: "¡Datos consolidados exitosamente!",
          description: `Migrados: ${result.migratedRecords.expenses} gastos, ${result.migratedRecords.incomes} ingresos, ${result.migratedRecords.debts} deudas, ${result.migratedRecords.goals} metas`,
        })
      } else {
        throw new Error(result.errors.join(', '))
      }
    },
    onError: (error) => {
      console.error('Consolidation error:', error)
      toast({
        title: "Error en consolidación",
        description: "Hubo un problema al procesar tus datos. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  return {
    consolidateData: consolidationMutation.mutate,
    isConsolidating: consolidationMutation.isPending,
    error: consolidationMutation.error
  }
}
