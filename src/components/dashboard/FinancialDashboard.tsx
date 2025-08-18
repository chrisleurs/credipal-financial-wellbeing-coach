
import React, { useState } from 'react'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IncomeSourcesList } from '@/components/income/IncomeSourcesList'
import { ExpensesList } from '@/components/expenses/ExpensesList'
import { DebtsList } from '@/components/debts/DebtsList'
import { GoalsList } from '@/components/goals/GoalsList'
import { MetricCard } from './MetricCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/helpers'
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Target,
  Plus,
  RefreshCw
} from 'lucide-react'

export const FinancialDashboard = () => {
  const { data: financialData, isLoading, error } = useConsolidatedFinancialData()
  const [activeSection, setActiveSection] = useState<'overview' | 'income' | 'expenses' | 'debts' | 'goals'>('overview')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu información financiera..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
            <p className="text-muted-foreground mb-4">
              No se pudieron cargar tus datos financieros.
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!financialData?.hasRealData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">¡Bienvenido a CrediPal!</h1>
            <p className="text-muted-foreground mb-6">
              Para comenzar, agrega tu primera fuente de ingresos, gastos o metas financieras.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => setActiveSection('income')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Agregar Ingresos
              </Button>
              <Button onClick={() => setActiveSection('expenses')} variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Agregar Gastos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'income':
        return <IncomeSourcesList />
      case 'expenses':
        return <ExpensesList />
      case 'debts':
        return <DebtsList />
      case 'goals':
        return <GoalsList />
      default:
        return (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Ingresos Mensuales"
                value={formatCurrency(financialData.monthlyIncome)}
                icon={<DollarSign className="h-4 w-4" />}
                trendValue={{ direction: 'up', percentage: '12%' }}
                className="bg-green-50 border-green-200"
              />
              <MetricCard
                title="Gastos Mensuales"
                value={formatCurrency(financialData.monthlyExpenses)}
                icon={<CreditCard className="h-4 w-4" />}
                trendValue={{ direction: 'down', percentage: '3%' }}
                className="bg-red-50 border-red-200"
              />
              <MetricCard
                title="Capacidad de Ahorro"
                value={formatCurrency(financialData.savingsCapacity)}
                icon={<TrendingUp className="h-4 w-4" />}
                trendValue={{ direction: 'up', percentage: '8%' }}
                className="bg-blue-50 border-blue-200"
              />
              <MetricCard
                title="Total de Deudas"
                value={formatCurrency(financialData.totalDebts)}
                icon={<Target className="h-4 w-4" />}
                trendValue={{ direction: 'down', percentage: '15%' }}
                className="bg-orange-50 border-orange-200"
              />
            </div>

            {/* Balance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Ingresos totales</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(financialData.monthlyIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gastos totales</span>
                    <span className="font-semibold text-red-600">
                      -{formatCurrency(financialData.monthlyExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pagos de deudas</span>
                    <span className="font-semibold text-orange-600">
                      -{formatCurrency(financialData.monthlyDebtPayments)}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Balance mensual</span>
                      <span className={`font-bold ${
                        financialData.savingsCapacity >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(financialData.savingsCapacity)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Financiero
          </h1>
          <p className="text-muted-foreground">
            Monitorea y gestiona tus finanzas personales
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Resumen', icon: TrendingUp },
              { key: 'income', label: 'Ingresos', icon: DollarSign },
              { key: 'expenses', label: 'Gastos', icon: CreditCard },
              { key: 'debts', label: 'Deudas', icon: CreditCard },
              { key: 'goals', label: 'Metas', icon: Target },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeSection === key ? 'default' : 'outline'}
                onClick={() => setActiveSection(key as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  )
}
