
import React from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, TrendingUp, Target, PiggyBank, CreditCard, DollarSign } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ChartSection } from '@/components/dashboard/ChartSection'
import { AIPanel } from '@/components/dashboard/AIPanel'
import { useLoans } from '@/hooks/useLoans'
import { useDashboardNavigation } from '@/hooks/useDashboardNavigation'

const Dashboard: React.FC = () => {
  console.log('Dashboard component rendering')
  
  const { 
    financialData, 
    aiPlan, 
    isLoading, 
    generateAIPlan
  } = useFinancialStore()
  
  const { kueskiLoan } = useLoans()
  const { navigateTo } = useDashboardNavigation()

  const totalIncome = financialData.monthlyIncome + financialData.extraIncome
  const balance = totalIncome - financialData.monthlyExpenses
  const totalDebtPayments = financialData.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

  console.log('Dashboard state:', { totalIncome, balance, aiPlan })

  return (
    <div className="w-full">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm mb-6">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">
            Dashboard Financiero
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Resumen completo de tu situación financiera
          </p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]" onClick={() => navigateTo('/expenses')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 text-credipal-green flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base">Gastos</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Gestionar gastos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]" onClick={() => navigateTo('/debts')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Target className="h-7 w-7 sm:h-8 sm:w-8 text-credipal-green flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base">Deudas</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Control de deudas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]" onClick={() => navigateTo('/plan')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-credipal-green flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base">Plan AI</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Plan personalizado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]" onClick={() => navigateTo('/profile')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <PiggyBank className="h-7 w-7 sm:h-8 sm:w-8 text-credipal-green flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base">Perfil</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Configuración</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Cards - Con grid responsivo estable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Ingresos Totales"
            value={`$${totalIncome.toLocaleString()}`}
            icon={TrendingUp}
            variant="positive"
            trend={{ direction: 'up', percentage: '+12%' }}
          />
          
          <MetricCard
            title="Gastos Mensuales"
            value={`$${financialData.monthlyExpenses.toLocaleString()}`}
            icon={CreditCard}
            variant="warning"
            trend={{ direction: 'down', percentage: '-3%' }}
          />
          
          <MetricCard
            title="Ahorros Actuales"
            value={`$${financialData.currentSavings.toLocaleString()}`}
            icon={PiggyBank}
            variant="positive"
            trend={{ direction: 'up', percentage: '+8%' }}
          />
          
          <MetricCard
            title="Balance Mensual"
            value={`$${balance.toLocaleString()}`}
            icon={DollarSign}
            variant={balance >= 0 ? 'positive' : 'warning'}
            trend={{ direction: balance >= 0 ? 'up' : 'down', percentage: '5%' }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Chart Section */}
          <div className="xl:col-span-2">
            <ChartSection />
          </div>

          {/* AI Panel */}
          <div className="xl:col-span-1">
            <AIPanel 
              totalIncome={totalIncome}
              totalExpenses={financialData.monthlyExpenses}
              totalDebts={totalDebtPayments}
              kueskiLoan={kueskiLoan}
            />
          </div>
        </div>

        {/* AI Generated Plan Section */}
        {aiPlan && (
          <div className="space-y-6">
            <Card className="shadow-clean border border-gray-100 bg-white">
              <CardHeader className="bg-credipal-green-bg border-b border-green-100">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-credipal-green" />
                  Tu Plan Financiero Personalizado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-credipal-green-bg p-4 sm:p-6 rounded-xl border border-green-100">
                    <p className="text-credipal-green font-medium text-base sm:text-lg">{aiPlan.motivationalMessage}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-credipal-green" />
                        Balance Mensual
                      </h4>
                      <p className={`text-xl sm:text-2xl font-bold ${aiPlan.monthlyBalance >= 0 ? 'text-credipal-green' : 'text-amber-500'}`}>
                        ${aiPlan.monthlyBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-credipal-green" />
                        Ahorro Sugerido
                      </h4>
                      <p className="text-xl sm:text-2xl font-bold text-credipal-green">
                        ${aiPlan.savingsSuggestion.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-clean border border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Recomendaciones Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {aiPlan.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover-clean">
                      <div className="w-8 h-8 bg-credipal-green-bg rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-credipal-green font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Goals */}
        {financialData.financialGoals.length > 0 && (
          <Card className="shadow-clean border border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-credipal-green" />
                Tus Metas Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="bg-credipal-green-bg p-4 rounded-xl border border-green-100 hover-clean">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-credipal-green" />
                      </div>
                      <p className="text-credipal-green-dark font-semibold text-sm sm:text-base">{goal.replace('-', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Dashboard
