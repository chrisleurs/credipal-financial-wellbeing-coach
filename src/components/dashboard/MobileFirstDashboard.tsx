
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlanGenerationFlow } from '@/components/plan/PlanGenerationFlow'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { useOptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { FinancialSummary } from './FinancialSummary'
import { QuickStatsGrid } from './QuickStatsGrid'
import { UpcomingPaymentsSection } from './UpcomingPaymentsSection'
import { FinancialGoalsSection } from './FinancialGoalsSection'
import { BigGoalsSection } from './BigGoalsSection'
import { MiniGoalsSection } from './MiniGoalsSection'
import { ActionPlanSection } from './ActionPlanSection'
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  DollarSign, 
  PlusCircle,
  Brain,
  CheckCircle2
} from 'lucide-react'

export const MobileFirstDashboard = () => {
  const [showPlanGeneration, setShowPlanGeneration] = useState(false)
  const { data: consolidatedData, isLoading } = useConsolidatedFinancialData()
  const { data: optimizedData } = useOptimizedFinancialData()
  const { activePlan, hasPlan, canGeneratePlan, generatePlan, isGenerating } = useFinancialPlanManager()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu información financiera...</p>
        </div>
      </div>
    )
  }

  if (!consolidatedData?.hasRealData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <DollarSign className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Completa tu perfil financiero!
            </h2>
            <p className="text-gray-600 mb-6">
              Necesitas agregar información sobre tus ingresos, gastos o metas para ver tu dashboard personalizado.
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/onboarding'} 
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Completar Información
          </Button>
        </div>
      </div>
    )
  }

  if (showPlanGeneration) {
    return (
      <PlanGenerationFlow 
        onPlanGenerated={() => {
          setShowPlanGeneration(false)
        }}
      />
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate quick metrics
  const monthlyBalance = consolidatedData.monthlyIncome - consolidatedData.monthlyExpenses
  const savingsRate = consolidatedData.monthlyIncome > 0 
    ? (consolidatedData.savingsCapacity / consolidatedData.monthlyIncome * 100) 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">¡Hola! 👋</h1>
            <p className="text-sm text-gray-600">Aquí está tu resumen financiero</p>
          </div>
          {!hasPlan && canGeneratePlan && (
            <Button 
              onClick={() => setShowPlanGeneration(true)}
              size="sm"
              className="bg-primary hover:bg-primary/90"
              disabled={isGenerating}
            >
              <Brain className="h-4 w-4 mr-2" />
              Crear Plan
            </Button>
          )}
        </div>

        {/* Quick Balance */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-3">
              <p className="text-xs opacity-90">Balance Mensual</p>
              <p className="text-lg font-bold">{formatCurrency(monthlyBalance)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-3">
              <p className="text-xs opacity-90">Tasa de Ahorro</p>
              <p className="text-lg font-bold">{savingsRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="resumen" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="metas" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Metas
            </TabsTrigger>
            <TabsTrigger value="plan" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Plan
            </TabsTrigger>
            <TabsTrigger value="pagos" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              Pagos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-4 mt-4">
            <FinancialSummary />
            <QuickStatsGrid />
          </TabsContent>

          <TabsContent value="metas" className="space-y-4 mt-4">
            <FinancialGoalsSection 
              goals={optimizedData?.activeGoals?.map((goal, index) => ({
                id: `goal-${index}`,
                title: goal.title,
                targetAmount: goal.target,
                currentAmount: goal.current,
                progress: goal.progress,
                source: 'onboarding' as const
              })) || []}
            />
            <BigGoalsSection 
              goals={[]}
              onUpdateGoal={() => {}}
              isUpdating={false}
            />
            <MiniGoalsSection />
          </TabsContent>

          <TabsContent value="plan" className="space-y-4 mt-4">
            {hasPlan ? (
              <ActionPlanSection />
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Crea tu Plan Financiero</h3>
                  <p className="text-gray-600 mb-4">
                    Genera un plan personalizado basado en tu situación financiera actual
                  </p>
                  <Button 
                    onClick={() => setShowPlanGeneration(true)}
                    className="w-full"
                    disabled={!canGeneratePlan || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Crear Plan Ahora
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pagos" className="space-y-4 mt-4">
            <UpcomingPaymentsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
