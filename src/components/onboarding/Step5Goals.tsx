
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Target, X } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'

interface Step5GoalsProps {
  onNext: () => void
  onBack: () => void
}

const Step5Goals: React.FC<Step5GoalsProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const [goals, setGoals] = useState<string[]>(financialData.financialGoals || [])
  const [newGoal, setNewGoal] = useState('')

  const predefinedGoals = [
    'Fondo de emergencia',
    'Vacaciones',
    'Comprar casa',
    'Comprar auto',
    'Educación',
    'Jubilación',
    'Inversiones'
  ]

  const addGoal = (goal: string) => {
    if (goal.trim() && !goals.includes(goal)) {
      setGoals([...goals, goal])
      setNewGoal('')
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setGoals(goals.filter(goal => goal !== goalToRemove))
  }

  const handleNext = () => {
    updateFinancialData({
      financialGoals: goals
    })
    onNext()
  }

  const canProceed = true // Permitir continuar sin metas

  return (
    <OnboardingStep
      currentStep={4}
      totalSteps={6}
      title="¿Cuáles son tus metas financieras?"
      subtitle="Selecciona o agrega las metas que quieres alcanzar. Esto nos ayudará a personalizar tu plan."
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-6 rounded-full">
            <Target className="h-12 w-12 text-emerald-600" />
          </div>
        </div>

        {/* Metas predefinidas */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Metas comunes</h3>
          <div className="grid grid-cols-2 gap-2">
            {predefinedGoals.map((goal) => (
              <Button
                key={goal}
                variant="outline"
                onClick={() => addGoal(goal)}
                disabled={goals.includes(goal)}
                className={`text-left h-auto py-3 ${
                  goals.includes(goal) 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                    : 'hover:bg-emerald-50'
                }`}
              >
                {goal}
              </Button>
            ))}
          </div>
        </div>

        {/* Agregar meta personalizada */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Meta personalizada</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu meta financiera"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal(newGoal)}
              className="rounded-xl"
            />
            <Button
              onClick={() => addGoal(newGoal)}
              disabled={!newGoal.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 px-4"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metas seleccionadas */}
        {goals.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Tus metas seleccionadas</h3>
            <div className="space-y-2">
              {goals.map((goal) => (
                <div
                  key={goal}
                  className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl"
                >
                  <span className="text-emerald-800 font-medium">{goal}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(goal)}
                    className="text-emerald-600 hover:text-emerald-800 h-auto p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje motivacional */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            <strong>💡 Tip:</strong> No te preocupes si no estás seguro. 
            Puedes agregar o modificar tus metas más tarde en el dashboard.
          </p>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step5Goals
