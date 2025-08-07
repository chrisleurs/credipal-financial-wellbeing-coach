
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PiggyBank, TrendingUp, Target, Star, Info } from 'lucide-react'
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

  const canProceed = true // Savings can be 0, that's valid

  // Calculate insights
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
      totalSteps={6}
      title="Tell us about your savings situation"
      subtitle="How much do you currently have saved, and how much could you realistically save each month?"
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText="🎉 Awesome job — your smart financial plan is ready!"
    >
      <div className="space-y-6">
        {/* Current savings */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <PiggyBank className="h-5 w-5" />
            <label className="font-medium">Current savings</label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
            <Input
              type="number"
              placeholder="e.g., $2,500 (checking + savings + emergency fund)"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-emerald-500 bg-white"
            />
          </div>
          <p className="text-sm text-gray-600">
            Include savings accounts, liquid investments, cash you've set aside, etc.
          </p>
        </div>

        {/* Monthly savings capacity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-teal-700">
            <TrendingUp className="h-5 w-5" />
            <label className="font-medium">How much could you save monthly?</label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
            <Input
              type="number"
              placeholder="e.g., $300 (be realistic - better to start small!)"
              value={monthlySavingsCapacity}
              onChange={(e) => setMonthlySavingsCapacity(e.target.value)}
              className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-teal-500 bg-white"
            />
          </div>
          <p className="text-sm text-gray-600">
            💡 Don't worry about being exact - it's better to start small and be consistent.
          </p>
        </div>

        {/* Enhanced Credipal suggestion */}
        {availableBalance > 0 && (
          <div className="bg-blue-50 border-2 border-blue-300 p-5 rounded-xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-blue-800">⭐ Credipal's personalized suggestion</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Based on your income and expenses, you could potentially save up to{' '}
                  <strong>${availableBalance.toLocaleString()}</strong> per month. 
                  Consider starting with 10-20% of this amount.
                </p>
                <div className="bg-blue-100 border border-blue-200 p-3 rounded-lg mb-3">
                  <p className="text-xs font-medium text-blue-800">
                    💡 This is personalized for you — based on your actual income and expenses.
                  </p>
                </div>
                {availableBalance * 0.1 > 0 && (
                  <p className="text-sm font-medium text-blue-700">
                    💰 Recommendation: ${Math.round(availableBalance * 0.1).toLocaleString()} - ${Math.round(availableBalance * 0.2).toLocaleString()} monthly
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Savings insights with expert context */}
        {monthlyCapacityNum > 0 && (
          <div className="space-y-3">
            {/* Savings percentage with expert recommendation */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-green-700 mb-1">Percentage of your income</p>
                <p className="text-2xl font-bold text-green-800">{savingsPercentage.toFixed(1)}%</p>
                <div className="flex items-center justify-center gap-2 mt-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-700">
                    ℹ️ Most experts recommend saving 10-20% of your monthly income.
                  </p>
                </div>
                <p className="text-xs text-green-600">
                  {savingsPercentage >= 20 ? 'Excellent! Way above average! 🌟' :
                   savingsPercentage >= 10 ? 'Great! You\'re on the right track! 💪' :
                   savingsPercentage >= 5 ? 'Good start, you can improve gradually 📈' :
                   'Every dollar counts - you\'re taking the first step! 🎯'}
                </p>
              </div>
            </div>

            {/* Annual projection with progress visualization */}
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-purple-700 mb-1">At this pace, you'll save</p>
                <p className="text-xl font-bold text-purple-800">
                  ${(monthlyCapacityNum * 12).toLocaleString()} in 12 months!
                </p>
                <p className="text-xs text-purple-600 mt-1 mb-3">
                  ${currentSavingsNum.toLocaleString()} current + ${(monthlyCapacityNum * 12).toLocaleString()} this year
                </p>
                
                {/* Simple progress bar */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700"
                      style={{ width: '25%' }}
                    />
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    🚀 Building toward your financial goals
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Starting from zero state */}
        {currentSavingsNum === 0 && monthlyCapacityNum === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <div className="text-center">
              <PiggyBank className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-yellow-800 mb-1">
                Starting from zero? No problem! 
              </p>
              <p className="text-sm text-yellow-700">
                Credipal will help you find opportunities to save in your current budget. 
                Every dollar counts, and the important thing is taking the first step.
              </p>
            </div>
          </div>
        )}

        {/* Motivational saving tips */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-800 mb-2">
                💡 Pro tips for saving more
              </p>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Automate your savings on payday</li>
                <li>• Start small and gradually increase the amount</li>
                <li>• Save first, spend what's left</li>
                <li>• Celebrate every savings milestone you hit! 🎉</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step4Savings
