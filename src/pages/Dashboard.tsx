
import React from 'react'
import { useFinancialStore } from '@/store/financialStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, TrendingUp, Target, PiggyBank, CreditCard, Loader2 } from 'lucide-react'

const Dashboard: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a tu Dashboard Financiero!
          </h1>
          <p className="text-gray-600">
            Aquí puedes ver tu situación financiera y generar tu plan personalizado
          </p>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">${totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700">${financialData.monthlyExpenses.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600 flex items-center gap-2">
                <PiggyBank className="h-4 w-4" />
                Ahorros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">${financialData.currentSavings.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ${balance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Plan Generator */}
        {!aiPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-600" />
                Genera tu Plan Financiero Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Basado en la información que compartiste, Credipal puede crear un plan financiero personalizado con recomendaciones específicas para tu situación.
              </p>
              <Button
                onClick={generateAIPlan}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando tu plan...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generar mi plan con IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Generated Plan */}
        {aiPlan && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  Tu Plan Financiero Personalizado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-emerald-800 font-medium">{aiPlan.motivationalMessage}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Balance Mensual</h4>
                      <p className={`text-xl font-bold ${aiPlan.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${aiPlan.monthlyBalance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Ahorro Sugerido</h4>
                      <p className="text-xl font-bold text-blue-600">
                        ${aiPlan.savingsSuggestion.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {aiPlan.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-emerald-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Your Goals */}
        {financialData.financialGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Tus Metas Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-purple-800 font-medium">{goal.replace('-', ' ')}</p>
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
