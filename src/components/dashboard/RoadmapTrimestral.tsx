
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, Target, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

interface TrimestreData {
  trimestre: string
  ahorroObjetivo: number
  ahorroAcumulado: number
  deudaPendiente: number
  porcentajeAvance: number
  hitos: string[]
  completado: boolean
}

interface RoadmapTrimestralData {
  trimestres: TrimestreData[]
  metaAnual: number
}

interface RoadmapTrimestralProps {
  data: RoadmapTrimestralData
}

export const RoadmapTrimestral = ({ data }: RoadmapTrimestralProps) => {
  const getStatusColor = (porcentaje: number, completado: boolean) => {
    if (completado) return 'bg-green-500'
    if (porcentaje >= 75) return 'bg-blue-500'
    if (porcentaje >= 50) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getStatusText = (porcentaje: number, completado: boolean) => {
    if (completado) return 'Completado'
    if (porcentaje >= 75) return 'En progreso'
    if (porcentaje >= 25) return 'Iniciado'
    return 'Pendiente'
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Roadmap Trimestral
        </CardTitle>
        <CardDescription>
          Tu progreso financiero por trimestres del año
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Header con meta anual */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(data.metaAnual)}
            </div>
            <div className="text-sm text-blue-700">
              Meta de ahorro anual
            </div>
          </div>
        </div>

        {/* Grid responsivo de trimestres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.trimestres.map((trimestre, index) => (
            <Card key={trimestre.trimestre} className="relative overflow-hidden">
              {/* Status indicator */}
              <div 
                className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(trimestre.porcentajeAvance, trimestre.completado)}`} 
              />
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{trimestre.trimestre}</h3>
                    <Badge 
                      variant={trimestre.completado ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {getStatusText(trimestre.porcentajeAvance, trimestre.completado)}
                    </Badge>
                  </div>
                  {trimestre.completado && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progreso</span>
                    <span className="text-sm font-medium">{trimestre.porcentajeAvance}%</span>
                  </div>
                  <Progress 
                    value={trimestre.porcentajeAvance} 
                    className="h-2"
                  />
                </div>

                {/* Métricas */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Ahorro objetivo:
                    </span>
                    <span className="font-semibold">{formatCurrency(trimestre.ahorroObjetivo)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Ahorro acumulado:
                    </span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(trimestre.ahorroAcumulado)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Deuda pendiente:</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(trimestre.deudaPendiente)}
                    </span>
                  </div>
                </div>

                {/* Hitos */}
                {trimestre.hitos && trimestre.hitos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Hitos clave:</h4>
                    <ul className="space-y-1">
                      {trimestre.hitos.map((hito, hitoIndex) => (
                        <li key={hitoIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {hito}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">
                {data.trimestres.filter(t => t.completado).length}/4
              </div>
              <div className="text-sm text-gray-600">Trimestres completados</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(data.trimestres.reduce((sum, t) => sum + t.ahorroAcumulado, 0))}
              </div>
              <div className="text-sm text-gray-600">Ahorro total acumulado</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {Math.round(data.trimestres.reduce((sum, t) => sum + t.porcentajeAvance, 0) / 4)}%
              </div>
              <div className="text-sm text-gray-600">Progreso promedio</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
