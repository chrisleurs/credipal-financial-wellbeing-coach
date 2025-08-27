
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/helpers'
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Clock,
  Lightbulb,
  AlertTriangle
} from 'lucide-react'

interface ComprehensivePlanViewProps {
  plan: any // Using any since the plan structure can vary from OpenAI
}

export const ComprehensivePlanView: React.FC<ComprehensivePlanViewProps> = ({ plan }) => {
  
  // Helper function to safely format currency
  const safeCurrency = (amount: number | undefined) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0'
    return formatCurrency(amount)
  }

  // Extract key metrics
  const monthlyBalance = plan?.monthlyBalance || plan?.snapshotInicial?.hoy?.ingresos - plan?.snapshotInicial?.hoy?.gastos || 0
  const projectedSavings = plan?.projectedSavings || plan?.crecimientoPatrimonial?.año1 || 0
  const timeEstimate = plan?.timeEstimate || '12 meses'
  const motivationalMessage = plan?.motivationalMessage || 'Tu plan financiero está diseñado para tu éxito'

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Plan Generado por IA</CardTitle>
              <p className="text-blue-700 text-sm mt-1">{motivationalMessage}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {safeCurrency(monthlyBalance)}
            </div>
            <p className="text-sm text-gray-600">Balance Mensual</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {safeCurrency(projectedSavings)}
            </div>
            <p className="text-sm text-gray-600">Ahorro Proyectado</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {timeEstimate}
            </div>
            <p className="text-sm text-gray-600">Timeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {plan?.goals?.length || plan?.metasCortoPlazo?.semanales?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Metas Activas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommendations */}
        {(plan?.recommendations || plan?.analysis) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Recomendaciones de IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan?.recommendations?.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                )) || (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <p className="text-blue-800 leading-relaxed">
                      {plan?.analysis || 'Plan financiero personalizado generado exitosamente'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals Progress */}
        {plan?.goals && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Metas Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {plan.goals.map((goal: any, index: number) => (
                  <div key={goal.id || index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{goal.title || `Meta ${index + 1}`}</h4>
                        <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                          {goal.status === 'completed' ? 'Completada' : 'En Progreso'}
                        </Badge>
                      </div>
                      {goal.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <Progress value={goal.progress || 0} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{Math.round(goal.progress || 0)}% completado</span>
                      <span>
                        {safeCurrency(goal.currentAmount)} / {safeCurrency(goal.targetAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Fund */}
        {plan?.fondoEmergencia && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Fondo de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progreso</span>
                  <span className="text-sm font-medium">
                    {safeCurrency(plan.fondoEmergencia.progresoActual)} / {safeCurrency(plan.fondoEmergencia.metaTotal)}
                  </span>
                </div>
                <Progress 
                  value={(plan.fondoEmergencia.progresoActual / plan.fondoEmergencia.metaTotal) * 100} 
                  className="h-3" 
                />
                <div className="text-sm text-gray-600">
                  <p>Ahorro mensual: {safeCurrency(plan.fondoEmergencia.ahorroMensual)}</p>
                  <p>Fecha estimada: {plan.fondoEmergencia.fechaCompletion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Priority Actions */}
        {plan?.priorityActions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Acciones Prioritarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.priorityActions.map((action: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{action.action}</h4>
                    <p className="text-sm text-gray-600 mb-2">{action.impact}</p>
                    <Badge variant="outline">{action.timeline}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Breakdown */}
        {plan?.presupuestoMensual && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Presupuesto Recomendado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Necesidades ({plan.presupuestoMensual.necesidades.porcentaje}%)</span>
                  <span className="font-bold text-red-600">
                    {safeCurrency(plan.presupuestoMensual.necesidades.cantidad)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Estilo de Vida ({plan.presupuestoMensual.estiloVida.porcentaje}%)</span>
                  <span className="font-bold text-yellow-600">
                    {safeCurrency(plan.presupuestoMensual.estiloVida.cantidad)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Ahorro ({plan.presupuestoMensual.ahorro.porcentaje}%)</span>
                  <span className="font-bold text-green-600">
                    {safeCurrency(plan.presupuestoMensual.ahorro.cantidad)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
