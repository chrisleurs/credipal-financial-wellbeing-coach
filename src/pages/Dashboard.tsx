
import React from 'react'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  CreditCard,
  PiggyBank,
  Calendar,
  BarChart3,
  Plus
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { FinancialPlanDashboard } from '@/components/dashboard/FinancialPlanDashboard'
import { ChartSection } from '@/components/dashboard/ChartSection'
import { formatCurrency } from '@/utils/helpers'

export default function Dashboard() {
  const { consolidatedData, isLoading, error } = useConsolidatedFinancialData()

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando tu información financiera...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
              <p className="text-muted-foreground mb-4">
                No se pudieron cargar tus datos financieros.
              </p>
              <Button onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  if (!consolidatedData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <PiggyBank className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">¡Bienvenido a CrediPal!</h2>
              <p className="text-muted-foreground mb-4">
                Comienza agregando tu información financiera para ver tu dashboard personalizado.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Configurar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const savingsRate = consolidatedData.monthlyIncome > 0 
    ? (consolidatedData.savingsCapacity / consolidatedData.monthlyIncome) * 100 
    : 0

  const debtToIncomeRatio = consolidatedData.monthlyIncome > 0
    ? (consolidatedData.totalMonthlyDebtPayments / consolidatedData.monthlyIncome) * 100
    : 0

  const emergencyFundMonths = consolidatedData.monthlyExpenses > 0
    ? consolidatedData.currentSavings / consolidatedData.monthlyExpenses
    : 0

  const getHealthScore = () => {
    let score = 0
    
    // Income vs expenses (40 points)
    if (consolidatedData.savingsCapacity >= 0) score += 40
    else if (consolidatedData.savingsCapacity >= -500) score += 20
    
    // Emergency fund (30 points)
    if (emergencyFundMonths >= 6) score += 30
    else if (emergencyFundMonths >= 3) score += 20
    else if (emergencyFundMonths >= 1) score += 10
    
    // Debt management (30 points)
    if (debtToIncomeRatio === 0) score += 30
    else if (debtToIncomeRatio <= 20) score += 20
    else if (debtToIncomeRatio <= 40) score += 10
    
    return Math.min(100, score)
  }

  const healthScore = getHealthScore()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excelente', variant: 'default' as const }
    if (score >= 60) return { label: 'Bueno', variant: 'secondary' as const }
    return { label: 'Necesita Mejora', variant: 'destructive' as const }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Financiero</h1>
            <p className="text-muted-foreground">
              Resumen de tu situación financiera actual
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Salud Financiera</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>
                  {healthScore}
                </span>
                <Badge variant={getScoreBadge(healthScore).variant}>
                  {getScoreBadge(healthScore).label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                consolidatedData.savingsCapacity >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(consolidatedData.savingsCapacity)}
              </div>
              <p className="text-xs text-muted-foreground">
                {savingsRate.toFixed(1)}% de tus ingresos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(consolidatedData.monthlyIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Base de tu presupuesto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Mensuales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(consolidatedData.monthlyExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((consolidatedData.monthlyExpenses / consolidatedData.monthlyIncome) * 100).toFixed(1)}% de ingresos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fondo de Emergencia</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(consolidatedData.currentSavings)}
              </div>
              <p className="text-xs text-muted-foreground">
                {emergencyFundMonths.toFixed(1)} meses de gastos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Health Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Financiero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ingresos</span>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(consolidatedData.monthlyIncome)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Gastos</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(consolidatedData.monthlyExpenses)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Pagos de Deuda</span>
                  <span className="font-medium text-orange-600">
                    -{formatCurrency(consolidatedData.totalMonthlyDebtPayments)}
                  </span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Balance Disponible</span>
                    <span className={`font-bold ${
                      consolidatedData.savingsCapacity >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(consolidatedData.savingsCapacity)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progreso de Metas</CardTitle>
            </CardHeader>
            <CardContent>
              {consolidatedData.financialGoals && consolidatedData.financialGoals.length > 0 ? (
                <div className="space-y-4">
                  {consolidatedData.financialGoals.slice(0, 3).map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{goal}</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    No tienes metas financieras configuradas
                  </p>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Meta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts and AI Plan */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ChartSection />
          </div>
          <div>
            <FinancialPlanDashboard />
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col p-4">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm">Agregar Gasto</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col p-4">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="text-sm">Nuevo Ingreso</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col p-4">
                <Target className="h-6 w-6 mb-2" />
                <span className="text-sm">Crear Meta</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col p-4">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm">Ver Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
