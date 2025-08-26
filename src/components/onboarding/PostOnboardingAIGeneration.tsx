
import React, { useEffect, useState } from 'react'
import { PostOnboardingLoading } from './PostOnboardingLoading'
import { useFinancialStore } from '@/store/financialStore'
import { useToast } from '@/hooks/use-toast'

interface PostOnboardingAIGenerationProps {
  consolidatedData: any
  onPlanGenerated: (plan: any) => void
}

export const PostOnboardingAIGeneration: React.FC<PostOnboardingAIGenerationProps> = ({ 
  consolidatedData, 
  onPlanGenerated 
}) => {
  const { generateAIPlan, generateActionPlan, financialData } = useFinancialStore()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(true)
  const [generationError, setGenerationError] = useState<string | null>(null)

  useEffect(() => {
    const generatePlans = async () => {
      try {
        console.log('🤖 Starting AI plan generation...')
        setIsGenerating(true)
        setGenerationError(null)

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Generate AI plan with consolidated data
        console.log('📊 Generating AI plan with data:', consolidatedData)
        await generateAIPlan(consolidatedData || financialData)
        
        // Generate action plan
        console.log('📋 Generating action plan...')
        await generateActionPlan()

        // Small delay for UI smoothness
        await new Promise(resolve => setTimeout(resolve, 500))

        console.log('✅ AI plan generation completed successfully')
        
        toast({
          title: "¡Plan generado exitosamente!",
          description: "Tu plan financiero personalizado está listo"
        })

        // Call completion callback with success
        onPlanGenerated({ success: true, hasActivePlan: true })

      } catch (error) {
        console.error('❌ Error generating AI plan:', error)
        setGenerationError(error instanceof Error ? error.message : 'Error desconocido')
        
        toast({
          title: "Error al generar plan",
          description: "Continuaremos con el dashboard básico",
          variant: "destructive"
        })

        // Even on error, complete the flow
        setTimeout(() => {
          onPlanGenerated({ success: false, error })
        }, 1000)

      } finally {
        setIsGenerating(false)
      }
    }

    generatePlans()
  }, [consolidatedData, financialData, generateAIPlan, generateActionPlan, onPlanGenerated, toast])

  // Show error state briefly before completing
  if (generationError && !isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.394-1.787 1.581-3.032l-6.928-10.592a2.121 2.121 0 00-3.618 0l-6.928 10.592C1.374 18.213 2.228 20 3.768 20z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Problema temporal</h2>
          <p className="text-gray-600 mb-4">
            No se pudo generar el plan AI, pero puedes usar el dashboard básico
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo en un momento...
          </p>
        </div>
      </div>
    )
  }

  // Show loading animation
  return (
    <PostOnboardingLoading 
      onComplete={() => onPlanGenerated({ success: true, hasActivePlan: false })}
    />
  )
}
