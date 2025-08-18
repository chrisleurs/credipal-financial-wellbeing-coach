import React, { useState } from 'react'
import { Plus, CreditCard, TrendingDown, AlertCircle, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DebtModal from '@/components/debts/DebtModal'
import PaymentModal from '@/components/debts/PaymentModal'
import ScenarioAnalysis from '@/components/debts/ScenarioAnalysis'
import { useDebts } from '@/hooks/useDebts'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import type { Debt } from '@/types/database'

export default function Debts() {
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const { 
    debts, 
    totalDebt, 
    totalMonthlyPayments,
    createDebt, 
    updateDebt, 
    deleteDebt, 
    registerPayment,
    isCreating,
    isUpdating,
    isDeleting,
    isRegisteringPayment
  } = useDebts()

  const { data: consolidatedData } = useConsolidatedFinancialData()

  // Calculate summary from existing debts or consolidated data
  const totalDebtBalance = totalDebt || consolidatedData?.totalDebts || 0
  const monthlyDebtPayments = totalMonthlyPayments || consolidatedData?.monthlyDebtPayments || 0
  const hasSpecificDebts = debts && debts.length > 0

  // Display debts - use actual debts if available, otherwise show consolidated data
  const displayDebts: Debt[] = hasSpecificDebts 
    ? debts 
    : (consolidatedData?.debts || []).map(debt => ({
        id: debt.id,
        user_id: '',
        creditor: debt.creditor,
        original_amount: debt.current_balance,
        current_balance: debt.current_balance,
        monthly_payment: debt.monthly_payment,
        interest_rate: 0,
        due_date: null,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

  const activeDebts = displayDebts.filter(debt => debt.status === 'active')
  const averageInterestRate = activeDebts.length > 0 
    ? activeDebts.reduce((sum, debt) => sum + debt.interest_rate, 0) / activeDebts.length 
    : 0

  const nextDueDate = activeDebts
    .filter(debt => debt.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0]?.due_date

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt)
    setIsDebtModalOpen(true)
  }

  const handleDeleteDebt = (debt: Debt) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
      deleteDebt(debt.id)
    }
  }

  const handleRegisterPayment = (debt: Debt) => {
    setSelectedDebt(debt)
    setIsPaymentModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <CreditCard className="mx-auto h-16 w-16 mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">Gestión de Deudas</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Controla y optimiza tus deudas para alcanzar la libertad financiera
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                ${totalDebtBalance.toLocaleString()}
              </div>
              <div className="text-blue-200">Deuda Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                ${monthlyDebtPayments.toLocaleString()}
              </div>
              <div className="text-blue-200">Pagos Mensuales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {activeDebts.length}
              </div>
              <div className="text-blue-200">Deudas Activas</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deuda Total</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalDebtBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Saldo pendiente total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Mensuales</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${monthlyDebtPayments.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total mensual a pagar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa Promedio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageInterestRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Interés promedio anual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Vencimiento</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextDueDate ? new Date(nextDueDate).getDate() : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                {nextDueDate 
                  ? `${new Date(nextDueDate).toLocaleDateString('es-ES', { month: 'short' })}`
                  : 'Sin fecha próxima'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {!hasSpecificDebts && totalDebtBalance > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Datos desde el perfil financiero</h3>
                <p className="text-sm text-blue-700">
                  Mostrando información de deudas desde tu perfil. Agrega deudas específicas para un mejor control y análisis detallado.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">
              Mis Deudas ({displayDebts.length})
            </h2>
          </div>

          {displayDebts.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No tienes deudas registradas
              </h3>
              <p className="text-text-secondary mb-6">
                Comienza agregando tus deudas para tener un mejor control de tus finanzas
              </p>
              <Button onClick={() => setIsDebtModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Primera Deuda
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {displayDebts.map((debt) => (
                <div key={debt.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-text-primary">
                          {debt.creditor}
                        </h3>
                        <Badge 
                          variant={debt.status === 'active' ? 'default' : 
                                   debt.status === 'paid' ? 'secondary' : 'destructive'}
                        >
                          {debt.status === 'active' ? 'Activa' : 
                           debt.status === 'paid' ? 'Pagada' : 'Morosa'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-text-secondary">Saldo Actual:</span>
                          <div className="font-medium">${debt.current_balance.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-text-secondary">Pago Mensual:</span>
                          <div className="font-medium">${debt.monthly_payment.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-text-secondary">Tasa de Interés:</span>
                          <div className="font-medium">{debt.interest_rate}%</div>
                        </div>
                        <div>
                          <span className="text-text-secondary">Fecha de Vencimiento:</span>
                          <div className="font-medium">
                            {debt.due_date ? new Date(debt.due_date).toLocaleDateString() : 'No definida'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {hasSpecificDebts && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegisterPayment(debt)}
                          disabled={isRegisteringPayment}
                        >
                          Registrar Pago
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDebt(debt)}
                          disabled={isUpdating}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDebt(debt)}
                          disabled={isDeleting}
                        >
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>

                  {debt.current_balance > 0 && (
                    <div className="mt-4 bg-muted rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso de pago</span>
                        <span>
                          {Math.round(((debt.original_amount - debt.current_balance) / debt.original_amount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, ((debt.original_amount - debt.current_balance) / debt.original_amount) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasSpecificDebts && (
            <div className="px-6 py-4 border-t border-border bg-muted/20">
              <Button 
                onClick={() => setIsDebtModalOpen(true)}
                disabled={isCreating}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Nueva Deuda
              </Button>
            </div>
          )}
        </div>

        {displayDebts.length > 0 && hasSpecificDebts && (
          <div className="mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsScenarioModalOpen(true)}
              className="w-full"
            >
              <Target className="mr-2 h-4 w-4" />
              Analizar Escenarios de Pago
            </Button>
          </div>
        )}
      </div>

      <DebtModal
        isOpen={isDebtModalOpen}
        onClose={() => {
          setIsDebtModalOpen(false)
          setEditingDebt(null)
        }}
        onSubmit={(debtData) => {
          if (editingDebt) {
            updateDebt({ id: editingDebt.id, ...debtData })
          } else {
            createDebt(debtData)
          }
          setIsDebtModalOpen(false)
          setEditingDebt(null)
        }}
        debt={editingDebt}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedDebt(null)
        }}
        onSubmit={(paymentData) => {
          if (selectedDebt) {
            registerPayment({
              debt_id: selectedDebt.id,
              ...paymentData
            })
          }
          setIsPaymentModalOpen(false)
          setSelectedDebt(null)
        }}
        debt={selectedDebt}
      />

      <ScenarioAnalysis
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        debt={activeDebts[0] || null}
      />
    </div>
  )
}
