
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Loader2, Brain } from 'lucide-react'

interface PostOnboardingLoadingProps {
  onComplete: () => void
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export const PostOnboardingLoading: React.FC<PostOnboardingLoadingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Calculando tu capacidad de pago', completed: false },
    { id: '2', text: 'Diseñando tu estrategia de deuda', completed: false },
    { id: '3', text: 'Identificando tus metas financieras', completed: false },
    { id: '4', text: 'Preparando tu plan personalizado', completed: false }
  ])

  useEffect(() => {
    const totalDuration = 3500 // 3.5 segundos
    const stepDuration = totalDuration / checklist.length
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (totalDuration / 100))
        return Math.min(newProgress, 100)
      })
    }, 100)

    // Animar checklist secuencialmente
    checklist.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index)
        setChecklist(prev => prev.map((item, i) => 
          i <= index ? { ...item, completed: true } : item
        ))
      }, stepDuration * (index + 1))
    })

    // Completar y redirigir
    setTimeout(() => {
      clearInterval(interval)
      onComplete()
    }, totalDuration + 500)

    return () => clearInterval(interval)
  }, [onComplete, checklist.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Creando tu plan financiero
          </h1>
          <p className="text-gray-600">
            CrediPal está trabajando en tu estrategia personalizada
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress 
            value={progress} 
            className="h-3 bg-white/50 shadow-inner"
          />
          <div className="text-center mt-2">
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% completado
            </span>
          </div>
        </div>

        {/* Checklist */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {checklist.map((item, index) => (
                <div 
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    item.completed 
                      ? 'bg-green-50 border border-green-200' 
                      : currentStep === index
                        ? 'bg-primary/5 border border-primary/20'
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : currentStep === index ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    item.completed 
                      ? 'text-green-800' 
                      : currentStep === index
                        ? 'text-primary'
                        : 'text-gray-500'
                  }`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Esto solo tomará unos segundos...
          </p>
        </div>
      </div>
    </div>
  )
}
