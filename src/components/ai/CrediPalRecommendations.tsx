
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { Bot, TrendingUp, AlertTriangle, Target, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

interface AIRecommendation {
  id: string
  type: 'savings' | 'debt' | 'budget' | 'investment' | 'emergency'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimatedImpact: string
  actionSteps: string[]
}

interface FinancialContext {
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  totalDebt: number
  monthlyDebtPayments: number
  savingsCapacity: number
  goals: any[]
  debtToIncomeRatio: number
}

// Mock AI recommendations generator - replace with actual AI service
const generateAIRecommendations = async (context: FinancialContext): Promise<AIRecommendation[]> => {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const recommendations: AIRecommendation[] = []
  
  // High debt-to-income ratio recommendation
  if (context.debtToIncomeRatio > 0.3) {
    recommendations.push({
      id: '1',
      type: 'debt',
      title: 'Estrategia de Reducción de Deudas',
      description: `Tu ratio deuda/ingresos es del ${(context.debtToIncomeRatio * 100).toFixed(1)}%, que es alto. Te recomiendo priorizar el pago de deudas.`,
      priority: 'high',
      estimatedImpact: `Podrías ahorrar ${formatCurrency(context.monthlyDebtPayments * 0.2)} mensualmente en intereses`,
      actionSteps: [
        'Lista todas tus deudas por tasa de interés',
        'Aplica el método avalancha: paga primero las de mayor interés',
        'Considera consolidar deudas si es posible'
      ]
    })
  }
  
  // Emergency fund recommendation
  if (context.monthlyBalance > 0 && context.savingsCapacity < context.monthlyExpenses * 0.1) {
    recommendations.push({
      id: '2',
      type: 'emergency',
      title: 'Crear Fondo de Emergencia',
      description: 'Es crucial tener un fondo de emergencia para imprevistos financieros.',
      priority: 'high',
      estimatedImpact: 'Tranquilidad financiera y protección ante emergencias',
      actionSteps: [
        `Ahorra ${formatCurrency(context.monthlyExpenses * 0.1)} mensualmente`,
        'Meta inicial: 1 mes de gastos',
        'Meta final: 3-6 meses de gastos'
      ]
    })
  }
  
  // Budget optimization
  if (context.monthlyBalance < context.monthlyIncome * 0.2) {
    recommendations.push({
      id: '3',
      type: 'budget',
      title: 'Optimización del Presupuesto',
      description: 'Tu margen de ahorro es limitado. Analicemos oportunidades de optimización.',
      priority: 'medium',
      estimatedImpact: `Potencial ahorro de ${formatCurrency(context.monthlyIncome * 0.1)} mensual`,
      actionSteps: [
        'Revisa gastos no esenciales',
        'Aplica la regla 50/30/20',
        'Automatiza tus ahorros'
      ]
    })
  }
  
  // Investment recommendation
  if (context.monthlyBalance > context.monthlyIncome * 0.2) {
    recommendations.push({
      id: '4',
      type: 'investment',
      title: 'Oportunidades de Inversión',
      description: 'Tienes un buen excedente mensual. Considera opciones de inversión.',
      priority: 'medium',
      estimatedImpact: 'Crecimiento patrimonial a largo plazo',
      actionSteps: [
        'Completa tu fondo de emergencia primero',
        'Investiga fondos indexados de bajo costo',
        'Diversifica tus inversiones'
      ]
    })
  }
  
  return recommendations
}

export function CrediPalRecommendations() {
  const { consolidatedProfile, isLoading: dataLoading } = useConsolidatedFinancialData()
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  
  const generateRecommendations = async () => {
    if (!consolidatedProfile) return
    
    setIsGenerating(true)
    
    try {
      const context: FinancialContext = {
        monthlyIncome: consolidatedProfile.monthlyIncome,
        monthlyExpenses: consolidatedProfile.monthlyExpenses,
        monthlyBalance: consolidatedProfile.monthlyBalance,
        totalDebt: consolidatedProfile.totalDebtBalance,
        monthlyDebtPayments: consolidatedProfile.totalMonthlyDebtPayments,
        savingsCapacity: consolidatedProfile.monthlySavingsCapacity,
        goals: consolidatedProfile.goals,
        debtToIncomeRatio: consolidatedProfile.totalDebtBalance / (consolidatedProfile.monthlyIncome || 1)
      }
      
      console.log('🤖 Generating AI recommendations with context:', context)
      
      const aiRecommendations = await generateAIRecommendations(context)
      setRecommendations(aiRecommendations)
      setHasGenerated(true)
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Auto-generate recommendations when data is available
  useEffect(() => {
    if (consolidatedProfile && !hasGenerated && !isGenerating) {
      generateRecommendations()
    }
  }, [consolidatedProfile, hasGenerated, isGenerating])
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'debt': return AlertTriangle
      case 'savings': return DollarSign
      case 'investment': return TrendingUp
      case 'budget': return Target
      case 'emergency': return AlertTriangle
      default: return Bot
    }
  }
  
  if (dataLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <LoadingSpinner size="sm" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos financieros...</p>
        </CardContent>
      </Card>
    )
  }
  
  if (!consolidatedProfile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No hay datos suficientes para generar recomendaciones
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold">
            Recomendaciones Personalizadas de CrediPal
          </CardTitle>
          <p className="text-white/90 text-sm">
            Análisis inteligente basado en tus datos reales
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={generateRecommendations}
            disabled={isGenerating}
            variant="secondary" 
            className="bg-white text-primary hover:bg-white/90 font-semibold"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analizando...
              </>
            ) : (
              'Actualizar Recomendaciones'
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Resumen Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Ingresos</p>
              <p className="font-semibold">{formatCurrency(consolidatedProfile.monthlyIncome)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gastos</p>
              <p className="font-semibold">{formatCurrency(consolidatedProfile.monthlyExpenses)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Balance</p>
              <p className={`font-semibold ${consolidatedProfile.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(consolidatedProfile.monthlyBalance)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Deudas Total</p>
              <p className="font-semibold">{formatCurrency(consolidatedProfile.totalDebtBalance)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations */}
      {isGenerating ? (
        <Card>
          <CardContent className="p-8 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">CrediPal está analizando tus finanzas</p>
            <p className="text-muted-foreground">Generando recomendaciones personalizadas...</p>
          </CardContent>
        </Card>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recomendaciones Personalizadas</h3>
          {recommendations.map((rec) => {
            const IconComponent = getTypeIcon(rec.type)
            return (
              <Card key={rec.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                          {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {rec.description}
                      </p>
                      <div className="bg-muted p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-primary">
                          💡 Impacto Estimado: {rec.estimatedImpact}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-2">Pasos recomendados:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {rec.actionSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Haz clic en "Actualizar Recomendaciones" para obtener análisis personalizado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
