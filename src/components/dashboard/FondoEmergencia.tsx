
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Shield, Settings, TrendingUp, Calendar, Target } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

interface FondoEmergenciaData {
  metaTotal: number
  progresoActual: number
  ahorroMensual: number
  fechaCompletion: string
}

interface FondoEmergenciaProps {
  data: FondoEmergenciaData
}

export const FondoEmergencia: React.FC<FondoEmergenciaProps> = ({ data }) => {
  const porcentajeProgreso = Math.min(Math.round((data.progresoActual / data.metaTotal) * 100), 100)
  const mesesFaltantes = data.ahorroMensual > 0 
    ? Math.max(0, Math.ceil((data.metaTotal - data.progresoActual) / Math.abs(data.ahorroMensual)))
    : 0
  
  // Determinar el estado del fondo
  const getStatusColor = () => {
    if (porcentajeProgreso >= 100) return 'text-green-600'
    if (porcentajeProgreso >= 75) return 'text-blue-600'
    if (porcentajeProgreso >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusMessage = () => {
    if (porcentajeProgreso >= 100) return '¡Meta completada! 🎉'
    if (porcentajeProgreso >= 75) return 'Muy cerca de tu meta'
    if (porcentajeProgreso >= 50) return 'Progreso sólido'
    if (porcentajeProgreso >= 25) return 'Buen comienzo'
    return 'Empezando tu fondo'
  }

  return (
    <Card className="mb-8 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-6 w-6 text-blue-500" />
          Fondo de Emergencia
        </CardTitle>
        <CardDescription className="text-base">
          Tu colchón financiero para imprevistos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Estado y progreso principal */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Progreso actual</span>
            <div className="text-right">
              <div className={`text-lg font-bold ${getStatusColor()}`}>
                {porcentajeProgreso}%
              </div>
              <div className="text-xs text-muted-foreground">
                {getStatusMessage()}
              </div>
            </div>
          </div>
          
          <Progress 
            value={porcentajeProgreso} 
            className="h-4 bg-muted/50" 
          />
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-muted-foreground">
              {formatCurrency(Math.max(0, data.progresoActual))}
            </span>
            <span className="font-semibold text-muted-foreground">
              {formatCurrency(data.metaTotal)}
            </span>
          </div>
        </div>

        {/* Métricas en grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.ahorroMensual >= 0 ? formatCurrency(data.ahorroMensual) : formatCurrency(0)}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Ahorro mensual</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-800">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mesesFaltantes}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              {mesesFaltantes === 1 ? 'Mes restante' : 'Meses restantes'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {new Date(data.fechaCompletion).toLocaleDateString('es-ES', {
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Fecha objetivo</div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recomendación</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {porcentajeProgreso >= 100 
              ? "¡Felicidades! Has alcanzado tu meta de fondo de emergencia. Mantén este monto disponible para situaciones imprevistas."
              : `Tu fondo de emergencia debería cubrir entre 3-6 meses de gastos. Con tu ahorro actual, alcanzarás tu meta en ${mesesFaltantes} ${mesesFaltantes === 1 ? 'mes' : 'meses'}.`
            }
          </p>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Ajustar meta
          </Button>
          {porcentajeProgreso < 100 && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Aumentar ahorro
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
