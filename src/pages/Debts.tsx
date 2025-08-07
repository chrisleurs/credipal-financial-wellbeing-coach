import React, { useState } from 'react'
import { Plus, CreditCard, TrendingDown, AlertCircle, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import DebtModal from '@/components/debts/DebtModal'
import PaymentModal from '@/components/debts/PaymentModal'
import ScenarioAnalysis from '@/components/debts/ScenarioAnalysis'
import { useDebts } from '@/hooks/useDebts'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useLanguage } from '@/contexts/LanguageContext'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { Debt } from '@/types/debt'

const Debts = () => {
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<Debt | null>(null)

  const {
    debts,
    payments,
    isLoadingDebts,
    createDebt,
    updateDebt,
    deleteDebt,
    registerPayment,
    isCreating,
    isUpdating,
    isDeleting,
    isRegisteringPayment
  } = useDebts()

  const { consolidatedProfile } = useConsolidatedFinancialData()
  const { t } = useLanguage()

  // Use consolidated data when no specific debts are recorded
  const hasSpecificDebts = debts.length > 0
  const totalDebtBalance = hasSpecificDebts
    ? debts.reduce((sum, debt) => sum + debt.current_balance, 0)
    : consolidatedProfile?.totalDebtBalance || 0
  
  const totalMonthlyPayments = hasSpecificDebts
    ? debts.reduce((sum, debt) => sum + debt.minimum_payment, 0)
    : consolidatedProfile?.totalMonthlyDebtPayments || 0

  // Create display debts - use real debts if available, otherwise consolidated data
  const displayDebts = hasSpecificDebts 
    ? debts 
    : consolidatedProfile?.debts?.map(debt => ({
        ...debt,
        user_id: consolidatedProfile?.userId || '',
        description: `Deuda consolidada de ${debt.creditor_name}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Debt)) || []

  const handleCreateDebt = async (debtData: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    createDebt(debtData)
    setIsDebtModalOpen(false)
  }

  const handleEditDebt = (debt: Debt) => {
    if (!hasSpecificDebts) {
      // Convert consolidated data to editable debt
      setIsDebtModalOpen(true)
      return
    }
    setEditingDebt(debt)
    setIsDebtModalOpen(true)
  }

  const handleUpdateDebt = async (debtData: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingDebt) {
      updateDebt({ id: editingDebt.id, ...debtData })
      setEditingDebt(null)
      setIsDebtModalOpen(false)
    }
  }

  const handleDeleteDebt = async (debt: Debt) => {
    if (!hasSpecificDebts) return // Can't delete consolidated data
    if (window.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
      deleteDebt(debt.id)
    }
  }

  const handleRegisterPayment = async (paymentData: {
    debt_id: string
    amount: number
    payment_date: string
    notes?: string
  }) => {
    registerPayment(paymentData)
    setIsPaymentModalOpen(false)
    setSelectedDebtForPayment(null)
  }

  const calculateProgress = (debt: Debt) => {
    if (!debt.total_amount || debt.total_amount === 0) return 0
    const paidAmount = debt.total_amount - debt.current_balance
    return (paidAmount / debt.total_amount) * 100
  }

  if (isLoadingDebts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('loading_debts')} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {t('debt_management')}
              </h1>
              <p className="text-text-secondary">
                {hasSpecificDebts 
                  ? t('debt_management_desc')
                  : 'Datos del onboarding - Agrega deudas específicas para mayor control'
                }
              </p>
            </div>
            <Button
              onClick={() => setIsDebtModalOpen(true)}
              className="flex items-center gap-2"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4" />
              {t('add_debt')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_debt_balance')}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalDebtBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpecificDebts ? `de $${debts.reduce((sum, debt) => sum + debt.total_amount, 0).toLocaleString()} original` : 'Del onboarding'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('monthly_payments')}
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${totalMonthlyPayments.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpecificDebts ? 'Total mensual mínimo' : 'Estimado'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_progress')}
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {displayDebts.length > 0 
                  ? Math.round(displayDebts.reduce((sum, debt) => sum + calculateProgress(debt), 0) / displayDebts.length)
                  : 0
                }%
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpecificDebts ? `${payments.length} pagos registrados` : 'Progreso estimado'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('active_debts')}
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayDebts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpecificDebts ? 'Deudas activas' : 'Del onboarding'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Source Indicator */}
        {!hasSpecificDebts && totalDebtBalance > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <p className="text-blue-800 font-medium">
                Mostrando datos del onboarding
              </p>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Agrega deudas específicas para registrar pagos y obtener análisis detallados de progreso.
            </p>
          </div>
        )}

        {/* Debts List */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">
              {t('your_debts')}
            </h2>
          </div>
          
          {displayDebts.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {t('no_debts_registered')}
              </h3>
              <p className="text-text-secondary mb-4">
                {t('no_debts_desc')}
              </p>
              <Button onClick={() => setIsDebtModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('add_first_debt')}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {displayDebts.map((debt) => {
                const progress = calculateProgress(debt)
                return (
                  <div key={debt.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                          {debt.creditor_name}
                        </h3>
                        {debt.description && (
                          <p className="text-text-secondary text-sm mb-2">
                            {debt.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <span>Vence día {debt.due_day}</span>
                          <span>Tasa: {debt.annual_interest_rate}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          ${debt.current_balance.toLocaleString()}
                        </div>
                        <div className="text-sm text-text-secondary">
                          de ${debt.total_amount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-text-secondary">Progreso</span>
                        <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text-secondary">
                        Pago mínimo: <span className="font-medium text-text-primary">${debt.minimum_payment.toLocaleString()}</span>
                      </div>
                      {hasSpecificDebts && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDebtForPayment(debt)
                              setIsPaymentModalOpen(true)
                            }}
                            disabled={isRegisteringPayment}
                          >
                            {t('register_payment')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditDebt(debt)}
                            disabled={isUpdating}
                          >
                            {t('edit')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDebt(debt)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-700"
                          >
                            {t('delete')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Scenario Analysis Button - Only show for specific debts */}
        {displayDebts.length > 0 && hasSpecificDebts && (
          <div className="mt-8">
            <Button
              onClick={() => setIsScenarioModalOpen(true)}
              className="w-full"
              variant="outline"
            >
              Ver Análisis de Escenarios
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
        onSubmit={editingDebt ? handleUpdateDebt : handleCreateDebt}
        debt={editingDebt}
      />

      {selectedDebtForPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedDebtForPayment(null)
          }}
          onSubmit={handleRegisterPayment}
          debt={selectedDebtForPayment}
        />
      )}

      {displayDebts.length > 0 && hasSpecificDebts && (
        <ScenarioAnalysis
          isOpen={isScenarioModalOpen}
          onClose={() => setIsScenarioModalOpen(false)}
          debt={displayDebts[0]}
          payments={payments}
        />
      )}
    </div>
  )
}

export default Debts
