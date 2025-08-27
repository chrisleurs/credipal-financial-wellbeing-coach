
import { useMemo } from 'react'
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData'

export interface Plan321Milestone {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  progress: number
  estimatedMonths: number
  priority: 'high' | 'medium' | 'low'
  icon: string
  color: string
}

export const usePlan321Generator = () => {
  const { consolidatedData, isLoading } = useConsolidatedFinancialData()

  const milestones = useMemo((): Plan321Milestone[] => {
    if (!consolidatedData) return []

    const milestones: Plan321Milestone[] = []
    const dineroDisponible = Math.max(0, consolidatedData.savingsCapacity)

    // Hito 1: Eliminar deuda prioritaria
    if (consolidatedData.debts.length > 0) {
      // Seleccionar deuda prioritaria (menor balance para pagar más rápido)
      const deudaPrioritaria = consolidatedData.debts.reduce((prev, current) => {
        return current.balance < prev.balance ? current : prev
      })

      const mesesParaEliminar = dineroDisponible > 0 
        ? Math.ceil(deudaPrioritaria.balance / dineroDisponible)
        : 12 // Default si no hay dinero disponible

      milestones.push({
        id: 'debt-elimination',
        title: 'Eliminar Deuda Prioritaria',
        description: `Eliminar deuda con ${deudaPrioritaria.creditor}`,
        targetAmount: deudaPrioritaria.balance,
        currentAmount: 0,
        progress: 0,
        estimatedMonths: Math.min(mesesParaEliminar, 24), // Máximo 24 meses
        priority: 'high',
        icon: '💳',
        color: 'text-red-600'
      })
    }

    // Hito 2: Fondo de emergencia
    const fondoEmergencia = consolidatedData.monthlyExpenses * 3
    const mesesFondoEmergencia = dineroDisponible > 0 
      ? Math.ceil(fondoEmergencia / dineroDisponible)
      : 18 // Default si no hay dinero disponible

    milestones.push({
      id: 'emergency-fund',
      title: 'Fondo de Emergencia',
      description: '3 meses de gastos para imprevistos',
      targetAmount: fondoEmergencia,
      currentAmount: consolidatedData.currentSavings,
      progress: fondoEmergencia > 0 ? Math.min((consolidatedData.currentSavings / fondoEmergencia) * 100, 100) : 0,
      estimatedMonths: Math.min(mesesFondoEmergencia, 18), // Máximo 18 meses
      priority: consolidatedData.debts.length > 0 ? 'medium' : 'high',
      icon: '🛡️',
      color: 'text-blue-600'
    })

    // Hito 3: Ahorro/Inversión
    const ahorroMensual = consolidatedData.monthlyIncome * 0.10 // 10% de ingresos
    const metaAhorro = ahorroMensual * 12 // Meta de 1 año de ahorro

    milestones.push({
      id: 'savings-investment',
      title: 'Ahorro e Inversión',
      description: 'Construir patrimonio a largo plazo',
      targetAmount: metaAhorro,
      currentAmount: 0,
      progress: 0,
      estimatedMonths: 12, // Objetivo a 12 meses
      priority: 'medium',
      icon: '📈',
      color: 'text-green-600'
    })

    return milestones
  }, [consolidatedData])

  const totalProgress = milestones.length > 0 
    ? milestones.reduce((sum, milestone) => sum + milestone.progress, 0) / milestones.length
    : 0

  return {
    milestones,
    totalProgress: Math.round(totalProgress),
    isLoading,
    hasDebtPriority: consolidatedData?.debts.length > 0,
    dineroDisponibleMensual: consolidatedData?.savingsCapacity || 0
  }
}
