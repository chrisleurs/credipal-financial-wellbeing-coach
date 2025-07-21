import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { PiggyBank, TrendingUp, Target } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'

interface Step4SavingsProps {
  onNext: () => void
  onBack: () => void
}

const Step4Savings: React.FC<Step4SavingsProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const [currentSavings, setCurrentSavings] = useState(
    financialData.currentSavings > 0 ? financialData.currentSavings.toString() : ''
  )
  const [monthlySavingsCapacity, setMonthlySavingsCapacity] = useState(
    financialData.monthlySavingsCapacity > 0 ? financialData.monthlySavingsCapacity.toString() : ''
  )

  const handleNext = () => {
    updateFinancialData({
      currentSavings: parseFloat(currentSavings) || 0,
      monthlySavingsCapacity: parseFloat(monthlySavingsCapacity) || 0
    })
    onNext()
  }

  const canProceed = true // Los ahorros pueden ser 0, es válido

  // Calcular algunos insights
  const currentSavingsNum = parseFloat(currentSavings) || 0
  const monthlyCapacityNum = parseFloat(monthlySavingsCapacity) || 0
  const totalIncome = financialData.monthlyIncome + financialData.extraIncome
  const totalExpenses = financialData.monthlyExpenses
  const totalDebtPayments = financialData.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
  const availableBalance = totalIncome - totalExpenses - totalDebtPayments

  const savingsPercentage = totalIncome > 0 ? (monthlyCapacityNum / totalIncome) * 100 : 0

  return (
    <OnboardingStep
      currentStep={3}
      totalSteps={9}
      title="¿Cuánto tienes ahorrado?"
      subtitle="Cuéntanos sobre tus ahorros actuales y cuánto podrías ahorrar mensualmente."
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
    >
      <div className="space-y-6">
        {/* Ahorros actuales */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <PiggyBank className="h-5 w-5" />
            <label className="font-medium">Ahorros actuales</label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
            <Input
              type="number"
              placeholder="¿Cuánto tienes ahorrado actualmente?"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-emerald-500 bg-white"
            />
          </div>
          <p className="text-sm text-gray-600">
            Incluye cuentas de ahorro, inversiones líquidas, efectivo guardado, etc.
          </p>
        </div>

        {/* Capacidad de ahorro mensual */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-teal-700">
            <TrendingUp className="h-5 w-5" />
            <label className="font-medium">¿Cuánto podrías ahorrar al mes?</label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
            <Input
              type="number"
              placeholder="Cantidad realista que puedes apartar"
              value={monthlySavingsCapacity}
              onChange={(e) => setMonthlySavingsCapacity(e.target.value)}
              className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-teal-500 bg-white"
            />
          </div>
          <p className="text-sm text-gray-600">
            Sé realista. Es mejor empezar con poco y ser consistente.
          </p>
        </div>

        {/* Sugerencia basada en balance disponible */}
        {availableBalance > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Sugerencia de Credipal
                </p>
                <p className="text-sm text-blue-700">
                  Según tus ingresos y gastos, podrías ahorrar hasta{' '}
                  <strong>${availableBalance.toLocaleString()}</strong> al mes. 
                  Considera empezar con el 10-20% de esta cantidad.
                </p>
                {availableBalance * 0.1 > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Recomendación: ${Math.round(availableBalance * 0.1).toLocaleString()} - ${Math.round(availableBalance * 0.2).toLocaleString()} mensuales
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Insights de ahorro */}
        {monthlyCapacityNum > 0 && (
          <div className="space-y-3">
            {/* Porcentaje de ingresos */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-green-700 mb-1">Porcentaje de tus ingresos</p>
                <p className="text-2xl font-bold text-green-800">{savingsPercentage.toFixed(1)}%</p>
                <p className="text-xs text-green-600 mt-1">
                  {savingsPercentage >= 20 ? '¡Excelente! Muy por encima del promedio' :
                   savingsPercentage >= 10 ? '¡Muy bien! Estás en el camino correcto' :
                   savingsPercentage >= 5 ? 'Buen inicio, puedes mejorar gradualmente' :
                   'Todo suma, lo importante es empezar'}
                </p>
              </div>
            </div>

            {/* Proyección anual */}
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-purple-700 mb-1">En un año habrás ahorrado</p>
                <p className="text-xl font-bold text-purple-800">
                  ${(currentSavingsNum + (monthlyCapacityNum * 12)).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  ${currentSavingsNum.toLocaleString()} actuales + ${(monthlyCapacityNum * 12).toLocaleString()} del año
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estado sin ahorros */}
        {currentSavingsNum === 0 && monthlyCapacityNum === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <div className="text-center">
              <PiggyBank className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-yellow-800 mb-1">
                No hay problema si empiezas desde cero
              </p>
              <p className="text-sm text-yellow-700">
                Credipal te ayudará a encontrar oportunidades de ahorro en tu presupuesto actual. 
                Cada peso cuenta y lo importante es dar el primer paso.
              </p>
            </div>
          </div>
        )}

        {/* Consejos motivacionales */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-800 mb-2">
                💡 Consejos para ahorrar más
              </p>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Automatiza tus ahorros el día de pago</li>
                <li>• Empieza con una cantidad pequeña y auméntala gradualmente</li>
                <li>• Ahorra primero, gasta después</li>
                <li>• Celebra cada meta de ahorro que alcances</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step4Savings