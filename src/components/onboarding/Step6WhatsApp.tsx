
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
  const { financialData, setWhatsAppOptIn, completeOnboarding } = useFinancialStore()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const [isLoading, setIsLoading] = useState(false)

  const handleFinish = async (optIn: boolean) => {
    console.log('handleFinish called with optIn:', optIn)
    
    try {
      setIsLoading(true)
      
      // Update WhatsApp opt-in preference
      setWhatsAppOptIn(optIn)
      console.log('WhatsApp opt-in set to:', optIn)
      
      // Mark onboarding as complete in local store
      completeOnboarding()
      console.log('Local onboarding completed')
      
      // Update onboarding status in database
      await updateOnboardingStatus(true)
      console.log('Database onboarding status updated')
      
      // Navigate to dashboard - Fixed navigation
      console.log('Navigating to dashboard...')
      navigate('/dashboard', { replace: true })
      console.log('Navigation to dashboard triggered')
      
    } catch (error) {
      console.error('Error in handleFinish:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleYesClick = () => {
    console.log('Yes button clicked - accepting WhatsApp')
    handleFinish(true)
  }

  const handleNoClick = () => {
    console.log('No button clicked - declining WhatsApp')
    handleFinish(false)
  }

  const handleSkip = async () => {
    console.log('Skip button clicked - going directly to dashboard')
    try {
      setIsLoading(true)
      
      // Mark onboarding as complete even if skipped
      completeOnboarding()
      await updateOnboardingStatus(true)
      
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Error in handleSkip:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <OnboardingStep
      currentStep={5}
      totalSteps={6}
      title="¿Te gustaría recibir consejos por WhatsApp?"
      subtitle="Credipal puede enviarte recordatorios, tips financieros y responder tus preguntas por WhatsApp."
      onNext={() => {}} // No se usa
      onBack={onBack}
      canProceed={true}
      nextButtonText="Continuar"
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
            onClick={handleSkip}
            disabled={isLoading}
            variant="ghost"
            className="w-full text-gray-500 py-2 rounded-xl hover:bg-gray-50"
          >
            {isLoading ? 'Cargando...' : 'Saltar configuración e ir al dashboard'}
          </Button>
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
