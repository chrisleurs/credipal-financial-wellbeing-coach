
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Target, Calculator, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import { AIMotivationalService } from '@/services/aiMotivationalService'
import type { Debt } from '@/domains/debts/types/debt.types'

interface DebtPayment {
  id: string
  debt_id: string
  user_id: string
  amount: number
  payment_date: string
  notes?: string
  created_at: string
}

interface ScenarioAnalysisProps {
  isOpen: boolean
  onClose: () => void
  debt: Debt | null
  payments: DebtPayment[]
}

export default function ScenarioAnalysis({ isOpen, onClose, debt, payments }: ScenarioAnalysisProps) {
  const [extraPayment, setExtraPayment] = useState('100')
  const [scenarios, setScenarios] = useState({
    current: { months: 0, totalInterest: 0, totalPayment: 0 },
    optimistic: { months: 0, totalInterest: 0, totalPayment: 0, saved: 0 },
    pessimistic: { months: 0, totalInterest: 0, totalPayment: 0, cost: 0 }
  })

  // Convert domain debt to legacy format for AI service compatibility
  const legacyDebt = debt ? {
    id: debt.id,
    user_id: debt.user_id,
    creditor_name: debt.creditor,
    total_amount: debt.original_amount,
    current_balance: debt.current_balance,
    annual_interest_rate: debt.interest_rate,
    minimum_payment: debt.monthly_payment,
    due_day: 1, // Default value
    description: debt.description,
    created_at: debt.created_at,
    updated_at: debt.updated_at
  } : null

  const aiMessages = legacyDebt ? {
    positive: AIMotivationalService.generateMotivationalMessage(legacyDebt, payments, 'positive'),
    negative: AIMotivationalService.generateMotivationalMessage(legacyDebt, payments, 'negative'),
    progress: AIMotivationalService.generateMotivationalMessage(legacyDebt, payments, 'progress')
  } : {
    positive: { message: 'No debt data available', actionSuggestion: '' },
    negative: { message: 'No debt data available', actionSuggestion: '' },
    progress: { message: 'No debt data available', actionSuggestion: '' }
  }

  useEffect(() => {
    if (debt) {
      calculateScenarios()
    }
  }, [debt, extraPayment])

  const calculateScenarios = () => {
    if (!debt) return

    const balance = debt.current_balance
    const monthlyPayment = debt.monthly_payment
    const annualRate = debt.interest_rate
    const monthlyRate = annualRate / 100 / 12
    const extraAmount = parseFloat(extraPayment) || 0

    // Current scenario
    const currentScenario = calculatePayoffScenario(balance, monthlyPayment, monthlyRate)
    
    // Optimistic scenario (with extra payment)
    const optimisticScenario = calculatePayoffScenario(balance, monthlyPayment + extraAmount, monthlyRate)
    const monthsSaved = currentScenario.months - optimisticScenario.months
    const interestSaved = currentScenario.totalInterest - optimisticScenario.totalInterest
    
    // Pessimistic scenario (missed payment)
    const missedPaymentCost = balance * monthlyRate
    const lateFeesEstimate = monthlyPayment * 0.05 // 5% late fee
    const pessimisticCost = missedPaymentCost + lateFeesEstimate

    setScenarios({
      current: currentScenario,
      optimistic: {
        ...optimisticScenario,
        saved: Math.max(0, interestSaved)
      },
      pessimistic: {
        ...currentScenario,
        cost: pessimisticCost
      }
    })
  }

  const calculatePayoffScenario = (balance: number, payment: number, monthlyRate: number) => {
    if (monthlyRate === 0) {
      const months = Math.ceil(balance / payment)
      return {
        months,
        totalInterest: 0,
        totalPayment: balance
      }
    }

    if (payment <= balance * monthlyRate) {
      return {
        months: 999,
        totalInterest: 999999,
        totalPayment: 999999
      }
    }

    const months = Math.ceil(
      -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate)
    )

    const totalPayment = payment * months
    const totalInterest = totalPayment - balance

    return {
      months,
      totalInterest: Math.max(0, totalInterest),
      totalPayment
    }
  }

  const formatMonths = (months: number) => {
    if (months > 999) return '∞'
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (years > 0) {
      return `${years}a ${remainingMonths}m`
    }
    return `${months}m`
  }

  if (!debt) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Análisis de Escenarios - {debt.creditor}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Debt Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Situación Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Actual</p>
                  <p className="text-xl font-bold text-destructive">
                    ${debt.current_balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pago Mínimo</p>
                  <p className="text-xl font-bold text-warning">
                    ${debt.monthly_payment.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasa Anual</p>
                  <p className="text-xl font-bold text-primary">
                    {debt.interest_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progreso</p>
                  <p className="text-xl font-bold text-success">
                    {Math.round(((debt.original_amount - debt.current_balance) / debt.original_amount) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Progress Message */}
          <Card className="border-l-4 border-l-primary bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-primary mb-2">Tu Asistente Financiero</p>
                  <p className="text-foreground">{aiMessages.progress.message}</p>
                  {aiMessages.progress.actionSuggestion && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      💡 {aiMessages.progress.actionSuggestion}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extra Payment Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Calculadora de Pagos Extra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="extraPayment">Pago extra mensual</Label>
                  <Input
                    id="extraPayment"
                    type="number"
                    placeholder="100"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setExtraPayment('50')}
                  >
                    $50
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setExtraPayment('100')}
                  >
                    $100
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setExtraPayment('200')}
                  >
                    $200
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Tabs */}
          <Tabs defaultValue="optimistic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="optimistic" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Escenario Positivo
              </TabsTrigger>
              <TabsTrigger value="current" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Escenario Actual
              </TabsTrigger>
              <TabsTrigger value="pessimistic" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Escenario Negativo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="optimistic">
              <Card className="border-l-4 border-l-success bg-success/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    Escenario Positivo: Pagos Extra
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Tiempo de Pago</p>
                      <p className="text-xl font-bold text-success">
                        {formatMonths(scenarios.optimistic.months)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Intereses Totales</p>
                      <p className="text-xl font-bold text-success">
                        ${scenarios.optimistic.totalInterest.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Meses Ahorrados</p>
                      <p className="text-xl font-bold text-primary">
                        {scenarios.current.months - scenarios.optimistic.months}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dinero Ahorrado</p>
                      <p className="text-xl font-bold text-primary">
                        ${scenarios.optimistic.saved.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-1" />
                      <div>
                        <p className="font-medium text-success mb-2">Mensaje Motivacional</p>
                        <p className="text-foreground">{aiMessages.positive.message}</p>
                        {aiMessages.positive.actionSuggestion && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            💡 {aiMessages.positive.actionSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="current">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Escenario Actual: Solo Pagos Mínimos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Tiempo de Pago</p>
                      <p className="text-xl font-bold text-warning">
                        {formatMonths(scenarios.current.months)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Intereses Totales</p>
                      <p className="text-xl font-bold text-destructive">
                        ${scenarios.current.totalInterest.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pago Total</p>
                      <p className="text-xl font-bold text-foreground">
                        ${scenarios.current.totalPayment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pessimistic">
              <Card className="border-l-4 border-l-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Escenario Negativo: Pagos Perdidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Costo por Mes Perdido</p>
                      <p className="text-xl font-bold text-destructive">
                        ${scenarios.pessimistic.cost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interés Adicional</p>
                      <p className="text-xl font-bold text-destructive">
                        ${(debt.current_balance * (debt.interest_rate / 100 / 12)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posibles Recargos</p>
                      <p className="text-xl font-bold text-destructive">
                        ${(debt.monthly_payment * 0.05).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                      <div>
                        <p className="font-medium text-destructive mb-2">Consideraciones Importantes</p>
                        <p className="text-foreground">{aiMessages.negative.message}</p>
                        {aiMessages.negative.actionSuggestion && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            💡 {aiMessages.negative.actionSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={onClose} className="bg-gradient-primary">
              Cerrar Análisis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
