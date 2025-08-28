
/**
 * Componente de carga mejorado para consolidación de datos
 * Proporciona feedback claro durante el proceso
 */

import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Clock, Database } from 'lucide-react'

interface ConsolidationStep {
  id: string
  label: string
  completed: boolean
  duration: number
}

interface ConsolidationLoaderProps {
  onComplete?: () => void
  autoComplete?: boolean
}

export const ConsolidationLoader: React.FC<ConsolidationLoaderProps> = ({
  onComplete,
  autoComplete = true
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<ConsolidationStep[]>([
    { id: 'validate', label: 'Validando información', completed: false, duration: 1500 },
    { id: 'consolidate', label: 'Consolidando datos financieros', completed: false, duration: 2000 },
    { id: 'calculate', label: 'Calculando métricas', completed: false, duration: 1500 },
    { id: 'generate', label: 'Preparando tu dashboard', completed: false, duration: 1000 }
  ])

  useEffect(() => {
    if (!autoComplete) return

    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration))
        
        setSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, completed: true } : step
        ))
        setCurrentStep(i + 1)
      }

      // Esperar un poco antes de completar
      await new Promise(resolve => setTimeout(resolve, 800))
      onComplete?.()
    }

    processSteps()
  }, [autoComplete, onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Procesando tu información
          </h1>
          <p className="text-gray-600">
            CrediPal está organizando tus datos financieros para crear tu plan personalizado
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : index === currentStep ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <span className={`text-sm ${
                step.completed 
                  ? 'text-emerald-600 font-medium' 
                  : index === currentStep 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        <p className="text-xs text-gray-500">
          Esto tomará solo unos segundos...
        </p>
      </Card>
    </div>
  )
}
