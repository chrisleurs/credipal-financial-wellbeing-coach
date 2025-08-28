
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { 
  MessageCircle, 
  Target, 
  TrendingUp, 
  DollarSign,
  PiggyBank,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Trophy
} from 'lucide-react'

export default function Coach() {
  const { data: consolidatedData, isLoading } = useConsolidatedData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const generateFinancialPlan = () => {
    if (!consolidatedData) return null

    const monthlyBalance = consolidatedData.monthlyIncome - consolidatedData.monthlyExpenses - consolidatedData.totalMonthlyDebtPayments
    const emergencyFundTarget = consolidatedData.monthlyExpenses * 6
    const debtFreeMonths = consolidatedData.totalDebtBalance > 0 ? 
      Math.ceil(consolidatedData.totalDebtBalance / Math.max(consolidatedData.totalMonthlyDebtPayments, monthlyBalance * 0.5)) : 0

    return {
      monthlyBalance,
      emergencyFundTarget,
      debtFreeMonths,
      savingsRate: consolidatedData.monthlyIncome > 0 ? (monthlyBalance / consolidatedData.monthlyIncome) * 100 : 0
    }
  }

  const plan = generateFinancialPlan()

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Preparando tu plan financiero personalizado..." />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!consolidatedData || !plan) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Datos insuficientes</h2>
              <p className="text-gray-600">
                Necesitamos más información financiera para crear tu plan personalizado.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const getHealthScore = () => {
    let score = 0
    if (consolidatedData.monthlyIncome > 0) score += 25
    if (plan.monthlyBalance > 0) score += 25
    if (consolidatedData.totalDebtBalance < consolidatedData.monthlyIncome * 3) score += 25
    if (plan.savingsRate > 10) score += 25
    return score
  }

  const healthScore = getHealthScore()

  return (
    <AppLayout>
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <div className="space-y-6">
          {/* Header with CrediPal Coach */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-blue-50 rounded-2xl p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tu Coach Financiero CrediPal
            </h1>
            <p className="text-gray-600 mb-4">
              Plan personalizado basado en tu situación actual
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${healthScore >= 75 ? 'bg-green-500' : healthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                Salud Financiera: {healthScore}%
              </span>
            </div>
          </div>

          {/* Resumen Financiero Actual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Tu Situación Financiera Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Ingresos Mensuales</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(consolidatedData.monthlyIncome)}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Gastos Mensuales</p>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(consolidatedData.monthlyExpenses)}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Deuda Total</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(consolidatedData.totalDebtBalance)}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Balance Mensual</p>
                  <p className={`text-xl font-bold ${plan.monthlyBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(plan.monthlyBalance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan de Acción Prioritario */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Tu Plan de Acción Prioritario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Paso 1: Manejo de Deudas */}
              {consolidatedData.totalDebtBalance > 0 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                        Eliminar Deudas (Prioridad Alta)
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Libérate de {formatCurrency(consolidatedData.totalDebtBalance)} en deudas
                      </p>
                    </div>
                    <Badge variant="destructive">Urgente</Badge>
                  </div>
                  <div className="space-y-3">
                    {consolidatedData.debts.map((debt, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{debt.creditor}</span>
                          <span className="text-red-600 font-bold">{formatCurrency(debt.balance)}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Pago mensual: {formatCurrency(debt.payment)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Estrategia:</strong> Con tus pagos actuales de {formatCurrency(consolidatedData.totalMonthlyDebtPayments)} mensuales, 
                      podrías estar libre de deudas en aproximadamente {plan.debtFreeMonths} meses.
                    </p>
                  </div>
                </div>
              )}

              {/* Paso 2: Fondo de Emergencia */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                      Crear Fondo de Emergencia
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Meta: {formatCurrency(plan.emergencyFundTarget)} (6 meses de gastos)
                    </p>
                  </div>
                  <Badge variant="secondary">Importante</Badge>
                </div>
                <div className="space-y-3">
                  <Progress value={0} className="h-3" />
                  <p className="text-sm text-gray-600">
                    Progreso actual: {formatCurrency(0)} / {formatCurrency(plan.emergencyFundTarget)}
                  </p>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Recomendación:</strong> Comienza ahorrando {formatCurrency(Math.max(500, plan.monthlyBalance * 0.2))} 
                      mensualmente una vez que reduzcas tus deudas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Paso 3: Crecimiento */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                      Hacer Crecer tu Patrimonio
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Inversiones y ahorro a largo plazo
                    </p>
                  </div>
                  <Badge variant="outline">Futuro</Badge>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Potencial:</strong> Una vez libre de deudas, podrías ahorrar hasta 
                    {formatCurrency(plan.monthlyBalance + consolidatedData.totalMonthlyDebtPayments)} mensualmente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consejos Personalizados del Coach */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Consejos Personalizados de CrediPal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.monthlyBalance < 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Atención: Balance Negativo</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Tus gastos superan tus ingresos por {formatCurrency(Math.abs(plan.monthlyBalance))}. 
                          Es crucial revisar y reducir gastos inmediatamente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Mensaje del Coach</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {consolidatedData.totalDebtBalance > 0 
                          ? `¡Hola! Veo que tienes ${formatCurrency(consolidatedData.totalDebtBalance)} en deudas. La buena noticia es que con disciplina y el plan correcto, puedes superarlo. Enfócate primero en la deuda con mayor interés.`
                          : `¡Excelente! No tienes deudas pendientes. Ahora es el momento perfecto para construir tu fondo de emergencia y comenzar a invertir.`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Tu Próximo Logro</h4>
                      <p className="text-sm text-green-700 mt-1">
                        {consolidatedData.totalDebtBalance > 0 
                          ? `Reduce tu primera deuda en ${formatCurrency(1000)}. ¡Estarás más cerca de la libertad financiera!`
                          : `Ahorra tu primer {formatCurrency(5000)} para el fondo de emergencia. ¡Cada peso cuenta!`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Proyectado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Tu Timeline Financiero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1M</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Primer Mes</h4>
                    <p className="text-sm text-gray-600">Organizar presupuesto y comenzar estrategia de deudas</p>
                  </div>
                </div>

                {consolidatedData.totalDebtBalance > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">{plan.debtFreeMonths}M</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Libre de Deudas</h4>
                      <p className="text-sm text-gray-600">
                        Eliminación completa de {formatCurrency(consolidatedData.totalDebtBalance)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">12M</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Fondo de Emergencia Completo</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(plan.emergencyFundTarget)} ahorrados para emergencias
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón de Acción */}
          <div className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <CheckCircle className="h-5 w-5 mr-2" />
              Comenzar Mi Plan Ahora
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Ve tu progreso detallado en la sección "Progreso"
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
