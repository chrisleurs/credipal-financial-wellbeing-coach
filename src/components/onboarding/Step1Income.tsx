import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign, Briefcase, PiggyBank } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'

interface Step1IncomeProps {
  onNext: () => void
  onBack: () => void
}

const Step1Income: React.FC<Step1IncomeProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const [monthlyIncome, setMonthlyIncome] = useState(
    financialData.monthlyIncome > 0 ? financialData.monthlyIncome.toString() : ''
  )
  const [extraIncome, setExtraIncome] = useState(
    financialData.extraIncome > 0 ? financialData.extraIncome.toString() : ''
  )
  const [showExtraIncome, setShowExtraIncome] = useState(financialData.extraIncome > 0)

  const handleNext = () => {
    updateFinancialData({
      monthlyIncome: parseFloat(monthlyIncome) || 0,
      extraIncome: parseFloat(extraIncome) || 0
    })
    onNext()
  }

  const canProceed = monthlyIncome.trim() !== '' && parseFloat(monthlyIncome) > 0

  return (
    <OnboardingStep
      currentStep={0}
      totalSteps={9}
      title="¿Cuánto ganas al mes?"
      subtitle="Incluye tu ingreso principal. Si tienes ingresos extras (freelance, comisiones, apoyo familiar), puedes agregarlos después."
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
    >
      <div className="space-y-6">
        {/* Ingreso principal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <Briefcase className="h-5 w-5" />
            <label className="font-medium">Ingreso principal mensual</label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
            <Input
              type="number"
              placeholder="Ingresa tu sueldo mensual"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Ingresos extras */}
        {showExtraIncome && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-700">
              <PiggyBank className="h-5 w-5" />
              <label className="font-medium">Ingresos extras (opcional)</label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
              <Input
                type="number"
                placeholder="Freelance, comisiones, etc."
                value={extraIncome}
                onChange={(e) => setExtraIncome(e.target.value)}
                className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-teal-500 bg-white"
              />
            </div>
          </div>
        )}

        {/* Botón para agregar ingresos extras */}
        {!showExtraIncome && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowExtraIncome(true)}
            className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 py-4 rounded-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar ingresos extras
          </Button>
        )}

        {/* Nota tranquilizadora */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-emerald-800 font-medium mb-1">
                No necesitas ser exacto
              </p>
              <p className="text-sm text-emerald-700">
                Una buena estimación es suficiente. Credipal te ayudará a refinar tu presupuesto.
              </p>
            </div>
          </div>
        </div>

        {/* Preview del total */}
        {(monthlyIncome || extraIncome) && (
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-emerald-700 mb-1">Total de ingresos mensuales</p>
              <p className="text-2xl font-bold text-emerald-800">
                ${((parseFloat(monthlyIncome) || 0) + (parseFloat(extraIncome) || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </OnboardingStep>
  )
}

export default Step1Income