import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Home, Car, Utensils, CreditCard, MoreHorizontal, Calculator } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'

interface ExpenseCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
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
      amount: financialData.expenseCategories.rent || 0
    },
    {
      id: 'transport',
      name: 'Transporte',
      icon: Car,
      description: 'Gasolina, transporte público',
      amount: financialData.expenseCategories.transport || 0
    },
    {
      id: 'food',
      name: 'Comida',
      icon: Utensils,
      description: 'Supermercado, restaurantes',
      amount: financialData.expenseCategories.food || 0
    },
    {
      id: 'utilities',
      name: 'Servicios',
      icon: CreditCard,
      description: 'Luz, agua, internet, teléfono',
      amount: financialData.expenseCategories.utilities || 0
    },
    {
      id: 'other',
      name: 'Otros gastos',
      icon: MoreHorizontal,
      description: 'Entretenimiento, ropa, etc.',
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
    <OnboardingStep
      currentStep={1}
      totalSteps={9}
      title="¿En qué gastas tu dinero?"
      subtitle="Selecciona tus gastos más comunes. Puedes ajustar las cantidades según tu realidad."
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
    >
      <div className="space-y-4">
        {categories.map((category) => {
          const IconComponent = category.icon
          
          return (
            <div key={category.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <IconComponent className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {category.name}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {category.description}
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      placeholder="Cantidad mensual"
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
              <p className="text-sm text-blue-700 mb-1">Balance estimado</p>
              <p className={`text-xl font-bold ${
                (financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }`}>
                ${((financialData.monthlyIncome + financialData.extraIncome) - totalExpenses).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {(financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                  ? '¡Vas bien! Tienes un balance positivo' 
                  : 'Necesitamos ajustar tu presupuesto'}
              </p>
            </div>
          </div>
        )}

        {/* Nota motivacional */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <p className="text-sm text-emerald-800 text-center">
            <strong>No te preocupes si los números no cuadran perfecto.</strong> Credipal te ayudará a encontrar el equilibrio ideal para tu situación.
          </p>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step2Expenses