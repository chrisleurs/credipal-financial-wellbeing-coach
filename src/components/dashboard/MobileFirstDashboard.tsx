
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Target,
  Brain,
  RefreshCw,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet
} from 'lucide-react'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PlanGenerationFlow } from '@/components/plan/PlanGenerationFlow'
import { PlanSummaryCard } from '@/components/plan/PlanSummaryCard'
import { SmartRecommendations } from './SmartRecommendations'
import { CrediAssistant } from './CrediAssistant'
import { formatCurrency } from '@/utils/helpers'
import { useToast } from '@/hooks/use-toast'

export const MobileFirstDashboard = () => {
  const { toast } = useToast()
  const { data: consolidatedData, isLoading: isLoadingData } = useConsolidatedFinancialData()
  const { 
    activePlan, 
    hasPlan, 
    generatePlan, 
    isGenerating, 
    isLoadingPlan,
    regeneratePlan 
  } = useFinancialPlanManager()
  
  const [showGenerationFlow, setShowGenerationFlow] = useState(false)

  // Loading state
  if (isLoadingData || isLoadingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu información financiera..." />
      </div>
    )
  }

  // No data state
  if (!consolidatedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No hay datos disponibles</h2>
            <p className="text-muted-foreground">
              Completa tu perfil financiero para ver tu dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Plan generation flow
  if (showGenerationFlow) {
    const planData = {
      monthlyIncome: consolidatedData.monthlyIncome,
      monthlyExpenses: consolidatedData.monthlyExpenses,
      currentSavings: consolidatedData.currentSavings,
      savingsCapacity: consolidatedData.savingsCapacity,
      debts: consolidatedData.debts.map(debt => ({
        name: debt.name,
        amount: debt.balance,
        monthlyPayment: debt.payment
      })),
      goals: consolidatedData.financialGoals,
      expenseCategories: consolidatedData.expenseCategories
    }

    return (
      <PlanGenerationFlow
        planData={planData}
        onPlanGenerated={() => {
          setShowGenerationFlow(false)
          toast({
            title: "¡Plan generado exitosamente!",
            description: "Tu plan financiero personalizado está listo.",
          })
        }}
      />
    )
  }

  const handleGeneratePlan = async () => {
    if (!consolidatedData.hasRealData) {
      toast({
        title: "Datos insuficientes",
        description: "Necesitas agregar más información financiera para generar un plan.",
        variant: "destructive"
      })
      return
    }

    setShowGenerationFlow(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mi Dashboard Financiero
          </h1>
          <p className="text-gray-600">
            Resumen completo de tu situación financiera
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(consolidatedData.monthlyIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Mensuales</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(consolidatedData.monthlyExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deudas</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(consolidatedData.totalDebtBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {consolidatedData.debts.length} deuda(s) activa(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacidad de Ahorro</CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(consolidatedData.savingsCapacity)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debts Detail */}
        {consolidatedData.debts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detalle de Deudas
                <Badge variant="secondary">{consolidatedData.debts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consolidatedData.debts.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        debt.source === 'kueski' ? 'bg-blue-500' :
                        debt.source === 'onboarding' ? 'bg-purple-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium">{debt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Pago mensual: {formatCurrency(debt.payment)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(debt.balance)}</p>
                      <Badge variant="outline" className="text-xs">
                        {debt.source === 'kueski' ? 'Kueski' :
                         debt.source === 'onboarding' ? 'Onboarding' : 'Sistema'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Section */}
        {hasPlan && activePlan ? (
          <div className="mb-8">
            <PlanSummaryCard 
              plan={activePlan as any}
              onUpdatePlan={regeneratePlan}
            />
          </div>
        ) : (
          <Card className="mb-8 border-2 border-dashed border-primary/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Genera tu Plan Financiero</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Deja que CrediPal analice tu información y genere un plan personalizado.
              </p>
              
              <Button 
                onClick={handleGeneratePlan}
                disabled={isGenerating || !consolidatedData.hasRealData}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generando Plan...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generar Plan Financiero
                  </>
                )}
              </Button>

              {!consolidatedData.hasRealData && (
                <p className="text-sm text-muted-foreground mt-4">
                  Agrega más información financiera para habilitar la generación del plan.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Smart Recommendations */}
        <div className="mb-8">
          <SmartRecommendations 
            consolidatedData={{
              ...consolidatedData,
              totalDebtBalance: consolidatedData.totalDebtBalance,
              totalMonthlyDebtPayments: consolidatedData.totalMonthlyDebtPayments
            }}
          />
        </div>

        {/* Credi Assistant */}
        <div className="mb-8">
          <CrediAssistant 
            message={{
              id: 'welcome',
              text: '¡Hola! Estoy aquí para ayudarte con tus finanzas. ¿En qué puedo asistirte hoy?',
              timestamp: new Date().toISOString(),
              type: 'motivational'
            }}
            onChat={() => {
              toast({
                title: "Chat con CrediPal",
                description: "Funcionalidad próximamente disponible.",
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}
