
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useOnboardingDataConsolidation } from '@/hooks/useOnboardingDataConsolidation'
import { useNavigate } from 'react-router-dom'

interface Step6CompleteProps {
  onBack: () => void
}

const Step6Complete: React.FC<Step6CompleteProps> = ({ onBack }) => {
  const navigate = useNavigate()
  const { completeOnboarding } = useFinancialStore()
  const { updateOnboardingStatus } = useOnboardingStatus()
  const { consolidateOnboardingData } = useOnboardingDataConsolidation()
  const [isLoading, setIsLoading] = useState(false)

  const handleCompleteOnboarding = async () => {
    console.log('handleCompleteOnboarding called')
    
    try {
      setIsLoading(true)
      
      // Mark onboarding as complete in local store
      completeOnboarding()
      console.log('Local onboarding completed')
      
      // Consolidar todos los datos del onboarding
      console.log('🔄 Consolidando datos del onboarding...')
      await consolidateOnboardingData()
      console.log('✅ Datos consolidados exitosamente')
      
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
      currentStep={5}
      totalSteps={6}
      title="¡Felicidades! Tu perfil está completo"
      subtitle="Has completado exitosamente tu configuración financiera. Ya puedes empezar a usar Credipal."
      onNext={handleCompleteOnboarding}
      onBack={onBack}
      canProceed={true}
      nextButtonText="Ir a mi dashboard"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Success illustration */}
        <div className="text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Todo listo para empezar!
          </h3>
          <p className="text-gray-600">
            Tu perfil financiero está configurado y listo para ayudarte a alcanzar tus metas.
          </p>
        </div>

        {/* What's next */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-3">¿Qué sigue?</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Revisa tu dashboard financiero personalizado</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Explora tus recomendaciones financieras</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Comienza a registrar tus gastos diarios</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Chatea con Credi, tu asistente financiero</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <Button
          onClick={handleCompleteOnboarding}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 rounded-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando datos...
            </div>
          ) : (
            <>
              Empezar a usar Credipal
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </OnboardingStep>
  )
}

export default Step6Complete
