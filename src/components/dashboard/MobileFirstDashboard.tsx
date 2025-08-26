
import React from 'react'
import { useAIFinancialPlan } from '@/hooks/useAIFinancialPlan'
import { AIGeneratedPlanDashboard } from './AIGeneratedPlanDashboard'
import { OptimizedFinancialDashboard } from './OptimizedFinancialDashboard'

export const MobileFirstDashboard = () => {
  const { hasActivePlan, parsedPlan } = useAIFinancialPlan()

  // Si tiene un plan generado por IA, mostrar el dashboard AI
  if (hasActivePlan && parsedPlan) {
    return <AIGeneratedPlanDashboard />
  }

  // Si no, mostrar el dashboard optimizado regular
  return <OptimizedFinancialDashboard />
}
