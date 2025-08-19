import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useDebts } from '@/hooks/useDebts'
import DebtModal from '@/components/debts/DebtModal'
import PaymentModal from '@/components/debts/PaymentModal'
import ScenarioAnalysis from '@/components/debts/ScenarioAnalysis'
import { AppLayout } from '@/components/layout/AppLayout'
import { Debt } from '@/domains/debts/types/debt.types'
import { DebtSummaryCards } from '@/components/debts/DebtSummaryCards'
import { DebtsList } from '@/components/debts/DebtsList'
import { useModal } from '@/shared/hooks/useModal'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'

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

  const debtModal = useModal()
  const paymentModal = useModal()
  const scenarioModal = useModal()
  const { confirm } = useConfirmDialog()
  
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const activeDebts = debts.filter(debt => debt.status === 'active')

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt)
    debtModal.open()
  }

  const handleDeleteDebt = async (debt: Debt) => {
    const confirmed = await confirm({
      title: 'Eliminar Deuda',
      message: `¿Estás seguro de que deseas eliminar la deuda con ${debt.creditor}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'destructive'
    })
    
    if (confirmed) {
      deleteDebt(debt.id)
    }
  }

  const handleMakePayment = (debt: Debt) => {
    setSelectedDebt(debt)
    paymentModal.open()
  }

  const handleCreateDebt = () => {
    setEditingDebt(null)
    debtModal.open()
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
    debtModal.close()
    setEditingDebt(null)
  }

  const handlePaymentSubmit = (paymentData: {
    debt_id: string
    amount: number
    payment_date: string
    notes?: string
  }) => {
    console.log('Payment registered:', paymentData)
    paymentModal.close()
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
          onAnalyzeClick={scenarioModal.open}
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
          isOpen={debtModal.isOpen}
          onClose={debtModal.close}
          onSave={handleSaveDebt}
          debt={editingDebt}
          isLoading={isCreating || isUpdating}
        />

        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => {
            paymentModal.close()
            setSelectedDebt(null)
          }}
          onSubmit={handlePaymentSubmit}
          debt={selectedDebt}
          isLoading={false}
        />

        <ScenarioAnalysis
          isOpen={scenarioModal.isOpen}
          onClose={scenarioModal.close}
          debt={activeDebts[0] || null}
          payments={[]}
        />
      </div>
    </AppLayout>
  )
}
