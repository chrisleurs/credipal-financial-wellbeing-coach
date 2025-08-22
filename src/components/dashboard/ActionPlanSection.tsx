
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Circle, Sparkles, ListTodo } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const ActionPlanSection = () => {
  // Placeholder mientras se implementa la lógica real
  const isGeneratingTasks = true

  if (isGeneratingTasks) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Plan de Acción</h2>
          <Sparkles className="h-5 w-5 text-[#F59E0B]" />
        </div>
        
        <Card className="border-[#10B981]/20 bg-[#10B981]/5">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                <ListTodo className="h-6 w-6 text-[#10B981]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Creando tu plan de acción</p>
                <p className="text-sm text-gray-500 mb-3">
                  Identificando las mejores tareas para acelerar tu progreso
                </p>
                <LoadingSpinner size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estructura final preparada con placeholders
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Plan de Acción</h2>
        <Sparkles className="h-5 w-5 text-[#F59E0B]" />
      </div>
      
      <div className="space-y-2">
        {/* Tareas del plan se implementarán aquí */}
      </div>
    </div>
  )
}
