import React, { useState } from 'react'
import { MetricCard } from './MetricCard'
import { TimeFilter } from './TimeFilter'
import { AIPanel } from './AIPanel'
import { ChartSection } from './ChartSection'
import { LoanCard } from './LoanCard'
import { DataSourceIndicator } from './DataSourceIndicator'
import { useDataConsistency } from '@/hooks/useDataConsistency'
import { useExpenses } from '@/hooks/useExpenses'
import { useDebts } from '@/hooks/useDebts'
import { useLoans } from '@/hooks/useLoans'
import { useLanguage } from '@/contexts/LanguageContext'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { TrendingUp, TrendingDown, PiggyBank, CreditCard } from 'lucide-react'

type TimeFrame = 'week' | 'month' | 'quarter' | 'year'

export const FinancialDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimeFrame>('month')
  const consistentData = useDataConsistency()
  const { expenses, isLoading: isLoadingExpenses } = useExpenses()
  const { debts, isLoadingDebts } = useDebts()
  const { kueskiLoan, activeLoans, isLoading: isLoadingLoans } = useLoans()
  const { t } = useLanguage()

  if (isLoadingExpenses || isLoadingDebts || isLoadingLoans) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('loading_financial_info')} />
      </div>
    )
  }

  const handleFilterChange = (filter: string) => {
    const filterMap: Record<string, TimeFrame> = {
      'week': 'week',
      'month': 'month', 
      'quarter': 'quarter',
      'year': 'year'
    }
    setSelectedPeriod(filterMap[filter] || 'month')
  }

  // Calculate metrics using consistent data
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) || consistentData.monthlyExpenses
  const totalDebts = debts.reduce((sum, debt) => sum + Number(debt.current_balance), 0)
  const loanAmount = activeLoans.reduce((sum, loan) => sum + Number(loan.amount), 0)
  const availableBalance = consistentData.monthlyIncome - totalExpenses - (totalDebts * 0.1)

  const metrics = [
    {
      title: t('monthly_income'),
      value: `$${consistentData.monthlyIncome.toLocaleString()}`,
      trend: { direction: 'up' as const, percentage: consistentData.hasRealData ? '+5%' : 'Ejemplo' },
      icon: TrendingUp,
      variant: 'positive' as const
    },
    {
      title: t('monthly_expenses_short'),
      value: `$${totalExpenses.toLocaleString()}`,
      trend: { direction: 'down' as const, percentage: '-3%' },
      icon: TrendingDown,
      variant: 'warning' as const
    },
    {
      title: t('active_debts'),
      value: `$${totalDebts.toLocaleString()}`,
      trend: { direction: 'down' as const, percentage: '-2%' },
      icon: CreditCard,
      variant: 'warning' as const
    },
    {
      title: t('available_balance'),
      value: `$${availableBalance.toLocaleString()}`,
      trend: { direction: availableBalance > 0 ? 'up' as const : 'down' as const, percentage: '8%' },
      icon: PiggyBank,
      variant: availableBalance > 0 ? 'positive' as const : 'warning' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {t('dashboard')}
              </h1>
              <p className="text-text-secondary">
                {t('financial_management')}
              </p>
            </div>
            <TimeFilter 
              activeFilter={selectedPeriod}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Source Indicator */}
        <DataSourceIndicator 
          dataSource={consistentData.dataSource}
          hasRealData={consistentData.hasRealData}
        />

        {/* Kueski Loan Welcome Section */}
        {kueskiLoan && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-primary mb-2">
                    {t('kueski_loan_active')}
                  </h2>
                  <p className="text-text-secondary mb-4">
                    {t('kueski_loan_managed')} ${kueskiLoan.amount} USD. 
                    {t('next_payment')} {new Date(kueskiLoan.next_payment_date).toLocaleDateString('es-ES')}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-sm text-text-secondary">{t('total_amount')}</p>
                      <p className="font-bold text-primary">${kueskiLoan.amount}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-sm text-text-secondary">{t('biweekly_payment')}</p>
                      <p className="font-bold text-primary">${kueskiLoan.payment_amount}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-sm text-text-secondary">{t('remaining_payments')}</p>
                      <p className="font-bold text-primary">{kueskiLoan.remaining_payments}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Active Loans Section */}
        {activeLoans.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">
                {t('active_loans')}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartSection />
          </div>
          <div className="lg:col-span-1">
            <AIPanel 
              totalIncome={consistentData.monthlyIncome}
              totalExpenses={totalExpenses}
              totalDebts={totalDebts + loanAmount}
              kueskiLoan={kueskiLoan}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
