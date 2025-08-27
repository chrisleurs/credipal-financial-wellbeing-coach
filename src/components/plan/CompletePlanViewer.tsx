
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calendar,
  CheckCircle,
  AlertCircle,
  PiggyBank,
  CreditCard,
  Building,
  Timer
} from 'lucide-react'
import type { FinancialPlan } from '@/types/financialPlan'

interface CompletePlanViewerProps {
  plan: FinancialPlan
  onUpdateProgress?: (actionId: string, progress: number) => void
}

export const CompletePlanViewer: React.FC<CompletePlanViewerProps> = ({ 
  plan, 
  onUpdateProgress 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha'
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  return (
    <div className="space-y-8">
      {/* Header del Plan */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">
                Tu Plan Financiero Personalizado
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Generado el {formatDate(plan.generatedAt)}
              </p>
            </div>
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              {plan.status === 'active' ? 'Activo' : plan.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Snapshot Financiero Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Situación Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Ingresos Mensuales</p>
                <p className="font-bold text-green-600">
                  {formatCurrency(plan.currentSnapshot?.monthlyIncome || 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Gastos Mensuales</p>
                <p className="font-bold text-orange-600">
                  {formatCurrency(plan.currentSnapshot?.monthlyExpenses || 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Deuda Total</p>
                <p className="font-bold text-red-600">
                  {formatCurrency(plan.currentSnapshot?.totalDebt || 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Ahorros Actuales</p>
                <p className="font-bold text-blue-600">
                  {formatCurrency(plan.currentSnapshot?.currentSavings || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Proyección a 12 Meses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Deuda Proyectada</p>
                <p className="font-bold text-green-600">
                  {formatCurrency(plan.projectedSnapshot?.debtIn12Months || 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Fondo de Emergencia</p>
                <p className="font-bold text-blue-600">
                  {formatCurrency(plan.projectedSnapshot?.emergencyFundIn12Months || 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Patrimonio Neto</p>
                <p className="font-bold text-purple-600">
                  {formatCurrency(plan.projectedSnapshot?.netWorthIn12Months || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presupuesto Recomendado */}
      {plan.recommendedBudget && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-purple-600" />
              Presupuesto Recomendado (50/30/20)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Necesidades</p>
                <p className="text-2xl font-bold text-green-600">
                  {plan.recommendedBudget.needs?.percentage || 50}%
                </p>
                <p className="text-sm font-medium">
                  {formatCurrency(plan.recommendedBudget.needs?.amount || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Estilo de Vida</p>
                <p className="text-2xl font-bold text-blue-600">
                  {plan.recommendedBudget.lifestyle?.percentage || 30}%
                </p>
                <p className="text-sm font-medium">
                  {formatCurrency(plan.recommendedBudget.lifestyle?.amount || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Ahorros</p>
                <p className="text-2xl font-bold text-purple-600">
                  {plan.recommendedBudget.savings?.percentage || 20}%
                </p>
                <p className="text-sm font-medium">
                  {formatCurrency(plan.recommendedBudget.savings?.amount || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan de Pago de Deudas */}
      {plan.debtPayoffPlan && plan.debtPayoffPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Plan de Pago de Deudas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.debtPayoffPlan.map((debt, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{debt.debtName}</h4>
                    <Badge variant="outline">
                      {formatDate(debt.payoffDate)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Balance Actual</p>
                      <p className="font-medium">{formatCurrency(debt.currentBalance)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pago Mensual</p>
                      <p className="font-medium">{formatCurrency(debt.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Interés Ahorrado</p>
                      <p className="font-medium text-green-600">{formatCurrency(debt.interestSaved)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fondo de Emergencia */}
      {plan.emergencyFund && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-orange-600" />
              Fondo de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progreso actual</span>
              <span>{formatCurrency(plan.emergencyFund.currentAmount)} / {formatCurrency(plan.emergencyFund.targetAmount)}</span>
            </div>
            <Progress 
              value={plan.emergencyFund.targetAmount > 0 ? (plan.emergencyFund.currentAmount / plan.emergencyFund.targetAmount) * 100 : 0} 
              className="h-3"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Ahorro Mensual</p>
                <p className="font-medium">{formatCurrency(plan.emergencyFund.monthlySaving)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha Estimada</p>
                <p className="font-medium">{formatDate(plan.emergencyFund.completionDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crecimiento Patrimonial */}
      {plan.wealthGrowth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Proyección de Crecimiento Patrimonial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Año 1</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(plan.wealthGrowth.year1)}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Año 3</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(plan.wealthGrowth.year3)}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Año 5</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(plan.wealthGrowth.year5)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metas a Corto Plazo */}
      {plan.shortTermGoals && (plan.shortTermGoals.weekly?.length > 0 || plan.shortTermGoals.monthly?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.shortTermGoals.weekly && plan.shortTermGoals.weekly.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-orange-600" />
                  Metas Semanales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.shortTermGoals.weekly.map((goal, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                      <Badge variant="outline">{goal.type}</Badge>
                    </div>
                    <Progress value={goal.target > 0 ? (goal.progress / goal.target) * 100 : 0} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(goal.progress)} / {formatCurrency(goal.target)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {plan.shortTermGoals.monthly && plan.shortTermGoals.monthly.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Metas Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.shortTermGoals.monthly.map((goal, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                      <Badge variant="outline">{goal.type}</Badge>
                    </div>
                    <Progress value={goal.target > 0 ? (goal.progress / goal.target) * 100 : 0} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(goal.progress)} / {formatCurrency(goal.target)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Roadmap de Acción */}
      {plan.actionRoadmap && plan.actionRoadmap.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Plan de Acción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.actionRoadmap.map((action, index) => (
                <div key={index} className={`p-4 border rounded-lg ${action.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        action.completed 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {action.completed ? <CheckCircle className="h-4 w-4" /> : action.step}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${action.completed ? 'text-green-800' : 'text-gray-900'}`}>
                          {action.title}
                        </h4>
                        {action.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Fecha objetivo: {formatDate(action.targetDate)}
                        </p>
                      </div>
                    </div>
                    {!action.completed && onUpdateProgress && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateProgress(action.step.toString(), 100)}
                        className="ml-2"
                      >
                        Completar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
