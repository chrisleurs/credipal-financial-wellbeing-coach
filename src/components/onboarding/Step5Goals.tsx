
import React, { useState } from 'react'
import { Target, Plus, Check } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFinancialStore } from '@/store/financialStore'
import { useOnboardingDataConsolidation } from '@/hooks/useOnboardingDataConsolidation'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'

interface Step5GoalsProps {
  onNext: () => void
  onBack: () => void
}

export default function Step5Goals({ onNext, onBack }: Step5GoalsProps) {
  const { updateGoals } = useFinancialStore()
  const { consolidateOnboardingData } = useOnboardingDataConsolidation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [goals, setGoals] = useState<string[]>([])
  const [newGoal, setNewGoal] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()])
      setNewGoal('')
    }
  }

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index))
  }

  const handleNext = async () => {
    if (!user?.id) {
      console.error('No user found when completing onboarding')
      return
    }

    try {
      console.log('Step5Goals: Starting onboarding completion process...')
      setIsCompleting(true)
      
      // Update goals in store
      updateGoals(goals)
      console.log('Step5Goals: Goals updated in store:', goals)

      // Consolidate all onboarding data
      await consolidateOnboardingData(true)
      console.log('Step5Goals: Data consolidation completed')

      // Force a small delay to ensure database updates are processed
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verify that onboarding is marked as completed
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single()

      console.log('Step5Goals: Profile check after completion:', profileCheck)

      // Navigate to dashboard with replace to prevent back navigation
      console.log('Step5Goals: Navigating to dashboard')
      navigate('/dashboard', { replace: true })
      
    } catch (error) {
      console.error('Step5Goals: Error completing onboarding:', error)
      setIsCompleting(false)
    }
  }

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('completing_setup')}
          </h1>
          <p className="text-gray-600 mb-4">
            {t('processing_information')}
          </p>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  const popularGoals = [
    t('emergency_fund_goal'),
    t('pay_all_debts_goal'),
    t('save_for_house_goal'),
    t('plan_retirement_goal'),
    t('save_for_vacation_goal'),
    t('invest_in_education_goal'),
    t('buy_car_goal'),
    t('generate_passive_income_goal')
  ]

  return (
    <OnboardingStep
      currentStep={4}
      totalSteps={5}
      title={t('financial_goals_question')}
      subtitle={t('financial_goals_subtitle')}
      onNext={handleNext}
      onBack={onBack}
      canProceed={true}
      nextButtonText={t('complete_setup')}
    >
      <div className="space-y-6">
        {/* Add Custom Goal */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">{t('add_custom_goal')}</h3>
          <div className="flex gap-2">
            <Input
              placeholder={t('custom_goal_placeholder')}
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              className="flex-1"
            />
            <Button 
              onClick={addGoal} 
              disabled={!newGoal.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Popular Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">{t('popular_goals')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularGoals.map((goal) => (
              <Button
                key={goal}
                variant="outline"
                onClick={() => setGoals([...goals, goal])}
                disabled={goals.includes(goal)}
                className="h-auto p-4 text-left justify-start hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50"
              >
                <Target className="h-4 w-4 mr-3 text-emerald-600 flex-shrink-0" />
                <span className="text-sm break-words">{goal}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Goals */}
        {goals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{t('selected_goals')}</h3>
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <Check className="h-4 w-4 text-emerald-600 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 break-words">{goal}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 mb-2">
            {t('no_specific_goals_yet')}
          </p>
          <Button 
            variant="ghost" 
            onClick={handleNext}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            {t('skip_step_for_now')}
          </Button>
        </div>
      </div>
    </OnboardingStep>
  )
}
