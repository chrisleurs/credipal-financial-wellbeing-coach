
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
      totalSteps={6}
      title="Tell us about your monthly income"
      subtitle="Include your main income. If you have extra income (freelance, commissions, family support), you can add that too."
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
    >
      <div className="space-y-6">
        {/* Main income */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <Briefcase className="h-5 w-5" />
            <label className="font-medium">Main monthly income</label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
            <Input
              type="number"
              placeholder="e.g., $3,500 (your salary after taxes)"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Extra income */}
        {showExtraIncome && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-700">
              <PiggyBank className="h-5 w-5" />
              <label className="font-medium">Extra income (optional)</label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">$</span>
              <Input
                type="number"
                placeholder="Freelance, commissions, side gigs, etc."
                value={extraIncome}
                onChange={(e) => setExtraIncome(e.target.value)}
                className="text-lg p-4 pl-8 rounded-xl border-2 focus:border-teal-500 bg-white"
              />
            </div>
          </div>
        )}

        {/* Button to add extra income */}
        {!showExtraIncome && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowExtraIncome(true)}
            className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 py-4 rounded-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add extra income
          </Button>
        )}

        {/* Reassuring note */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-emerald-800 font-medium mb-1">
                💡 Don't worry about being exact
              </p>
              <p className="text-sm text-emerald-700">
                A good estimate is enough. Credipal will help you refine your budget as we go.
              </p>
            </div>
          </div>
        </div>

        {/* Income preview */}
        {(monthlyIncome || extraIncome) && (
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-emerald-700 mb-1">Total monthly income</p>
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
