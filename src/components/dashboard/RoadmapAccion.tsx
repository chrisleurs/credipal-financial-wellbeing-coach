
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  PlayCircle, 
  Calendar,
  ChevronRight,
  Target,
  AlertCircle
} from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { useToast } from '@/hooks/use-toast'

interface AccionStep {
  paso: number
  titulo: string
  descripcion?: string
  fechaObjetivo: string
  completado: boolean
  enProgreso?: boolean
  impactoFinanciero?: number
  dificultad: 'facil' | 'medio' | 'dificil'
}

interface RoadmapAccionData {
  pasos: AccionStep[]
  progreso: number
  siguientePaso: number
}

interface RoadmapAccionProps {
  data: RoadmapAccionData
}

export const RoadmapAccion = ({ data }: RoadmapAccionProps) => {
  const { toast } = useToast()
  const [localData, setLocalData] = useState(data)

  const handleStartStep = (paso: number) => {
    setLocalData(prev => ({
      ...prev,
      pasos: prev.pasos.map(step => 
        step.paso === paso 
          ? { ...step, enProgreso: true }
          : step
      )
    }))

    toast({
      title: "Paso iniciado 🚀",
      description: `Has comenzado: ${localData.pasos.find(s => s.paso === paso)?.titulo}`,
    })
  }

  const handleCompleteStep = (paso: number) => {
    setLocalData(prev => ({
      ...prev,
      pasos: prev.pasos.map(step => 
        step.paso === paso 
          ? { ...step, completado: true, enProgreso: false }
          : step
      ),
      progreso: Math.min(100, prev.progreso + (100 / prev.pasos.length))
    }))

    toast({
      title: "¡Paso completado! ✅",
      description: "Has dado un paso más hacia tus objetivos financieros",
    })
  }

  const getStepIcon = (step: AccionStep) => {
    if (step.completado) {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    }
    if (step.enProgreso) {
      return <PlayCircle className="h-6 w-6 text-blue-500" />
    }
    return <Circle className="h-6 w-6 text-gray-400" />
  }

  const getStepStatus = (step: AccionStep) => {
    if (step.completado) return { text: 'Completado', color: 'bg-green-100 text-green-800' }
    if (step.enProgreso) return { text: 'En progreso', color: 'bg-blue-100 text-blue-800' }
    return { text: 'Pendiente', color: 'bg-gray-100 text-gray-600' }
  }

  const getDifficultyInfo = (dificultad: string) => {
    switch (dificultad) {
      case 'facil':
        return { text: 'Fácil', color: 'bg-green-100 text-green-700', icon: '🟢' }
      case 'medio':
        return { text: 'Medio', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' }
      case 'dificil':
        return { text: 'Difícil', color: 'bg-red-100 text-red-700', icon: '🔴' }
      default:
        return { text: 'Medio', color: 'bg-gray-100 text-gray-700', icon: '⚪' }
    }
  }

  const isOverdue = (fechaObjetivo: string) => {
    return new Date(fechaObjetivo) < new Date()
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Plan de Acción
        </CardTitle>
        <CardDescription>
          Pasos específicos para alcanzar tus objetivos financieros
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress overview */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Progreso general</span>
            <span className="text-sm font-semibold">{Math.round(localData.progreso)}%</span>
          </div>
          <Progress value={localData.progreso} className="h-3" />
          <div className="mt-2 text-sm text-gray-600">
            {localData.pasos.filter(p => p.completado).length} de {localData.pasos.length} pasos completados
          </div>
        </div>

        {/* Steps timeline */}
        <div className="space-y-6">
          {localData.pasos.map((step, index) => {
            const status = getStepStatus(step)
            const difficulty = getDifficultyInfo(step.dificultad)
            const overdue = isOverdue(step.fechaObjetivo) && !step.completado
            
            return (
              <div key={step.paso} className="relative">
                {/* Timeline connector */}
                {index < localData.pasos.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-16 bg-gray-200" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Step number/icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center relative">
                    {getStepIcon(step)}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {step.paso}
                    </div>
                  </div>
                  
                  {/* Step content */}
                  <Card className={`flex-1 transition-all duration-200 ${
                    step.completado 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : step.enProgreso
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                      : 'hover:shadow-md'
                  }`}>
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1">{step.titulo}</h4>
                          {step.descripcion && (
                            <p className="text-sm text-gray-600 mb-2">{step.descripcion}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge className={status.color}>
                            {status.text}
                          </Badge>
                          <Badge variant="outline" className={difficulty.color}>
                            {difficulty.icon} {difficulty.text}
                          </Badge>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Fecha objetivo:</span>
                          <span className={`font-medium ${overdue ? 'text-red-600' : ''}`}>
                            {new Date(step.fechaObjetivo).toLocaleDateString()}
                          </span>
                          {overdue && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        
                        {step.impactoFinanciero && (
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Impacto:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(step.impactoFinanciero)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!step.completado && !step.enProgreso && (
                          <Button
                            size="sm"
                            onClick={() => handleStartStep(step.paso)}
                            className="flex items-center gap-1"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Iniciar paso
                          </Button>
                        )}
                        
                        {step.enProgreso && !step.completado && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteStep(step.paso)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Completar
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          Ver detalles
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {localData.pasos.filter(p => p.completado).length}
            </div>
            <div className="text-sm text-green-700">Completados</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {localData.pasos.filter(p => p.enProgreso).length}
            </div>
            <div className="text-sm text-blue-700">En progreso</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {localData.pasos.filter(p => isOverdue(p.fechaObjetivo) && !p.completado).length}
            </div>
            <div className="text-sm text-yellow-700">Retrasados</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {localData.pasos.reduce((sum, p) => sum + (p.impactoFinanciero || 0), 0) > 0 
                ? formatCurrency(localData.pasos.reduce((sum, p) => sum + (p.impactoFinanciero || 0), 0))
                : '---'
              }
            </div>
            <div className="text-sm text-purple-700">Impacto total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
