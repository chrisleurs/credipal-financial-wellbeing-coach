
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No set'
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'delinquent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalDebt.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMonthlyPayments.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Debts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDebts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scenario Analysis</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsScenarioModalOpen(true)}
                disabled={activeDebts.length === 0}
              >
                Analyze
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Debts List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Debts</CardTitle>
          </CardHeader>
          <CardContent>
            {debts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't added any debts yet.</p>
                <Button onClick={handleCreateDebt}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Debt
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{debt.creditor}</h3>
                        <p className="text-sm text-muted-foreground">{debt.description || 'No description'}</p>
                      </div>
                      <Badge className={getStatusColor(debt.status)}>
                        {debt.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="font-semibold text-red-600">${debt.current_balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="font-semibold">${debt.monthly_payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{debt.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-semibold">{formatDate(debt.due_date)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {debt.status === 'active' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleMakePayment(debt)}
                        >
                          Make Payment
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditDebt(debt)}
                        disabled={isUpdating}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteDebt(debt)}
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
