
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, TrendingUp, Calendar, DollarSign, AlertTriangle } from 'lucide-react'
import { useDebts } from '@/hooks/useDebts'
import DebtModal from '@/components/debts/DebtModal'
import PaymentModal from '@/components/debts/PaymentModal'
import ScenarioAnalysis from '@/components/debts/ScenarioAnalysis'
import { AppLayout } from '@/components/layout/AppLayout'
import { Debt } from '@/domains/debts/types/debt.types'
import { DebtSummaryCards } from '@/components/debts/DebtSummaryCards'
import { DebtsList } from '@/components/debts/DebtsList'

export default function DebtsPage() {
  const { 
    debts, 
    totalDebt, 
    totalMonthlyPayments,
    createDebt, 
    updateDebt, 
    deleteDebt, 
    isLoading,
    isCreating,
    isUpdating,
    isDeleting
  } = useDebts()

  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const activeDebts = debts.filter(debt => debt.status === 'active')

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt)
    setIsDebtModalOpen(true)
  }

  const handleDeleteDebt = (debt: Debt) => {
    if (window.confirm(`Are you sure you want to delete the debt to ${debt.creditor}?`)) {
      deleteDebt(debt.id)
    }
  }

  const handleMakePayment = (debt: Debt) => {
    setSelectedDebt(debt)
    setIsPaymentModalOpen(true)
  }

  const handleCreateDebt = () => {
    setEditingDebt(null)
    setIsDebtModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDebtModalOpen(false)
    setEditingDebt(null)
  }

  const handleSaveDebt = (debtData: {
    creditor: string
    original_amount: number
    current_balance: number
    monthly_payment: number
    interest_rate: number
    due_date?: string
    status?: 'active' | 'paid' | 'delinquent'
    description?: string
  }) => {
    if (editingDebt) {
      updateDebt({ ...debtData, id: editingDebt.id })
    } else {
      createDebt(debtData)
    }
    handleCloseModal()
  }

  const handlePaymentSubmit = (paymentData: {
    debt_id: string
    amount: number
    payment_date: string
    notes?: string
  }) => {
    console.log('Payment registered:', paymentData)
    setIsPaymentModalOpen(false)
    setSelectedDebt(null)
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">Loading debts...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Debt Management</h1>
            <p className="text-muted-foreground">Track and manage your debts</p>
          </div>
          <Button onClick={handleCreateDebt} disabled={isCreating}>
            <Plus className="mr-2 h-4 w-4" />
            Add Debt
          </Button>
        </div>

        {/* Summary Cards */}
        <DebtSummaryCards 
          totalDebt={totalDebt}
          totalMonthlyPayments={totalMonthlyPayments}
          activeDebtsCount={activeDebts.length}
          onAnalyzeClick={() => setIsScenarioModalOpen(true)}
          canAnalyze={activeDebts.length > 0}
        />

        {/* Debts List */}
        <DebtsList 
          debts={debts}
          onEdit={handleEditDebt}
          onDelete={handleDeleteDebt}
          onMakePayment={handleMakePayment}
          onCreate={handleCreateDebt}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />

        {/* Modals */}
        <DebtModal
          isOpen={isDebtModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDebt}
          debt={editingDebt}
          isLoading={isCreating || isUpdating}
        />

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedDebt(null)
          }}
          onSubmit={handlePaymentSubmit}
          debt={selectedDebt ? {
            id: selectedDebt.id,
            creditor: selectedDebt.creditor,
            current_balance: selectedDebt.current_balance,
            monthly_payment: selectedDebt.monthly_payment
          } : null}
          isLoading={false}
        />

        <ScenarioAnalysis
          isOpen={isScenarioModalOpen}
          onClose={() => setIsScenarioModalOpen(false)}
          debt={activeDebts[0] ? {
            id: activeDebts[0].id,
            creditor: activeDebts[0].creditor,
            current_balance: activeDebts[0].current_balance,
            monthly_payment: activeDebts[0].monthly_payment
          } : null}
          payments={[]}
        />
      </div>
    </AppLayout>
  )
}
