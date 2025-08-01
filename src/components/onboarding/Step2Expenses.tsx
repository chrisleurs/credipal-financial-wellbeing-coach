
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Home, Car, Utensils, CreditCard, MoreHorizontal, Calculator, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'

interface ExpenseCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  examples: string
  placeholder: string
  tooltip: string
  amount: number
}

interface Step2ExpensesProps {
  onNext: () => void
  onBack: () => void
}

const Step2Expenses: React.FC<Step2ExpensesProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  
  const initialCategories: ExpenseCategory[] = [
    {
      id: 'rent',
      name: 'Renta/Hipoteca',
      icon: Home,
      description: 'Vivienda principal',
      examples: 'Ej: $800 (renta $650, seguro $50, mantenimiento $100)',
      placeholder: 'Tu renta o pago mensual de hipoteca',
      tooltip: 'Incluye renta, hipoteca, seguro de vivienda y gastos de mantenimiento regulares',
      amount: financialData.expenseCategories.rent || 0
    },
    {
      id: 'transport',
      name: 'Transporte',
      icon: Car,
      description: 'Movilidad y desplazamientos',
      examples: 'Ej: $120 (gasolina $80, Uber $40)',
      placeholder: 'Gasolina, transporte público, Uber',
      tooltip: 'Todo lo relacionado con moverte: gasolina, transporte público, servicios como Uber, mantenimiento del auto',
      amount: financialData.expenseCategories.transport || 0
    },
    {
      id: 'food',
      name: 'Comida',
      icon: Utensils,
      description: 'Alimentación y restaurantes',
      examples: 'Ej: $400 (supermercado $250, restaurantes $100, delivery $50)',
      placeholder: 'Supermercado, restaurantes, delivery',
      tooltip: 'Incluye todo lo que gastas en alimentación: supermercado, restaurantes, pedidos a domicilio, cafés',
      amount: financialData.expenseCategories.food || 0
    },
    {
      id: 'utilities',
      name: 'Servicios',
      icon: CreditCard,
      description: 'Servicios básicos del hogar',
      examples: 'Ej: $200 (luz $60, internet $40, celular $30, agua $25, gas $45)',
      placeholder: 'Luz, agua, internet, teléfono',
      tooltip: 'Servicios esenciales como electricidad, agua, internet, teléfono, gas, cable o streaming',
      amount: financialData.expenseCategories.utilities || 0
    },
    {
      id: 'other',
      name: 'Otros gastos',
      icon: MoreHorizontal,
      description: 'Entretenimiento y gastos personales',
      examples: 'Ej: $150 (Netflix $15, gym $30, ropa $50, salidas $55)',
      placeholder: 'Entretenimiento, ropa, suscripciones',
      tooltip: 'Todo lo demás: entretenimiento, ropa, suscripciones, gastos personales, hobbies',
      amount: financialData.expenseCategories.other || 0
    }
  ]

  const [categories, setCategories] = useState<ExpenseCategory[]>(initialCategories)

  const updateCategory = (id: string, amount: number) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, amount } : cat
      )
    )
  }

  const handleNext = () => {
    const expenseCategories: Record<string, number> = {}
    let totalExpenses = 0
    
    categories.forEach(cat => {
      if (cat.amount > 0) {
        expenseCategories[cat.id] = cat.amount
        totalExpenses += cat.amount
      }
    })

    updateFinancialData({
      expenseCategories,
      monthlyExpenses: totalExpenses
    })
    onNext()
  }

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0)
  const canProceed = totalExpenses > 0

  return (
    <TooltipProvider>
      <OnboardingStep
        currentStep={1}
        totalSteps={9}
        title="Cuéntanos sobre tus gastos típicos del mes"
        subtitle="No tiene que ser exacto, solo danos una idea general. Siempre puedes ajustar esto después 😊"
        onNext={handleNext}
        onBack={onBack}
        canProceed={canProceed}
      >
        <div className="space-y-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <div key={category.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-xl flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {category.name}
                      </label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">{category.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-emerald-600 mb-2 font-medium">
                      {category.examples}
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder={category.placeholder}
                        value={category.amount > 0 ? category.amount.toString() : ''}
                        onChange={(e) => updateCategory(category.id, parseFloat(e.target.value) || 0)}
                        className="pl-8 rounded-lg border-gray-300 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Total display */}
          {totalExpenses > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-orange-800 font-medium">Total mensual</span>
                </div>
                <span className="text-xl font-bold text-orange-800">
                  ${totalExpenses.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Balance preview */}
          {totalExpenses > 0 && financialData.monthlyIncome > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <div className="text-center">
                <p className="text-sm text-blue-700 mb-1">Tu balance estimado</p>
                <p className={`text-xl font-bold ${
                  (financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  ${((financialData.monthlyIncome + financialData.extraIncome) - totalExpenses).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {(financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                    ? '¡Genial! Tienes un balance positivo 🎉' 
                    : 'No te preocupes, vamos a encontrar el equilibrio ideal 💪'}
                </p>
              </div>
            </div>
          )}

          {/* Nota motivacional */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <p className="text-sm text-emerald-800 text-center">
              <strong>Recuerda:</strong> Esto es solo para conocerte mejor. No tienes que ser súper exacto, 
              solo danos una idea general de tus gastos típicos. ¡Siempre puedes ajustar después! 🙂
            </p>
          </div>
        </div>
      </OnboardingStep>
    </TooltipProvider>
  )
}

export default Step2Expenses
