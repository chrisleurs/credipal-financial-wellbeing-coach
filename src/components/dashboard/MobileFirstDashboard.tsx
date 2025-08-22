
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCurrency } from '@/utils/helpers'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useAuth } from '@/hooks/useAuth'
import { 
  PiggyBank,
  TrendingUp,
  Calendar,
  Target,
  Bell,
  CreditCard,
  Plus,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Wallet
} from 'lucide-react'

export const MobileFirstDashboard = () => {
  const { user } = useAuth()
  const { dashboardData, isLoading } = useFinancialPlan()
  const { consolidatedData } = useConsolidatedFinancialData()

  // Default data if not available
  const safeConsolidatedData = consolidatedData || {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    savingsCapacity: 0,
    totalDebtBalance: 0,
    totalMonthlyDebtPayments: 0
  }

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    }
    return 'Usuario'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = getUserName()
    
    if (hour < 12) return `¡Hola ${name}!`
    if (hour < 18) return `¡Buenas tardes ${name}!`
    return `¡Buenas noches ${name}!`
  }

  const getInMyPocket = () => {
    return Math.max(0, safeConsolidatedData.monthlyIncome - safeConsolidatedData.monthlyExpenses - safeConsolidatedData.totalMonthlyDebtPayments)
  }

  const getMainGoalProgress = () => {
    if (!dashboardData?.goals?.length) return 0
    return dashboardData.goals[0]?.progress || 0
  }

  const getUpcomingPayments = () => {
    const payments = []
    if (safeConsolidatedData.totalMonthlyDebtPayments > 0) {
      payments.push({
        id: '1',
        name: 'Pago de Deudas',
        amount: safeConsolidatedData.totalMonthlyDebtPayments,
        dueDate: 'En 3 días',
        urgent: true,
        type: 'debt'
      })
    }
    return payments
  }

  const getQuickActions = () => [
    { id: '1', title: 'Revisar gastos del mes', completed: false, impact: 'Alto' },
    { id: '2', title: 'Programar pago automático', completed: false, impact: 'Medio' },
    { id: '3', title: 'Actualizar meta de ahorro', completed: true, impact: 'Alto' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-pulse space-y-4 w-full max-w-sm">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <PiggyBank className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{getGreeting()}</h1>
              <p className="text-xs text-gray-500">Tu coach financiero</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </div>
            <Avatar className="h-8 w-8 ml-2">
              <AvatarFallback className="bg-primary text-white text-xs font-bold">
                {getUserName().slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Hero Card - Financial Snapshot */}
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <Wallet className="h-4 w-4" />
                En Mi Bolsillo
              </div>
              <div className="text-3xl font-bold mb-1">{formatCurrency(getInMyPocket())}</div>
              <p className="text-white/80 text-sm">Disponible hasta tu próximo ingreso</p>
            </div>

            {/* Progress Ring */}
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="opacity-20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${getMainGoalProgress() * 2.2} 220`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">{Math.round(getMainGoalProgress())}%</span>
                  <span className="text-xs opacity-80">Meta</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white/90 text-sm mb-4">
                {dashboardData?.crediMessage?.text || "¡Excelente progreso! Sigues por buen camino 🚀"}
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Ver Mi Plan Completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Próximos Pagos</h2>
            <Badge variant="outline" className="text-xs">
              {getUpcomingPayments().length}
            </Badge>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {getUpcomingPayments().map((payment) => (
              <Card key={payment.id} className="flex-shrink-0 w-64 border-red-200 bg-red-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-sm">{payment.name}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {payment.dueDate}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{formatCurrency(payment.amount)}</span>
                    <Button size="sm" className="h-8">
                      Pagar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {getUpcomingPayments().length === 0 && (
              <Card className="flex-shrink-0 w-64">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">¡Todo al día!</p>
                  <p className="text-xs text-gray-500">No hay pagos pendientes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mini Goals */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Mis Objetivos</h2>
          <div className="grid grid-cols-2 gap-3">
            {dashboardData?.goals?.slice(0, 4).map((goal, index) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">{goal.emoji || ['🎯', '💰', '🏠', '🚗'][index]}</div>
                    <h3 className="font-semibold text-sm mb-2 truncate">{goal.title}</h3>
                    <div className="relative w-12 h-12 mx-auto mb-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${goal.progress * 2.51} 251`}
                          className="text-primary transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold">{Math.round(goal.progress)}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                </CardContent>
              </Card>
            )) || [1, 2, 3, 4].map((i) => (
              <Card key={i} className="opacity-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm text-gray-500">Crea tu meta #{i}</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-6 text-xs">
                    + Agregar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Plan de Acción</h2>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          
          <div className="space-y-2">
            {getQuickActions().map((action) => (
              <Card key={action.id} className={`${action.completed ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      action.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {action.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {action.title}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        Impacto {action.impact}
                      </Badge>
                    </div>
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Gastos del Mes</p>
              <p className="font-bold">{formatCurrency(safeConsolidatedData.monthlyExpenses)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <PiggyBank className="h-5 w-5 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Ahorros</p>
              <p className="font-bold">{formatCurrency(safeConsolidatedData.currentSavings)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CreditCard className="h-5 w-5 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Deuda Total</p>
              <p className="font-bold">{formatCurrency(safeConsolidatedData.totalDebtBalance)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Meta Anual</p>
              <p className="font-bold">{formatCurrency(safeConsolidatedData.savingsCapacity * 12)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
