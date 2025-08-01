
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
      name: 'Rent/Mortgage',
      icon: Home,
      description: 'Your main housing costs',
      examples: 'e.g., $1,200 (rent $800, utilities $200, insurance $200)',
      placeholder: 'Your rent or monthly mortgage payment',
      tooltip: '🏠 Expenses you pay every month without fail - rent, mortgage, home insurance, and regular maintenance costs',
      amount: financialData.expenseCategories.rent || 0
    },
    {
      id: 'transport',
      name: 'Transportation',
      icon: Car,
      description: 'Getting around costs',
      examples: 'e.g., $300 (gas $150, car payment $100, Uber $50)',
      placeholder: 'Gas, public transport, Uber, car payments',
      tooltip: 'Everything related to getting around: gas, public transport, ride-sharing, car payments, maintenance',
      amount: financialData.expenseCategories.transport || 0
    },
    {
      id: 'food',
      name: 'Food & Dining',
      icon: Utensils,
      description: 'All your food expenses',
      examples: 'e.g., $600 (groceries $400, restaurants $150, delivery $50)',
      placeholder: 'Groceries, restaurants, delivery, coffee',
      tooltip: 'All food-related spending: groceries, restaurants, delivery apps, coffee shops, snacks',
      amount: financialData.expenseCategories.food || 0
    },
    {
      id: 'utilities',
      name: 'Bills & Services',
      icon: CreditCard,
      description: 'Monthly bills and services',
      examples: 'e.g., $250 (phone $50, internet $60, electricity $80, water $60)',
      placeholder: 'Phone, internet, electricity, water',
      tooltip: 'Essential monthly services: phone, internet, electricity, water, gas, streaming services',
      amount: financialData.expenseCategories.utilities || 0
    },
    {
      id: 'other',
      name: 'Entertainment & Personal',
      icon: MoreHorizontal,
      description: 'Fun stuff and personal care',
      examples: 'e.g., $400 (shopping $200, gym $50, entertainment $100, personal care $50)',
      placeholder: 'Shopping, gym, movies, personal care',
      tooltip: '📱 Include apps like Netflix, Spotify, Uber Eats, plus shopping, gym, movies, personal care',
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
        totalSteps={6}
        title="What are your typical monthly expenses?"
        subtitle="Help us understand your spending. Don't stress about being perfect - you can always adjust this later! 😊"
        onNext={handleNext}
        onBack={onBack}
        canProceed={canProceed}
        nextButtonText="Perfect, let's continue!"
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
                  <span className="text-orange-800 font-medium">Monthly total</span>
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
                <p className="text-sm text-blue-700 mb-1">Your estimated balance</p>
                <p className={`text-xl font-bold ${
                  (financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  ${((financialData.monthlyIncome + financialData.extraIncome) - totalExpenses).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {(financialData.monthlyIncome + financialData.extraIncome - totalExpenses) >= 0 
                    ? "Great! You have a positive balance 🎉" 
                    : "No worries, we'll find the perfect balance together 💪"}
                </p>
              </div>
            </div>
          )}

          {/* Encouraging note */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <p className="text-sm text-emerald-800 text-center">
              <strong>Remember:</strong> This is just to get to know you better. Don't stress about being super exact - 
              just give us a general idea of your typical spending. You can always adjust later! 🙂
            </p>
          </div>
        </div>
      </OnboardingStep>
    </TooltipProvider>
  )
}

export default Step2Expenses
