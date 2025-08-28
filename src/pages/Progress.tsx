import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress as ProgressBar } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart,
  BarChart3,
  Calendar,
  Award,
  Zap,
  CheckCircle,
  Clock,
  DollarSign,
  CreditCard,
  PiggyBank
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart,
  Pie,
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts'

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6']

export default function Progress() {
  const { data: consolidatedData, isLoading } = useConsolidatedData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const calculateMetrics = () => {
    if (!consolidatedData) return null

    const monthlyBalance = consolidatedData.monthlyIncome - consolidatedData.monthlyExpenses - consolidatedData.totalMonthlyDebtPayments
    const emergencyFundTarget = consolidatedData.monthlyExpenses * 6
    const debtPayoffProgress = consolidatedData.totalDebtBalance > 0 ? 
      ((consolidatedData.debts.reduce((acc, debt) => acc + (debt.balance * 0.1), 0) / consolidatedData.totalDebtBalance) * 100) : 100
    
    const savingsRate = consolidatedData.monthlyIncome > 0 ? (monthlyBalance / consolidatedData.monthlyIncome) * 100 : 0
    const debtToIncomeRatio = consolidatedData.monthlyIncome > 0 ? (consolidatedData.totalDebtBalance / (consolidatedData.monthlyIncome * 12)) * 100 : 0

    return {
      monthlyBalance,
      emergencyFundTarget,
      debtPayoffProgress: Math.max(0, Math.min(100, debtPayoffProgress)),
      savingsRate,
      debtToIncomeRatio,
      emergencyFundProgress: 0, // TODO: Connect to actual savings data
      overallHealthScore: Math.max(0, 100 - debtToIncomeRatio + savingsRate)
    }
  }

  const generateTimelineData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    return months.map((month, index) => ({
      month,
      deuda: Math.max(0, (consolidatedData?.totalDebtBalance || 0) - (index * 2000)),
      ahorros: index * 1500,
      patrimonio: (index * 1500) - Math.max(0, (consolidatedData?.totalDebtBalance || 0) - (index * 2000))
    }))
  }

  const generateExpenseData = () => {
    if (!consolidatedData?.expenseCategories) {
      // Datos de ejemplo que incluyen rent/mortgage
      return [
        { name: 'Housing & Utilities', value: 12000, percentage: '40.0' },
        { name: 'Food & Dining', value: 8000, percentage: '26.7' },
        { name: 'Transportation', value: 6000, percentage: '20.0' },
        { name: 'Bills & Services', value: 4000, percentage: '13.3' }
      ]
    }
    
    // Asegurar que Housing & Utilities esté incluido en las categorías
    const categories = { ...consolidatedData.expenseCategories }
    
    // Si no hay Housing & Utilities, pero hay gastos, estimamos un 30-40% para vivienda
    if (!categories['Housing & Utilities'] && consolidatedData.monthlyExpenses > 0) {
      categories['Housing & Utilities'] = consolidatedData.monthlyExpenses * 0.35
    }
    
    return Object.entries(categories).map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / consolidatedData.monthlyExpenses) * 100).toFixed(1)
    }))
  }

  const metrics = calculateMetrics()
  const timelineData = generateTimelineData()
  const expenseData = generateExpenseData()

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Analizando tu progreso financiero..." />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!consolidatedData || !metrics) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-6xl">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sin datos para mostrar</h2>
              <p className="text-gray-600">
                Completa tu información financiera para ver tu progreso.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4 pb-20 max-w-6xl">
        <div className="space-y-6">
          {/* Header con CrediPal */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tu Progreso Financiero
            </h1>
            <p className="text-gray-600">
              Seguimiento detallado de tus metas con CrediPal
            </p>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Salud Financiera</p>
                    <p className="text-2xl font-bold text-green-700">
                      {Math.round(metrics.overallHealthScore)}%
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <ProgressBar value={metrics.overallHealthScore} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Tasa de Ahorro</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {Math.round(metrics.savingsRate)}%
                    </p>
                  </div>
                  <PiggyBank className="h-8 w-8 text-blue-600" />
                </div>
                <ProgressBar value={Math.max(0, metrics.savingsRate)} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Progreso Deudas</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {Math.round(metrics.debtPayoffProgress)}%
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
                <ProgressBar value={metrics.debtPayoffProgress} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Balance Mensual</p>
                    <p className={`text-2xl font-bold ${metrics.monthlyBalance >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
                      {formatCurrency(metrics.monthlyBalance)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficas Principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución de Gastos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Distribución de Gastos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {expenseData.slice(0, 4).map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Proyección Patrimonial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Proyección de Patrimonio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                      <Area 
                        type="monotone" 
                        dataKey="patrimonio" 
                        stackId="1"
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.6}
                        name="Patrimonio Neto"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ahorros" 
                        stackId="2"
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6}
                        name="Ahorros"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metas y Progreso Detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progreso de Deudas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-red-600" />
                  Eliminación de Deudas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {consolidatedData.debts.map((debt, index) => {
                  const progress = Math.min(100, (debt.payment / debt.balance) * 100 * 6)
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{debt.creditor}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(debt.balance)}
                        </span>
                      </div>
                      <ProgressBar value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Pago mensual: {formatCurrency(debt.payment)}</span>
                        <span>{Math.round(progress)}% completado</span>
                      </div>
                    </div>
                  )
                })}
                {consolidatedData.debts.length === 0 && (
                  <div className="text-center py-8 text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3" />
                    <p className="font-medium">¡Sin deudas pendientes!</p>
                    <p className="text-sm text-gray-600">¡Excelente trabajo!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fondo de Emergencia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-blue-600" />
                  Fondo de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${metrics.emergencyFundProgress * 3.51} 351`}
                        className="text-blue-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {Math.round(metrics.emergencyFundProgress)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Meta: {formatCurrency(metrics.emergencyFundTarget)}
                    </p>
                    <p className="text-xs text-gray-600">
                      6 meses de gastos básicos
                    </p>
                    <Badge variant="outline" className="mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.ceil(metrics.emergencyFundTarget / Math.max(500, metrics.monthlyBalance))} meses restantes
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logros y Siguiente Acción */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Plan Creado</p>
                    <p className="text-xs text-gray-600">Tu roadmap financiero está listo</p>
                  </div>
                </div>
                
                {metrics.savingsRate > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Balance Positivo</p>
                      <p className="text-xs text-gray-600">Tienes capacidad de ahorro</p>
                    </div>
                  </div>
                )}

                {consolidatedData.debts.length === 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Pocas Deudas</p>
                      <p className="text-xs text-gray-600">Situación manejable</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Próxima Acción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consolidatedData.totalDebtBalance > 0 ? (
                    <div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
                      <h4 className="font-medium text-red-800 mb-2">Prioridad Alta</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Realiza un pago extra de {formatCurrency(500)} a tu deuda con mayor interés
                      </p>
                      <Badge variant="destructive">Esta semana</Badge>
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                      <h4 className="font-medium text-green-800 mb-2">¡Excelente!</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Destina {formatCurrency(1000)} a tu fondo de emergencia
                      </p>
                      <Badge variant="default">Este mes</Badge>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      💡 Consejo: Revisa tu progreso cada semana
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
