
import React from 'react'
import { DollarSign, TrendingUp, CreditCard, Target } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useOnboardingStore } from '@/store/modules/onboardingStore'

interface Step7SummaryProps {
  onNext: () => void
  onBack: () => void
}

const Step7Summary: React.FC<Step7SummaryProps> = ({ onNext, onBack }) => {
  const { financialData } = useOnboardingStore()

  const totalIncome = financialData.monthlyIncome + financialData.extraIncome
  const totalExpenses = financialData.monthlyExpenses
  const monthlyBalance = totalIncome - totalExpenses

  const canProceed = true

  return (
    <OnboardingStep
      currentStep={6}
      totalSteps={6}
      title="Resumen de tu información financiera"
      subtitle="Revisa que toda la información esté correcta antes de continuar al dashboard"
      onNext={onNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText="Generar mi plan financiero"
    >
      <div className="space-y-4">
        {/* Ingresos */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Ingresos mensuales</span>
            </div>
            <span className="text-lg font-bold text-green-800">
              ${totalIncome.toLocaleString()}
            </span>
          </div>
          {financialData.extraIncome > 0 && (
            <div className="mt-2 text-sm text-green-700">
              Principal: ${financialData.monthlyIncome.toLocaleString()} + 
              Extra: ${financialData.extraIncome.toLocaleString()}
            </div>
          )}
        </div>

        {/* Gastos */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-medium text-red-800">Gastos mensuales</span>
            </div>
            <span className="text-lg font-bold text-red-800">
              ${totalExpenses.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-sm text-red-700">
            {Object.entries(financialData.expenseCategories || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span>${value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Balance */}
        <div className={`${monthlyBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border rounded-xl p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${monthlyBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <DollarSign className={`h-4 w-4 ${monthlyBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <span className={`font-medium ml-2 ${monthlyBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                Balance mensual
              </span>
            </div>
            <span className={`text-lg font-bold ${monthlyBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              ${monthlyBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Deudas */}
        {financialData.debts && financialData.debts.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-medium text-purple-800">Deudas</span>
            </div>
            <div className="space-y-2">
              {financialData.debts.map((debt, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-purple-700">{debt.name}</span>
                  <span className="text-purple-800 font-medium">
                    ${debt.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metas */}
        {financialData.financialGoals && financialData.financialGoals.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Target className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="font-medium text-emerald-800">Metas financieras</span>
            </div>
            <div className="space-y-2">
              {financialData.financialGoals.map((goal, index) => (
                <div key={index} className="text-sm text-emerald-700">
                  • {goal}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ahorros */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-full">
                <DollarSign className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="font-medium text-indigo-800 ml-2">Ahorros actuales</span>
            </div>
            <span className="text-lg font-bold text-indigo-800">
              ${financialData.currentSavings.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-sm text-indigo-700">
            Capacidad mensual: ${financialData.monthlySavingsCapacity.toLocaleString()}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-emerald-800 mb-2">
            ¡Todo está listo! 🎉
          </h3>
          <p className="text-sm text-emerald-700">
            Vamos a crear tu plan financiero personalizado con inteligencia artificial.
            Esto tomará solo unos segundos.
          </p>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step7Summary
