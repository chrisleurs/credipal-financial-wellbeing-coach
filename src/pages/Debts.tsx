
import React, { useState } from 'react'
import { Plus, CreditCard, DollarSign, Calendar, Calculator, TrendingUp, AlertTriangle, Target, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useDebts } from '@/hooks/useDebts'
import { useAuth } from '@/hooks/useAuth'
import { AIMotivationalService } from '@/services/aiMotivationalService'
import DebtModal from '@/components/debts/DebtModal'
import PaymentModal from '@/components/debts/PaymentModal'
import ScenarioAnalysis from '@/components/debts/ScenarioAnalysis'
import type { Debt } from '@/types/debt'

export default function Debts() {
  const { user } = useAuth()
  const { 
    debts, 
    payments, 
    isLoadingDebts, 
    createDebt, 
    updateDebt, 
    deleteDebt, 
    registerPayment, 
    isCreating, 
    isRegisteringPayment 
  } = useDebts()

  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  // Calculate totals and analytics
  const totalDebt = debts.reduce((sum, debt) => sum + debt.current_balance, 0)
  const totalOriginalDebt = debts.reduce((sum, debt) => sum + debt.total_amount, 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0)
  const totalPaid = totalOriginalDebt - totalDebt
  const overallProgress = totalOriginalDebt > 0 ? Math.round((totalPaid / totalOriginalDebt) * 100) : 0

  // Get overall AI message
  const getOverallAIMessage = () => {
    if (debts.length === 0) return null
    
    const avgProgress = overallProgress
    const upcomingDueDates = debts.filter(debt => {
      const today = new Date()
      const dueDate = new Date(today.getFullYear(), today.getMonth(), debt.due_day)
      if (dueDate < today) {
        dueDate.setMonth(dueDate.getMonth() + 1)
      }
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilDue <= 7
    })

    if (upcomingDueDates.length > 0) {
      return {
        type: 'warning' as const,
        message: `Tienes ${upcomingDueDates.length} pago(s) próximo(s) esta semana. Mantén tu momentum financiero al día para seguir progresando hacia tu libertad.`,
        icon: AlertTriangle
      }
    }

    if (avgProgress >= 75) {
      return {
        type: 'success' as const,
        message: `¡Increíble progreso! Has completado el ${avgProgress}% de tus deudas totales. Estás muy cerca de tu libertad financiera total. ¡No te detengas ahora!`,
        icon: Target
      }
    }

    if (avgProgress >= 50) {
      return {
        type: 'progress' as const,
        message: `¡Excelente trabajo! Has pagado el ${avgProgress}% de tus deudas. Estás en la recta final hacia tu independencia financiera. Cada pago cuenta.`,
        icon: TrendingUp
      }
    }

    return {
      type: 'info' as const,
      message: `Has progresado un ${avgProgress}% en tus deudas totales. Cada paso te acerca más a tu meta. La constancia es tu mejor aliada en este camino.`,
      icon: Calculator
    }
  }

  const overallMessage = getOverallAIMessage()

  // Get debt status color and urgency
  const getDebtStatus = (debt: Debt) => {
    const today = new Date()
    const dueDate = new Date(today.getFullYear(), today.getMonth(), debt.due_day)
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1)
    }
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilDue <= 3) return { color: 'destructive', urgency: 'high', message: `Vence en ${daysUntilDue} días` }
    if (daysUntilDue <= 7) return { color: 'warning', urgency: 'medium', message: `Vence en ${daysUntilDue} días` }
    return { color: 'secondary', urgency: 'low', message: `Vence el ${debt.due_day}` }
  }

  const handleCreateDebt = (debtData: Parameters<typeof createDebt>[0]) => {
    createDebt(debtData)
    setIsDebtModalOpen(false)
  }

  const handleUpdateDebt = (debtData: Parameters<typeof createDebt>[0]) => {
    if (editingDebt) {
      updateDebt({ id: editingDebt.id, ...debtData })
      setEditingDebt(null)
      setIsDebtModalOpen(false)
    }
  }

  const handleRegisterPayment = (paymentData: Parameters<typeof registerPayment>[0]) => {
    registerPayment(paymentData)
    setIsPaymentModalOpen(false)
    setSelectedDebt(null)
  }

  const openPaymentModal = (debt: Debt) => {
    setSelectedDebt(debt)
    setIsPaymentModalOpen(true)
  }

  const openScenarioModal = (debt: Debt) => {
    setSelectedDebt(debt)
    setIsScenarioModalOpen(true)
  }

  const openEditModal = (debt: Debt) => {
    setEditingDebt(debt)
    setIsDebtModalOpen(true)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Acceso Requerido</h3>
          <p className="text-muted-foreground">Inicia sesión para gestionar tus deudas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Deudas</h1>
          <p className="text-muted-foreground">Controla y libérate de tus deudas con estrategia</p>
        </div>
        
        <Button onClick={() => setIsDebtModalOpen(true)} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Deuda
        </Button>
      </div>

      {/* Overall AI Message */}
      {overallMessage && (
        <Card className={`border-l-4 ${
          overallMessage.type === 'success' ? 'border-l-success bg-success/5' :
          overallMessage.type === 'warning' ? 'border-l-warning bg-warning/5' :
          overallMessage.type === 'progress' ? 'border-l-primary bg-primary/5' :
          'border-l-info bg-info/5'
        }`}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <overallMessage.icon className={`h-5 w-5 mt-1 ${
                overallMessage.type === 'success' ? 'text-success' :
                overallMessage.type === 'warning' ? 'text-warning' :
                overallMessage.type === 'progress' ? 'text-primary' :
                'text-info'
              }`} />
              <div>
                <p className={`font-medium mb-2 ${
                  overallMessage.type === 'success' ? 'text-success' :
                  overallMessage.type === 'warning' ? 'text-warning' :
                  overallMessage.type === 'progress' ? 'text-primary' :
                  'text-info'
                }`}>
                  Tu Estratega Financiero
                </p>
                <p className="text-foreground">{overallMessage.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Deuda Total Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">${totalDebt.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              de ${totalOriginalDebt.toLocaleString()} original
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pagos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">${totalMonthlyPayments.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              Total mensual mínimo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progreso Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{overallProgress}%</p>
            <p className="text-xs text-muted-foreground">
              ${totalPaid.toLocaleString()} pagados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Número de Deudas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{debts.length}</p>
            <p className="text-xs text-muted-foreground">
              Deudas activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Debts List */}
      {isLoadingDebts ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando tus deudas...</p>
          </CardContent>
        </Card>
      ) : debts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No tienes deudas registradas</h3>
            <p className="text-muted-foreground mb-4">¡Excelente! Si tienes deudas, regístralas para crear tu estrategia de liberación.</p>
            <Button variant="outline" onClick={() => setIsDebtModalOpen(true)}>
              Agregar primera deuda
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {debts.map((debt) => {
            const progress = Math.round(((debt.total_amount - debt.current_balance) / debt.total_amount) * 100)
            const debtPayments = payments.filter(p => p.debt_id === debt.id)
            const status = getDebtStatus(debt)
            const aiMessage = AIMotivationalService.generateMotivationalMessage(debt, debtPayments)
            const monthsToPayOff = Math.ceil(debt.current_balance / debt.minimum_payment)
            
            return (
              <Card key={debt.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{debt.creditor_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={status.color as any} className="text-xs">
                            {status.message}
                          </Badge>
                          {status.urgency === 'high' && (
                            <Bell className="h-3 w-3 text-destructive animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openScenarioModal(debt)}
                      >
                        <Calculator className="h-4 w-4 mr-1" />
                        Análisis
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openPaymentModal(debt)}
                        className="bg-gradient-success"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pagar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso de Pago</span>
                      <span className="font-medium text-success">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>

                  {/* Debt Details */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Saldo Actual</p>
                      <p className="font-bold text-destructive">${debt.current_balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monto Original</p>
                      <p className="font-medium">${debt.total_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pago Mínimo</p>
                      <p className="font-medium text-warning">${debt.minimum_payment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tasa Anual</p>
                      <p className="font-medium">{debt.annual_interest_rate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Meses Restantes</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {monthsToPayOff}
                      </p>
                    </div>
                  </div>

                  {/* AI Motivational Message */}
                  <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-l-primary">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-primary mb-1">Tu Coach Financiero</p>
                        <p className="text-sm text-foreground">{aiMessage.message}</p>
                        {aiMessage.actionSuggestion && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            💡 {aiMessage.actionSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(debt)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteDebt(debt.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Recent Payments History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Historial de Pagos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments
                .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
                .slice(0, 10)
                .map((payment) => {
                  const debt = debts.find(d => d.id === payment.debt_id)
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-success/5">
                      <div>
                        <h4 className="font-medium text-foreground">{debt?.creditor_name || 'Deuda eliminada'}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                          {payment.notes && (
                            <span className="text-xs">• {payment.notes}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success">-${payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Pago registrado</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <DebtModal
        isOpen={isDebtModalOpen}
        onClose={() => {
          setIsDebtModalOpen(false)
          setEditingDebt(null)
        }}
        onSubmit={editingDebt ? handleUpdateDebt : handleCreateDebt}
        debt={editingDebt || undefined}
        isLoading={isCreating}
      />

      {selectedDebt && (
        <>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => {
              setIsPaymentModalOpen(false)
              setSelectedDebt(null)
            }}
            onSubmit={handleRegisterPayment}
            debt={selectedDebt}
            isLoading={isRegisteringPayment}
          />

          <ScenarioAnalysis
            isOpen={isScenarioModalOpen}
            onClose={() => {
              setIsScenarioModalOpen(false)
              setSelectedDebt(null)
            }}
            debt={selectedDebt}
            payments={payments.filter(p => p.debt_id === selectedDebt.id)}
          />
        </>
      )}
    </div>
  )
}
