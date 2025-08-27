
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { useOptimizedFinancialData } from './useOptimizedFinancialData'
import { supabase } from '@/integrations/supabase/client'
import { CrediPalPlanGenerator } from '@/services/crediPalPlanGenerator'
import { useToast } from './use-toast'
import type { FinancialPlan } from '@/types/financialPlan'

export const useFinancialPlanManager = () => {
  const { user } = useAuth()
  const { data: financialData } = useOptimizedFinancialData()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get active financial plan
  const { data: activePlan, isLoading: isLoadingPlan, error: planError } = useQuery({
    queryKey: ['active-financial-plan', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      
      if (data) {
        // Parse plan_data and create unified FinancialPlan structure
        const planData = (typeof data.plan_data === 'string' ? JSON.parse(data.plan_data) : data.plan_data) as any || {}
        
        // Convert database plan to unified FinancialPlan interface
        const unifiedPlan: FinancialPlan = {
          id: data.id,
          userId: data.user_id,
          
          // Current and projected snapshots
          currentSnapshot: planData.currentSnapshot || {
            monthlyIncome: financialData?.monthlyIncome || 0,
            monthlyExpenses: financialData?.monthlyExpenses || 0,
            totalDebt: financialData?.totalDebtBalance || 0,
            currentSavings: financialData?.currentSavings || 0
          },
          
          projectedSnapshot: planData.projectedSnapshot || {
            debtIn12Months: Math.max(0, (financialData?.totalDebtBalance || 0) - ((financialData?.totalMonthlyDebtPayments || 0) * 12)),
            emergencyFundIn12Months: (financialData?.currentSavings || 0) + ((financialData?.savingsCapacity || 0) * 12),
            netWorthIn12Months: ((financialData?.currentSavings || 0) + ((financialData?.savingsCapacity || 0) * 12)) - Math.max(0, (financialData?.totalDebtBalance || 0) - ((financialData?.totalMonthlyDebtPayments || 0) * 12))
          },
          
          // Budget recommendations
          recommendedBudget: planData.recommendedBudget || {
            needs: { percentage: 50, amount: (financialData?.monthlyIncome || 0) * 0.5 },
            lifestyle: { percentage: 30, amount: (financialData?.monthlyIncome || 0) * 0.3 },
            savings: { percentage: 20, amount: (financialData?.monthlyIncome || 0) * 0.2 }
          },
          
          // Debt payoff plan
          debtPayoffPlan: planData.debtPayoffPlan || (financialData?.activeDebts || []).map(debt => ({
            debtName: debt.creditor,
            currentBalance: debt.balance,
            payoffDate: new Date(Date.now() + (debt.balance / Math.max(debt.payment, 1000)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            monthlyPayment: debt.payment,
            interestSaved: debt.balance * 0.1 // Estimated 10% interest savings
          })),
          
          // Emergency fund
          emergencyFund: planData.emergencyFund || {
            targetAmount: (financialData?.monthlyExpenses || 0) * 6,
            currentAmount: financialData?.currentSavings || 0,
            monthlySaving: financialData?.savingsCapacity || 0,
            completionDate: new Date(Date.now() + (((financialData?.monthlyExpenses || 0) * 6 - (financialData?.currentSavings || 0)) / Math.max(financialData?.savingsCapacity || 1, 1)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          
          // Wealth growth projections
          wealthGrowth: planData.wealthGrowth || {
            year1: (financialData?.savingsCapacity || 0) * 12,
            year3: (financialData?.savingsCapacity || 0) * 12 * 3 * 1.15, // 5% annual growth
            year5: (financialData?.savingsCapacity || 0) * 12 * 5 * 1.35 // 7% annual growth
          },
          
          // Short term goals
          shortTermGoals: planData.shortTermGoals || {
            weekly: [
              { title: 'Revisar gastos semanales', target: 100, progress: 0, type: 'expense_control' },
              { title: 'Ahorrar para fondo de emergencia', target: (financialData?.savingsCapacity || 0) / 4, progress: 0, type: 'savings' }
            ],
            monthly: [
              { title: 'Cumplir presupuesto mensual', target: 100, progress: 0, type: 'budget' },
              { title: 'Reducir deudas', target: financialData?.totalMonthlyDebtPayments || 0, progress: 0, type: 'debt' }
            ]
          },
          
          // Action roadmap
          actionRoadmap: planData.actionRoadmap || [
            { step: 1, title: 'Establecer presupuesto mensual', targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
            { step: 2, title: 'Crear fondo de emergencia', targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
            { step: 3, title: 'Optimizar pagos de deuda', targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false }
          ],
          
          // Metadata
          generatedAt: data.created_at,
          status: data.status as 'active' | 'draft' | 'completed'
        }
        
        return unifiedPlan
      }
      
      return null
    },
    enabled: !!user?.id && !!financialData,
    staleTime: 10 * 60 * 1000,
  })

  // Generate new plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !financialData) {
        throw new Error('Missing user or financial data')
      }

      console.log('🎯 Generating plan with financial data:', financialData)

      // Deactivate old plans
      await supabase
        .from('financial_plans')
        .update({ status: 'draft' })
        .eq('user_id', user.id)
        .eq('status', 'active')

      // Convert generated plan to database format and save
      const { data, error } = await supabase
        .from('financial_plans')
        .insert({
          user_id: user.id,
          plan_type: 'credipal-3-2-1',
          plan_data: {
            currentSnapshot: {
              monthlyIncome: financialData.monthlyIncome,
              monthlyExpenses: financialData.monthlyExpenses,
              totalDebt: financialData.totalDebtBalance,
              currentSavings: financialData.currentSavings
            },
            projectedSnapshot: {
              debtIn12Months: Math.max(0, financialData.totalDebtBalance - (financialData.totalMonthlyDebtPayments * 12)),
              emergencyFundIn12Months: financialData.currentSavings + (financialData.savingsCapacity * 12),
              netWorthIn12Months: (financialData.currentSavings + (financialData.savingsCapacity * 12)) - Math.max(0, financialData.totalDebtBalance - (financialData.totalMonthlyDebtPayments * 12))
            },
            recommendedBudget: {
              needs: { percentage: 50, amount: financialData.monthlyIncome * 0.5 },
              lifestyle: { percentage: 30, amount: financialData.monthlyIncome * 0.3 },
              savings: { percentage: 20, amount: financialData.monthlyIncome * 0.2 }
            },
            debtPayoffPlan: financialData.activeDebts.map(debt => ({
              debtName: debt.creditor,
              currentBalance: debt.balance,
              payoffDate: new Date(Date.now() + (debt.balance / Math.max(debt.payment, 1000)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              monthlyPayment: debt.payment,
              interestSaved: debt.balance * 0.1
            })),
            emergencyFund: {
              targetAmount: financialData.monthlyExpenses * 6,
              currentAmount: financialData.currentSavings,
              monthlySaving: financialData.savingsCapacity,
              completionDate: new Date(Date.now() + ((financialData.monthlyExpenses * 6 - financialData.currentSavings) / Math.max(financialData.savingsCapacity, 1)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            wealthGrowth: {
              year1: financialData.savingsCapacity * 12,
              year3: financialData.savingsCapacity * 12 * 3 * 1.15,
              year5: financialData.savingsCapacity * 12 * 5 * 1.35
            },
            shortTermGoals: {
              weekly: [
                { title: 'Revisar gastos semanales', target: 100, progress: 0, type: 'expense_control' },
                { title: 'Ahorrar para fondo de emergencia', target: financialData.savingsCapacity / 4, progress: 0, type: 'savings' }
              ],
              monthly: [
                { title: 'Cumplir presupuesto mensual', target: 100, progress: 0, type: 'budget' },
                { title: 'Reducir deudas', target: financialData.totalMonthlyDebtPayments, progress: 0, type: 'debt' }
              ]
            },
            actionRoadmap: [
              { step: 1, title: 'Establecer presupuesto mensual', targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
              { step: 2, title: 'Crear fondo de emergencia', targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
              { step: 3, title: 'Optimizar pagos de deuda', targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false }
            ]
          } as any,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      
      // Return properly structured plan matching FinancialPlan interface
      const unifiedPlan: FinancialPlan = {
        id: data.id,
        userId: data.user_id,
        currentSnapshot: {
          monthlyIncome: financialData.monthlyIncome,
          monthlyExpenses: financialData.monthlyExpenses,
          totalDebt: financialData.totalDebtBalance,
          currentSavings: financialData.currentSavings
        },
        projectedSnapshot: {
          debtIn12Months: Math.max(0, financialData.totalDebtBalance - (financialData.totalMonthlyDebtPayments * 12)),
          emergencyFundIn12Months: financialData.currentSavings + (financialData.savingsCapacity * 12),
          netWorthIn12Months: (financialData.currentSavings + (financialData.savingsCapacity * 12)) - Math.max(0, financialData.totalDebtBalance - (financialData.totalMonthlyDebtPayments * 12))
        },
        recommendedBudget: {
          needs: { percentage: 50, amount: financialData.monthlyIncome * 0.5 },
          lifestyle: { percentage: 30, amount: financialData.monthlyIncome * 0.3 },
          savings: { percentage: 20, amount: financialData.monthlyIncome * 0.2 }
        },
        debtPayoffPlan: financialData.activeDebts.map(debt => ({
          debtName: debt.creditor,
          currentBalance: debt.balance,
          payoffDate: new Date(Date.now() + (debt.balance / Math.max(debt.payment, 1000)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          monthlyPayment: debt.payment,
          interestSaved: debt.balance * 0.1
        })),
        emergencyFund: {
          targetAmount: financialData.monthlyExpenses * 6,
          currentAmount: financialData.currentSavings,
          monthlySaving: financialData.savingsCapacity,
          completionDate: new Date(Date.now() + ((financialData.monthlyExpenses * 6 - financialData.currentSavings) / Math.max(financialData.savingsCapacity, 1)) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        wealthGrowth: {
          year1: financialData.savingsCapacity * 12,
          year3: financialData.savingsCapacity * 12 * 3 * 1.15,
          year5: financialData.savingsCapacity * 12 * 5 * 1.35
        },
        shortTermGoals: {
          weekly: [
            { title: 'Revisar gastos semanales', target: 100, progress: 0, type: 'expense_control' },
            { title: 'Ahorrar para fondo de emergencia', target: financialData.savingsCapacity / 4, progress: 0, type: 'savings' }
          ],
          monthly: [
            { title: 'Cumplir presupuesto mensual', target: 100, progress: 0, type: 'budget' },
            { title: 'Reducir deudas', target: financialData.totalMonthlyDebtPayments, progress: 0, type: 'debt' }
          ]
        },
        actionRoadmap: [
          { step: 1, title: 'Establecer presupuesto mensual', targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
          { step: 2, title: 'Crear fondo de emergencia', targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
          { step: 3, title: 'Optimizar pagos de deuda', targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false }
        ],
        generatedAt: data.created_at,
        status: data.status as 'active' | 'draft' | 'completed'
      }
      
      return unifiedPlan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-financial-plan'] })
      toast({
        title: "¡Plan financiero generado!",
        description: "Tu nuevo plan personalizado está listo.",
      })
    },
    onError: (error) => {
      console.error('Plan generation error:', error)
      toast({
        title: "Error generando plan",
        description: "No se pudo generar tu plan financiero. Intenta nuevamente.",
        variant: "destructive"
      })
    }
  })

  // Regenerate plan mutation
  const regeneratePlanMutation = useMutation({
    mutationFn: async () => {
      return generatePlanMutation.mutateAsync()
    },
    onSuccess: () => {
      toast({
        title: "Plan actualizado",
        description: "Tu plan financiero ha sido actualizado con la información más reciente.",
      })
    }
  })

  // Update goal progress
  const updateGoalProgress = ({ goalId, progress }: { goalId: string; progress: number }) => {
    if (!activePlan) return

    console.log('🎯 Updating goal progress:', { goalId, progress })
    // Implementation would update specific goal progress in the plan
  }

  return {
    activePlan,
    isLoadingPlan,
    planError,
    hasPlan: !!activePlan,
    generatePlan: generatePlanMutation.mutate,
    regeneratePlan: regeneratePlanMutation.mutate,
    isGenerating: generatePlanMutation.isPending || regeneratePlanMutation.isPending,
    isUpdatingProgress: false,
    updateGoalProgress,
    financialData,
    canGeneratePlan: !!financialData?.hasRealData
  }
}
