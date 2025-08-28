
/**
 * Generador de planes simplificado - se enfoca en crear un plan básico
 * basado en los datos unificados sin complejidad excesiva
 */

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useToast } from './use-toast'
import { UnifiedFinancialData } from './useUnifiedFinancialData'

export interface SimplifiedPlan {
  id: string
  userId: string
  
  // Snapshot actual
  currentSnapshot: {
    monthlyIncome: number
    monthlyExpenses: number
    totalDebt: number
    currentSavings: number
    kueskiDebt: number
  }
  
  // Plan de acción prioritario
  actionRoadmap: Array<{
    step: number
    title: string
    description: string
    targetDate: string
    completed: boolean
  }>
  
  // Métricas proyectadas
  projections: {
    debtFreeDate: string
    emergencyFundTarget: number
    monthlyAvailableAfterDebts: number
  }
  
  // Metadata
  generatedAt: string
  status: 'active' | 'draft'
}

export const useSimplifiedPlanGenerator = () => {
  const { toast } = useToast()
  const [generatedPlan, setGeneratedPlan] = useState<SimplifiedPlan | null>(null)

  const generatePlanMutation = useMutation({
    mutationFn: async (financialData: UnifiedFinancialData): Promise<SimplifiedPlan> => {
      console.log('🚀 Generating simplified plan with data:', financialData)

      // Simular generación de plan (más tarde se puede conectar con AI)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Calcular fechas y métricas
      const kueskiPayoffMonths = Math.ceil(financialData.kueskiDebt.balance / financialData.kueskiDebt.monthlyPayment)
      const kueskiPayoffDate = new Date()
      kueskiPayoffDate.setMonth(kueskiPayoffDate.getMonth() + kueskiPayoffMonths)

      const otherDebts = financialData.totalDebtBalance - financialData.kueskiDebt.balance
      const totalDebtPayoffMonths = otherDebts > 0 ? 
        Math.ceil(otherDebts / Math.max(financialData.savingsCapacity, 100)) + kueskiPayoffMonths : 
        kueskiPayoffMonths

      const debtFreeDate = new Date()
      debtFreeDate.setMonth(debtFreeDate.getMonth() + totalDebtPayoffMonths)

      const plan: SimplifiedPlan = {
        id: 'plan-' + Date.now(),
        userId: financialData.userId,
        
        currentSnapshot: {
          monthlyIncome: financialData.monthlyIncome,
          monthlyExpenses: financialData.monthlyExpenses,
          totalDebt: financialData.totalDebtBalance,
          currentSavings: financialData.currentSavings,
          kueskiDebt: financialData.kueskiDebt.balance
        },
        
        actionRoadmap: [
          {
            step: 1,
            title: 'Mantener pagos de KueskiPay',
            description: `$${financialData.kueskiDebt.monthlyPayment} mensuales hasta liquidar deuda`,
            targetDate: kueskiPayoffDate.toISOString().split('T')[0],
            completed: false
          },
          {
            step: 2,
            title: 'Optimizar gastos mensuales',
            description: 'Reducir gastos variables en 10% para aumentar capacidad de ahorro',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: false
          },
          {
            step: 3,
            title: 'Crear fondo de emergencia',
            description: `Ahorrar $${Math.round(financialData.monthlyExpenses * 3)} para 3 meses de gastos`,
            targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: false
          }
        ],
        
        projections: {
          debtFreeDate: debtFreeDate.toISOString().split('T')[0],
          emergencyFundTarget: Math.round(financialData.monthlyExpenses * 3),
          monthlyAvailableAfterDebts: financialData.savingsCapacity
        },
        
        generatedAt: new Date().toISOString(),
        status: 'active'
      }

      console.log('✅ Generated simplified plan:', plan)
      return plan
    },
    onSuccess: (plan) => {
      setGeneratedPlan(plan)
      toast({
        title: "¡Plan financiero generado! 🎯",
        description: "Tu plan personalizado está listo",
      })
    },
    onError: (error) => {
      console.error('❌ Error generating plan:', error)
      toast({
        title: "Error al generar plan",
        description: "No se pudo generar tu plan financiero",
        variant: "destructive"
      })
    }
  })

  return {
    generatedPlan,
    generatePlan: (data: UnifiedFinancialData) => generatePlanMutation.mutate(data),
    isGenerating: generatePlanMutation.isPending,
    clearPlan: () => setGeneratedPlan(null)
  }
}
