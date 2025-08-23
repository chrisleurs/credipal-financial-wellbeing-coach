
import React from 'react'
import { CompactHeader } from './CompactHeader'
import { QuickStatsGrid } from './QuickStatsGrid'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { CrediPalPlanSection } from './CrediPalPlanSection'
import { Plan321Section } from './Plan321Section'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function MobileFirstDashboard() {
  const { consolidatedData, isLoading, error } = useConsolidatedFinancialData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    )
  }

  if (error) {
    console.error('Error loading financial data:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">Error cargando los datos financieros</p>
          <p className="text-gray-600 text-sm mb-4">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    )
  }

  // Si no hay datos pero tampoco hay error, mostrar dashboard vacío
  const safeConsolidatedData = consolidatedData || {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyBalance: 0,
    currentSavings: 0,
    totalDebtBalance: 0,
    totalMonthlyDebtPayments: 0,
    savingsCapacity: 0,
    hasRealData: false,
    expenseCategories: {},
    financialGoals: [],
    debts: []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompactHeader />
      
      <div className="px-4 py-6 space-y-6">
        <QuickStatsGrid />
        <UpcomingPaymentsSection />
        <CrediPalPlanSection consolidatedData={safeConsolidatedData} />
        <Plan321Section />
      </div>
    </div>
  )
}
