
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/helpers'
import { 
  Target, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

export const CrediPalDashboard = () => {
  const { generatedPlan, isGenerating, error, regeneratePlan } = useFinancialPlanGenerator()

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="CrediPal está generando tu plan financiero personalizado..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={regeneratePlan}>Intentar de nuevo</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!generatedPlan) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Target className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header con CrediPal branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">CrediPal</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            {generatedPlan.motivationalMessage}
          </p>
          <Button variant="outline" onClick={regeneratePlan}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Actualizar Plan
          </Button>
        </div>

        {/* Sección de Objetivos Principales */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Tus Objetivos Financieros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPlan.goals.map((goal) => (
              <Card key={goal.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{goal.emoji}</span>
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {goal.type === 'short' ? 'Corto plazo' : 
                           goal.type === 'medium' ? 'Mediano plazo' : 'Largo plazo'}
                        </Badge>
                      </div>
                    </div>
                    {getStatusIcon(goal.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span className="font-medium">{Math.round(goal.progress)}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Actual:</span>
                      <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Meta:</span>
                      <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Fecha límite:</span>
                      <span className="font-medium">
                        {new Date(goal.deadline).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      disabled={goal.status === 'completed'}
                    >
                      {goal.actionText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Próximos Pagos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Próximos Pagos
          </h2>
          {generatedPlan.nextPayments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedPlan.nextPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{payment.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {payment.type === 'debt' ? 'Pago de deuda' : 'Meta de ahorro'}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(payment.priority)}>
                        {payment.priority === 'high' ? 'Alta' : 
                         payment.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monto:</span>
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Vencimiento:</span>
                        <span className="text-sm">
                          {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-medium mb-2">¡Sin pagos pendientes!</h3>
                <p className="text-muted-foreground">
                  Excelente trabajo manteniendo tus finanzas al día.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Próximas Metas a Cumplir */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Próximas Metas a Cumplir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedPlan.upcomingMilestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <Badge variant="outline">
                      {new Date(milestone.targetDate).toLocaleDateString('es-ES')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {milestone.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span className="font-medium">{Math.round(milestone.progress)}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recomendaciones de CrediPal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {generatedPlan.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
