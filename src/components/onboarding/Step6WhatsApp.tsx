
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Smartphone, CheckCircle, X } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useNavigate } from 'react-router-dom'

interface Step6WhatsAppProps {
  onBack: () => void
}

const Step6WhatsApp: React.FC<Step6WhatsAppProps> = ({ onBack }) => {
  const navigate = useNavigate()
  const { setWhatsAppOptIn, completeOnboarding } = useFinancialStore()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const [isLoading, setIsLoading] = useState(false)

  const handleCompleteOnboarding = async (optIn: boolean) => {
    console.log('handleCompleteOnboarding called with optIn:', optIn)
    
    try {
      setIsLoading(true)
      
      // Update WhatsApp opt-in preference
      setWhatsAppOptIn(optIn)
      console.log('WhatsApp opt-in set to:', optIn)
      
      // Mark onboarding as complete in local store
      completeOnboarding()
      console.log('Local onboarding completed')
      
      // Update onboarding status in database
      console.log('Attempting to update database onboarding status...')
      await updateOnboardingStatus(true)
      console.log('Database onboarding status updated successfully')
      
      // Force navigation using both methods to ensure it works
      console.log('Forcing navigation to dashboard...')
      
      // Try React Router first
      navigate('/dashboard', { replace: true })
      
      // Force navigation with window.location as backup after a short delay
      setTimeout(() => {
        console.log('Using window.location.href as backup navigation')
        window.location.href = '/dashboard'
      }, 1000)
      
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

  const handleYesClick = () => {
    console.log('Yes button clicked - accepting WhatsApp')
    handleCompleteOnboarding(true)
  }

  const handleNoClick = () => {
    console.log('No button clicked - declining WhatsApp')
    handleCompleteOnboarding(false)
  }

  const handleSkipToDashboard = () => {
    console.log('Skip button clicked - going directly to dashboard')
    handleCompleteOnboarding(false)
  }

  const handleGoToDashboard = () => {
    console.log('Go to dashboard button clicked')
    handleCompleteOnboarding(false)
  }

  // Emergency escape function - direct navigation without any checks
  const forceEscapeToDashboard = () => {
    console.log('EMERGENCY: Force escaping to dashboard')
    window.location.href = '/dashboard'
  }

  return (
    <OnboardingStep
      currentStep={5}
      totalSteps={6}
      title="¿Te gustaría recibir consejos por WhatsApp?"
      subtitle="Credipal puede enviarte recordatorios, tips financieros y responder tus preguntas por WhatsApp."
      onNext={handleGoToDashboard}
      onBack={onBack}
      canProceed={true}
      nextButtonText="Ir al Dashboard"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* WhatsApp preview */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                <p className="text-sm text-gray-800">
                  ¡Hola! Te escribo para recordarte que hoy es un buen día para revisar tu presupuesto. ¿Cómo vas con tus metas? 💪
                </p>
              </div>
              <p className="text-xs text-green-600 mt-1">Credipal • ahora</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-gray-700">Recordatorios amigables para tus metas</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-gray-700">Tips financieros personalizados</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-gray-700">Respuestas rápidas a tus dudas</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-gray-700">Resúmenes mensuales de tu progreso</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleYesClick}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 rounded-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Completando...
              </div>
            ) : (
              <>
                <Smartphone className="h-5 w-5 mr-2" />
                Sí, quiero recibir ayuda por WhatsApp
              </>
            )}
          </Button>

          <Button
            onClick={handleNoClick}
            disabled={isLoading}
            variant="outline"
            className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Completando...
              </div>
            ) : (
              <>
                <X className="h-5 w-5 mr-2" />
                Continuar sin WhatsApp por ahora
              </>
            )}
          </Button>

          {/* Skip button for direct access */}
          <Button
            onClick={handleSkipToDashboard}
            disabled={isLoading}
            variant="ghost"
            className="w-full text-gray-500 py-2 rounded-xl hover:bg-gray-50"
          >
            {isLoading ? 'Cargando...' : 'Saltar e ir al dashboard'}
          </Button>

          {/* Emergency escape button - only shown if loading takes too long */}
          {isLoading && (
            <Button
              onClick={forceEscapeToDashboard}
              variant="destructive"
              className="w-full py-2 rounded-xl mt-4"
            >
              🚨 Escape de emergencia al dashboard
            </Button>
          )}
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            Puedes cambiar esta configuración en cualquier momento desde tu dashboard.
          </p>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step6WhatsApp
