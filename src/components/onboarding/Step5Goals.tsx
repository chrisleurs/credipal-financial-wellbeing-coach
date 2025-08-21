
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Target, TrendingUp, Home, GraduationCap, Car, Heart } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useOnboardingDataConsolidation } from '@/hooks/useOnboardingDataConsolidation'
import { useNavigate } from 'react-router-dom'

interface Step5GoalsProps {
  onNext: () => void
  onBack: () => void
}

const Step5Goals: React.FC<Step5GoalsProps> = ({ onNext, onBack }) => {
  const navigate = useNavigate()
  const { financialData, updateGoals, completeOnboarding } = useFinancialStore()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const { consolidateOnboardingData } = useOnboardingDataConsolidation()
  const [customGoal, setCustomGoal] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const predefinedGoals = [
    { id: 'emergency', label: 'Emergency Fund', icon: Target },
    { id: 'retirement', label: 'Retirement Savings', icon: TrendingUp },
    { id: 'house', label: 'Buy a House', icon: Home },
    { id: 'education', label: 'Education Fund', icon: GraduationCap },
    { id: 'vacation', label: 'Dream Vacation', icon: Car },
    { id: 'health', label: 'Health & Wellness', icon: Heart },
  ]

  const handleGoalToggle = (goalLabel: string) => {
    const currentGoals = financialData.financialGoals || []
    let newGoals
    
    if (currentGoals.includes(goalLabel)) {
      newGoals = currentGoals.filter(goal => goal !== goalLabel)
    } else {
      newGoals = [...currentGoals, goalLabel]
    }
    
    updateGoals(newGoals)
  }

  const handleAddCustomGoal = () => {
    if (customGoal.trim()) {
      const currentGoals = financialData.financialGoals || []
      updateGoals([...currentGoals, customGoal.trim()])
      setCustomGoal('')
    }
  }

  const handleCompleteOnboarding = async () => {
    console.log('Completing onboarding from Goals step')
    
    try {
      setIsLoading(true)
      
      // Mark onboarding as complete in local store
      completeOnboarding()
      console.log('Local onboarding completed')
      
      // Consolidate all onboarding data and migrate to main tables
      console.log('🔄 Consolidating onboarding data and migrating to main tables...')
      await consolidateOnboardingData(true) // Pass true to indicate completion
      console.log('✅ Data consolidated and migrated successfully')
      
      // Update onboarding status in database
      console.log('Attempting to update database onboarding status...')
      await updateOnboardingStatus(true)
      console.log('Database onboarding status updated successfully')
      
      // Navigate to dashboard
      console.log('Navigating to dashboard...')
      navigate('/dashboard', { replace: true })
      
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // Even if database update fails, force navigation to dashboard
      console.log('Database update failed, forcing navigation anyway...')
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <OnboardingStep
      currentStep={4}
      totalSteps={4}
      title="What are your financial goals?"
      subtitle="Select or add the goals you want to achieve. This helps us personalize your plan - but don't stress if you're not sure yet!"
      onNext={handleCompleteOnboarding}
      onBack={onBack}
      canProceed={true}
      nextButtonText={isLoading ? "Completing..." : "Complete Setup!"}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Predefined Goals Grid */}
        <div className="grid grid-cols-2 gap-3">
          {predefinedGoals.map((goal) => {
            const Icon = goal.icon
            const isSelected = financialData.financialGoals?.includes(goal.label)
            
            return (
              <button
                key={goal.id}
                onClick={() => handleGoalToggle(goal.label)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-emerald-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>
                    {goal.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Goals */}
        {financialData.financialGoals && financialData.financialGoals.length > 0 && (
          <div className="bg-emerald-50 p-4 rounded-xl">
            <h4 className="font-medium text-emerald-900 mb-3">Your Selected Goals:</h4>
            <div className="flex flex-wrap gap-2">
              {financialData.financialGoals.map((goal, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Goal */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
          <h4 className="font-medium text-gray-700 mb-3">Add a Custom Goal</h4>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="e.g., Start a business, Travel to Japan..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGoal()}
            />
            <Button 
              onClick={handleAddCustomGoal}
              disabled={!customGoal.trim()}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Motivational Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            💡 <strong>Remember:</strong> Goals can be updated anytime from your dashboard. 
            The important thing is to start somewhere!
          </p>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step5Goals
