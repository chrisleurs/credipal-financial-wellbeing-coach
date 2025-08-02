
import React from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, TrendingUp, Target, PiggyBank, CreditCard, Loader2, DollarSign, AlertCircle } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ChartSection } from '@/components/dashboard/ChartSection'
import { AIPanel } from '@/components/dashboard/AIPanel'

const Dashboard: React.FC = () => {
  console.log('Dashboard component rendering')
  
  const { 
    financialData, 
    aiPlan, 
    isLoading, 
    generateAIPlan,
    addExpense 
  } = useFinancialStore()

  const totalIncome = financialData.monthlyIncome + financialData.extraIncome
  const balance = totalIncome - financialData.monthlyExpenses
  const totalDebtPayments = financialData.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

  console.log('Dashboard state:', { totalIncome, balance, aiPlan })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Dashboard Financiero
          </h1>
          <p className="text-blue-100">
            Resumen completo de tu situación financiera
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 -mt-4">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <ChartSection />
          </div>

          {/* AI Panel - Takes 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <AIPanel 
              hasAIPlan={!!aiPlan}
              onGeneratePlan={generateAIPlan}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* AI Generated Plan Section */}
        {aiPlan && (
          <div className="mt-8 space-y-6">
            <Card className="shadow-xl border border-gray-100 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Brain className="h-6 w-6 text-primary" />
                  Tu Plan Financiero Personalizado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <p className="text-primary font-medium text-lg">{aiPlan.motivationalMessage}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Balance Mensual
                      </h4>
                      <p className={`text-2xl font-bold ${aiPlan.monthlyBalance >= 0 ? 'text-emerald-600' : 'text-amber-500'}`}>
                        ${aiPlan.monthlyBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Ahorro Sugerido
                      </h4>
                      <p className="text-2xl font-bold text-primary">
                        ${aiPlan.savingsSuggestion.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Recomendaciones Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {aiPlan.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{index + 1}</span>
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
          <Card className="mt-8 shadow-xl border border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-6 w-6 text-primary" />
                Tus Metas Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-primary font-semibold">{goal.replace('-', ' ')}</p>
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
