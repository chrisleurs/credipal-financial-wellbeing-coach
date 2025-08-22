
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/helpers'
import { 
  Target, 
  Shield, 
  TrendingUp, 
  CreditCard,
  PiggyBank,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface CrediPalPlanViewProps {
  consolidatedData: {
    monthlyIncome: number
    monthlyExpenses: number
    totalDebtBalance: number
    totalMonthlyDebtPayments: number
    currentSavings: number
    savingsCapacity: number
    debts: Array<{
      id: string
      creditor: string
      current_balance: number
      monthly_payment: number
      interest_rate: number
    }>
  }
}

export const CrediPalPlanView: React.FC<CrediPalPlanViewProps> = ({ consolidatedData }) => {
  // 1. Cálculos para Snapshot Inicial
  const netIncome = consolidatedData.monthlyIncome
  const expenses = consolidatedData.monthlyExpenses
  const totalDebt = consolidatedData.totalDebtBalance
  const currentSavings = consolidatedData.currentSavings
  
  // Proyección 12 meses (usando capacidad de ahorro existente)
  const monthlySurplus = Math.max(0, netIncome - expenses - consolidatedData.totalMonthlyDebtPayments)
  const projectedDebtReduction = Math.min(totalDebt, monthlySurplus * 0.7 * 12)
  const projectedSavings = currentSavings + (monthlySurplus * 0.3 * 12)
  
  const projectedYear1Position = totalDebt > projectedDebtReduction 
    ? `Deuda reducida a ${formatCurrency(totalDebt - projectedDebtReduction)} + ${formatCurrency(projectedSavings)} ahorrados`
    : `Libre de deuda + ${formatCurrency(projectedSavings + (projectedDebtReduction - totalDebt))} ahorrados`

  // 2. Los 3 Hitos a 12 meses
  const emergencyFundTarget = expenses * 6
  const milestones = [
    {
      id: 'debt-elimination',
      title: 'Eliminar Deudas de Alto Interés',
      icon: CreditCard,
      target: totalDebt,
      current: 0,
      progress: 0,
      timeframe: '4-6 meses',
      status: totalDebt > 0 ? 'pending' : 'completed'
    },
    {
      id: 'emergency-fund',
      title: 'Fondo de Emergencia',
      icon: Shield,
      target: emergencyFundTarget,
      current: currentSavings,
      progress: Math.min((currentSavings / emergencyFundTarget) * 100, 100),
      timeframe: '6-8 meses',
      status: currentSavings >= emergencyFundTarget ? 'completed' : 'in_progress'
    },
    {
      id: 'investment-start',
      title: 'Ahorro e Inversión',
      icon: TrendingUp,
      target: netIncome * 3,
      current: 0,
      progress: 0,
      timeframe: '8-12 meses',
      status: 'pending'
    }
  ]

  // 3. Presupuesto Mensual (distribución calculada)
  const budgetDistribution = {
    essentials: expenses,
    flexible: Math.max(0, monthlySurplus * 0.8),
    debtAndSavings: Math.max(0, monthlySurplus * 0.2),
    debtAndSavingsPercentage: monthlySurplus > 0 ? 20 : 0
  }

  // 4. Ruta de Pago de Deuda
  const debtPayoffSchedule = consolidatedData.debts.map(debt => ({
    creditor: debt.creditor,
    balance: debt.current_balance,
    monthsToPayoff: debt.monthly_payment > 0 ? Math.ceil(debt.current_balance / debt.monthly_payment) : 0,
    interestSaved: Math.round(debt.current_balance * (debt.interest_rate / 100) * 0.5)
  }))

  const totalInterestSaved = debtPayoffSchedule.reduce((sum, item) => sum + item.interestSaved, 0)

  // 5. Crecimiento de Patrimonio (proyecciones conservadoras 5%)
  const monthlyInvestment = monthlySurplus * 0.3
  const year1Target = monthlyInvestment * 12
  const year3Target = year1Target * 3 + (year1Target * 0.15)
  const year5Target = year1Target * 5 + (year1Target * 0.40)

  // 6. Tracker Trimestral
  const quarterlyTargets = [
    {
      quarter: 'Q1 2025',
      savingsTarget: emergencyFundTarget * 0.25,
      debtReductionTarget: totalDebt * 0.25,
      progressPercentage: 0
    },
    {
      quarter: 'Q2 2025',
      savingsTarget: emergencyFundTarget * 0.5,
      debtReductionTarget: totalDebt * 0.5,
      progressPercentage: 0
    },
    {
      quarter: 'Q3 2025',
      savingsTarget: emergencyFundTarget * 0.75,
      debtReductionTarget: totalDebt * 0.75,
      progressPercentage: 0
    },
    {
      quarter: 'Q4 2025',
      savingsTarget: emergencyFundTarget,
      debtReductionTarget: totalDebt,
      progressPercentage: 0
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  if (netIncome === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tu Plan Financiero Te Espera</h3>
            <p className="text-muted-foreground mb-4">
              Agrega tus ingresos y gastos para que CrediPal genere tu plan personalizado siguiendo la metodología 3.2.1
            </p>
            <Button>Agregar mis datos</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Snapshot Inicial */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            📸 Fotografía Financiera Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Ingreso Mensual</p>
              <p className="text-2xl font-bold">{formatCurrency(netIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gastos Mensuales</p>
              <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deuda Total</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ahorro Actual</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(currentSavings)}</p>
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🎯 Proyección a 12 meses:</h4>
            <p className="text-lg">{projectedYear1Position}</p>
          </div>
        </CardContent>
      </Card>

      {/* Los 3 Hitos Principales */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🎯 Tus 3 Hitos Financieros (Metodología 3.2.1)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((milestone, index) => {
            const IconComponent = milestone.icon
            return (
              <Card key={milestone.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{index + 1}</Badge>
                    {getStatusIcon(milestone.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{milestone.timeframe}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>{Math.round(milestone.progress)}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Actual</p>
                        <p className="font-semibold">{formatCurrency(milestone.current)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Meta</p>
                        <p className="font-semibold">{formatCurrency(milestone.target)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Presupuesto Mensual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            💰 Tu Presupuesto Mensual Optimizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Necesidades Esenciales</p>
              <p className="text-2xl font-bold">{formatCurrency(budgetDistribution.essentials)}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Gastos Flexibles</p>
              <p className="text-2xl font-bold">{formatCurrency(budgetDistribution.flexible)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Deuda + Ahorro ({budgetDistribution.debtAndSavingsPercentage}%)</p>
              <p className="text-2xl font-bold">{formatCurrency(budgetDistribution.debtAndSavings)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Con {formatCurrency(netIncome)} mensuales: cubre gastos esenciales, mantén flexibilidad y destina 
            {formatCurrency(budgetDistribution.debtAndSavings)} para avanzar hacia tus metas financieras.
          </p>
        </CardContent>
      </Card>

      {/* Ruta de Pago de Deuda */}
      {totalDebt > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              🚀 Ruta de Eliminación de Deudas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mb-4">
              {debtPayoffSchedule.map((debt, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{debt.creditor}</p>
                    <p className="text-sm text-muted-foreground">
                      {debt.monthsToPayoff > 0 ? `${debt.monthsToPayoff} meses para liquidar` : 'Definir pago mensual'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(debt.balance)}</p>
                    <p className="text-sm text-green-600">Ahorras {formatCurrency(debt.interestSaved)} en intereses</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold text-green-800">
                💰 Total de intereses ahorrados: {formatCurrency(totalInterestSaved)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crecimiento de Patrimonio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            📈 Proyección de Crecimiento Patrimonial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Año 1</p>
              <p className="text-2xl font-bold">{formatCurrency(year1Target)}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Año 3</p>
              <p className="text-2xl font-bold">{formatCurrency(year3Target)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Año 5</p>
              <p className="text-2xl font-bold">{formatCurrency(year5Target)}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Invirtiendo {formatCurrency(monthlyInvestment)} mensuales, en 5 años podrías tener {formatCurrency(year5Target)}. 
            Esto te acerca significativamente a la independencia financiera.
          </p>
        </CardContent>
      </Card>

      {/* Tracker Trimestral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            📅 Plan de Acción Trimestral 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {quarterlyTargets.map((quarter, index) => (
              <div key={quarter.quarter} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{quarter.quarter}</h4>
                  <p className="text-sm text-muted-foreground">
                    Meta ahorro: {formatCurrency(quarter.savingsTarget)} | 
                    Reducir deuda: {formatCurrency(quarter.debtReductionTarget)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {index === 0 ? "Actual" : "Próximo"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold">🎯 Plan de Acción por Fases:</h4>
            <div className="grid gap-3">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <h5 className="font-semibold text-red-800">Fase 1: Eliminación de Deuda (0-6 meses)</h5>
                <p className="text-sm text-red-700">Enfocar recursos extra en eliminar deudas de alto interés</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h5 className="font-semibold text-blue-800">Fase 2: Construcción de Fondo (4-8 meses)</h5>
                <p className="text-sm text-blue-700">Construir fondo de emergencia mientras terminas con las deudas</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h5 className="font-semibold text-green-800">Fase 3: Crecimiento de Patrimonio (6-12 meses)</h5>
                <p className="text-sm text-green-700">Comenzar inversiones sistemáticas para crecimiento a largo plazo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
