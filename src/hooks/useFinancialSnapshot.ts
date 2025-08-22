
import { useMemo } from 'react'
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData'
import { useAuth } from './useAuth'

export interface FinancialSnapshot {
  dineroDisponible: number
  porcentajeHaciaMeta: number
  mensajeMotivador: string
  tieneIngresosSuficientes: boolean
  necesitaOptimizacion: boolean
}

export const useFinancialSnapshot = (): { snapshot: FinancialSnapshot | null, isLoading: boolean } => {
  const { consolidatedData, isLoading } = useConsolidatedFinancialData()
  const { user } = useAuth()

  const snapshot = useMemo((): FinancialSnapshot | null => {
    if (!consolidatedData || isLoading) return null

    // Cálculo principal: dinero disponible
    const dineroDisponible = consolidatedData.monthlyIncome - consolidatedData.monthlyExpenses - consolidatedData.totalMonthlyDebtPayments

    // Cálculo del porcentaje hacia meta (usando datos disponibles)
    let porcentajeHaciaMeta = 0
    if (consolidatedData.currentSavings > 0) {
      // Usar una meta estimada basada en 6 meses de gastos si no hay metas específicas
      const metaEstimada = consolidatedData.monthlyExpenses * 6
      porcentajeHaciaMeta = Math.min((consolidatedData.currentSavings / metaEstimada) * 100, 100)
    }

    // Lógica de mensajes motivadores
    const getMensajeMotivador = (dinero: number): string => {
      if (dinero > 500) return "¡Excelente! Vas por buen camino 🚀"
      if (dinero > 0) return "¡Bien! Sigues en control 💪"
      if (dinero === 0) return "Ajustemos tu plan para optimizar 💪"
      return "Identifiqué oportunidades de mejora 🎯"
    }

    // Indicadores adicionales
    const tieneIngresosSuficientes = consolidatedData.monthlyIncome > consolidatedData.monthlyExpenses
    const necesitaOptimizacion = dineroDisponible < 0

    return {
      dineroDisponible,
      porcentajeHaciaMeta,
      mensajeMotivador: getMensajeMotivador(dineroDisponible),
      tieneIngresosSuficientes,
      necesitaOptimizacion
    }
  }, [consolidatedData, isLoading])

  return { snapshot, isLoading }
}
