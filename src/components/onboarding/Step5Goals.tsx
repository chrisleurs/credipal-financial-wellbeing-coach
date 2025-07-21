
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Target, Calendar, DollarSign, Trash2 } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'
import { FinancialGoal } from '@/types'

interface Step5GoalsProps {
  onNext: () => void
  onBack: () => void
}

const Step5Goals: React.FC<Step5GoalsProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const [goals, setGoals] = useState<FinancialGoal[]>(
    financialData.financialGoals || []
  )

  const addGoal = () => {
    const newGoal: FinancialGoal = {
      id: Date.now().toString(),
      type: 'other',
      description: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      priority: 'medium'
    }
    setGoals([...goals, newGoal])
  }

  const updateGoal = (id: string, field: keyof FinancialGoal, value: any) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ))
  }

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const handleNext = () => {
    updateFinancialData({
      financialGoals: goals
    })
    onNext()
  }

  const canProceed = true // Las metas son opcionales

  return (
    <OnboardingStep
      currentStep={4}
      totalSteps={9}
      title="¿Qué metas financieras tienes?"
      subtitle="Define tus objetivos financieros para crear un plan personalizado. Puedes agregar metas como vacaciones, auto nuevo, casa propia, etc."
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText="Continuar"
    >
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white border-2 border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="font-medium text-gray-700">Meta financiera</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGoal(goal.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <Input
                  type="text"
                  placeholder="ej. Vacaciones familiares, auto nuevo, casa propia"
                  value={goal.description}
                  onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                  className="rounded-lg border-gray-300 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad objetivo
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={goal.targetAmount || ''}
                      onChange={(e) => updateGoal(goal.id, 'targetAmount', Number(e.target.value))}
                      className="pl-10 rounded-lg border-gray-300 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha objetivo
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="date"
                      value={goal.targetDate}
                      onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                      className="pl-10 rounded-lg border-gray-300 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={goal.priority}
                  onChange={(e) => updateGoal(goal.id, 'priority', e.target.value as 'high' | 'medium' | 'low')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500"
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addGoal}
          className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 py-4 rounded-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar meta financiera
        </Button>

        {goals.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
            <Target className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-emerald-800 font-medium mb-1">
              ¡Tener metas te ayuda a mantenerte enfocado!
            </p>
            <p className="text-sm text-emerald-700">
              Agrega al menos una meta para personalizar tu plan financiero
            </p>
          </div>
        )}
      </div>
    </OnboardingStep>
  )
}

export default Step5Goals
