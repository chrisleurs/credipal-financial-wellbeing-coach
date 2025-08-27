
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, PiggyBank, CreditCard, Target } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'

export const QuickStatsGrid = () => {
  const { data: financialData } = useOptimizedFinancialData()

  // Usar datos reales del onboarding
  const safeData = financialData || {
    monthlyExpenses: 0,
    currentSavings: 0,
    totalDebtBalance: 0,
    savingsCapacity: 0
  }

  const stats = [
    {
      title: 'Gastos del Mes',
      value: formatCurrency(safeData.monthlyExpenses),
      icon: TrendingUp,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10'
    },
    {
      title: 'Ahorros',
      value: formatCurrency(safeData.currentSavings),
      icon: PiggyBank,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10'
    },
    {
      title: 'Deuda Total',
      value: formatCurrency(safeData.totalDebtBalance),
      icon: CreditCard,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10'
    },
    {
      title: 'Meta Anual',
      value: formatCurrency(safeData.savingsCapacity * 12),
      icon: Target,
      color: 'text-[#0891B2]',
      bgColor: 'bg-[#0891B2]/10'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.title}</p>
            <p className={`font-bold text-lg ${stat.color}`}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
