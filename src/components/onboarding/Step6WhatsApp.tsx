
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Bell, CheckCircle, X } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'

interface Step6WhatsAppProps {
  onNext: () => void
  onBack: () => void
}

const Step6WhatsApp: React.FC<Step6WhatsAppProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const [whatsappOptin, setWhatsappOptin] = useState(
    financialData.whatsappOptin || false
  )

  const handleNext = () => {
    updateFinancialData({
      whatsappOptin
    })
    onNext()
  }

  const canProceed = true

  return (
    <OnboardingStep
      currentStep={5}
      totalSteps={9}
      title="¿Quieres recibir recordatorios por WhatsApp?"
      subtitle="Te enviaremos recordatorios útiles para mantenerte al día con tu plan financiero"
      onNext={handleNext}
      onBack={onBack}
      canProceed={canProceed}
      nextButtonText="Continuar"
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <MessageCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border-2 border-gray-100 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Recordatorios de tareas
                </h3>
                <p className="text-sm text-gray-600">
                  Te recordaremos completar las tareas de tu plan financiero
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Seguimiento de metas
                </h3>
                <p className="text-sm text-gray-600">
                  Actualizaciones sobre el progreso de tus metas financieras
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setWhatsappOptin(true)}
            className={`w-full py-4 rounded-xl transition-all ${
              whatsappOptin
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-700'
            }`}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Sí, quiero recibir recordatorios por WhatsApp
          </Button>

          <Button
            onClick={() => setWhatsappOptin(false)}
            variant="outline"
            className={`w-full py-4 rounded-xl transition-all ${
              !whatsappOptin
                ? 'border-gray-400 bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <X className="h-5 w-5 mr-2" />
            No, prefiero no recibir recordatorios
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            <strong>Nota:</strong> Solo enviaremos mensajes relacionados con tu plan financiero. 
            Puedes cambiar esta configuración en cualquier momento.
          </p>
        </div>
      </div>
    </OnboardingStep>
  )
}

export default Step6WhatsApp
