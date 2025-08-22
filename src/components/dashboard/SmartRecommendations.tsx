
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Target,
  Bell,
  ArrowRight,
  Plus,
  DollarSign
} from 'lucide-react'

interface SmartRecommendationsProps {
  consolidatedData: {
    monthlyIncome: number
    monthlyExpenses: number
    currentSavings: number
    savingsCapacity: number
    totalDebtBalance: number
    totalMonthlyDebtPayments: number
  }
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ 
  consolidatedData 
}) => {
  // Lógica derivada para recomendaciones inteligentes
  const getSmartRecommendations = () => {
    const recommendations = []

    // A) Primera vez - Sin ingresos
    if (consolidatedData.monthlyIncome === 0) {
      recommendations.push({
        type: 'onboarding',
        icon: Plus,
        title: 'Comienza tu registro financiero',
        message: 'Agrega tus ingresos para activar todas las funciones de CrediPal',
        cta: 'Agregar Ingresos',
        priority: 'high',
        action: () => {
          // Llamar función existente para agregar ingresos
          console.log('Navegando a agregar ingresos')
        }
      })
    }

    // B) Sin gastos registrados pero con ingresos
    if (consolidatedData.monthlyIncome > 0 && consolidatedData.monthlyExpenses === 0) {
      recommendations.push({
        type: 'expenses',
        icon: DollarSign,
        title: 'Registra tus gastos',
        message: 'Para crear un plan completo, necesitamos conocer tus gastos mensuales',
        cta: 'Registrar Gastos',
        priority: 'high',
        action: () => {
          console.log('Navegando a registrar gastos')
        }
      })
    }

    // C) Sin metas de ahorro
    if (consolidatedData.currentSavings === 0 && consolidatedData.savingsCapacity > 0) {
      recommendations.push({
        type: 'savings',
        icon: Target,
        title: 'Crea tu primera meta de ahorro',
        message: `Tienes $${consolidatedData.savingsCapacity.toLocaleString()} disponibles para ahorrar cada mes`,
        cta: 'Crear Meta',
        priority: 'medium',
        action: () => {
          console.log('Navegando a crear meta de ahorro')
        }
      })
    }

    // D) Deuda alta vs ingresos (>40%)
    if (consolidatedData.totalDebtBalance > 0 && consolidatedData.monthlyIncome > 0) {
      const debtRatio = (consolidatedData.totalMonthlyDebtPayments / consolidatedData.monthlyIncome) * 100
      if (debtRatio > 40) {
        recommendations.push({
          type: 'debt',
          icon: AlertTriangle,
          title: 'Optimiza tus pagos de deuda',
          message: `Tus pagos de deuda representan ${debtRatio.toFixed(0)}% de tus ingresos`,
          cta: 'Ver Estrategias',
          priority: 'high',
          action: () => {
            console.log('Navegando a estrategias de deuda')
          }
        })
      }
    }

    // E) Buen progreso - motivacional
    if (consolidatedData.savingsCapacity > 0 && consolidatedData.currentSavings > 0) {
      const monthsOfSavings = consolidatedData.currentSavings / consolidatedData.savingsCapacity
      if (monthsOfSavings >= 3) {
        recommendations.push({
          type: 'celebration',
          icon: TrendingUp,
          title: '¡Excelente progreso!',
          message: `Tienes ${monthsOfSavings.toFixed(1)} meses de ahorro acumulado. ¿Consideras invertir?`,
          cta: 'Explorar Inversiones',
          priority: 'low',
          action: () => {
            console.log('Navegando a opciones de inversión')
          }
        })
      }
    }

    // F) Recordatorio de pago próximo (simulado)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    if (consolidatedData.totalMonthlyDebtPayments > 0) {
      recommendations.push({
        type: 'reminder',
        icon: Calendar,
        title: 'Pago próximo detectado',
        message: 'Tienes pagos programados para esta semana',
        cta: 'Activar Recordatorio',
        priority: 'medium',
        action: () => {
          console.log('Activando recordatorio de pago')
        }
      })
    }

    return recommendations.slice(0, 4) // Máximo 4 recomendaciones
  }

  const recommendations = getSmartRecommendations()

  if (recommendations.length === 0) {
    return null
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'border-red-200 bg-red-50/50', badgeColor: 'bg-red-100 text-red-800' }
      case 'medium':
        return { color: 'border-yellow-200 bg-yellow-50/50', badgeColor: 'bg-yellow-100 text-yellow-800' }
      case 'low':
        return { color: 'border-green-200 bg-green-50/50', badgeColor: 'bg-green-100 text-green-800' }
      default:
        return { color: 'border-gray-200 bg-gray-50/50', badgeColor: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recomendaciones Personalizadas
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {recommendations.length} sugerencias
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation, index) => {
            const IconComponent = recommendation.icon
            const priorityConfig = getPriorityConfig(recommendation.priority)
            
            return (
              <div 
                key={index} 
                className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${priorityConfig.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{recommendation.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${priorityConfig.badgeColor} border-0`}
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {recommendation.message}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={recommendation.action}
                    >
                      {recommendation.cta}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
