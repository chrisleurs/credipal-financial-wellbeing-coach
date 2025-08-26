
import React from 'react'
import { useCleanFinancialDashboard } from '@/hooks/useCleanFinancialDashboard'
import { SimplifiedFinancialSummary } from '@/components/dashboard/SimplifiedFinancialSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/helpers'
import { Calendar, TrendingUp, Target } from 'lucide-react'

export default function SimplifiedDashboard() {
  const dashboardData = useCleanFinancialDashboard()

  if (dashboardData.isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (dashboardData.isEmpty) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Bienvenido a tu Dashboard Financiero</h2>
            <p className="text-muted-foreground mb-4">
              Comienza agregando tus ingresos, gastos y metas para ver tu resumen financiero.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Financiero</h1>
        <div className="text-sm text-muted-foreground">
          {dashboardData.summary.lastUpdated && (
            <span>Actualizado: {new Date(dashboardData.summary.lastUpdated).toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Main Financial Summary */}
      <SimplifiedFinancialSummary />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gastos Este Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(dashboardData.quickStats.expensesThisMonth)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagos de Deuda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(dashboardData.quickStats.debtPaymentsThisMonth)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ahorro Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(dashboardData.quickStats.savingsThisMonth)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metas Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.quickStats.goalCompletionRate.toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Gastos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardData.recentActivity.latestExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{expense.category}</span>
                    <div className="text-muted-foreground">{expense.date}</div>
                  </div>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
              {dashboardData.recentActivity.latestExpenses.length === 0 && (
                <p className="text-muted-foreground text-center">No hay gastos recientes</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próximos Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardData.recentActivity.upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{payment.creditor}</span>
                    <div className="text-muted-foreground">{payment.dueDate}</div>
                  </div>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              ))}
              {dashboardData.recentActivity.upcomingPayments.length === 0 && (
                <p className="text-muted-foreground text-center">No hay pagos próximos</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentActivity.activeGoals.map((goal) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-muted-foreground">{goal.progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {dashboardData.recentActivity.activeGoals.length === 0 && (
                <p className="text-muted-foreground text-center">No hay metas activas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
