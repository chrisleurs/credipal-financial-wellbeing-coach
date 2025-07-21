
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface OnboardingStepProps {
  currentStep: number
  totalSteps: number
  title: string
  subtitle?: string
  children: React.ReactNode
  onNext: () => void
  onBack: () => void
  canProceed: boolean
  nextButtonText?: string
  isLoading?: boolean
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  canProceed,
  nextButtonText = "Continuar",
  isLoading = false
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div className="text-sm font-medium text-gray-600">
          Paso {currentStep + 1} de {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="bg-white/50 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="mb-8">
            {children}
          </div>

          <Button 
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {currentStep === totalSteps - 1 ? 'Ir al Dashboard' : nextButtonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingStep
