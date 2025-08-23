
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useExpenses } from '@/hooks/useExpenses'
import { useDebts } from '@/hooks/useDebts'
import { useIncomes } from '@/hooks/useIncomes'
import { EnhancedExpenseModal } from '@/components/expenses/EnhancedExpenseModal'
import { IncomeModal } from '@/components/expenses/IncomeModal'
import { SavingsModal } from '@/components/expenses/SavingsModal'
import { DebtPaymentModal } from '@/components/expenses/DebtPaymentModal'
import { AppLayout } from '@/components/layout/AppLayout'
import { Expense, ExpenseCategoryType } from '@/domains/expenses/types/expense.types'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { MovementsMetrics } from '@/components/expenses/MovementsMetrics'
import { TransactionsTab } from '@/components/expenses/TransactionsTab'
import { ScheduledMovements } from '@/components/expenses/ScheduledMovements'
import { RecurringMovements } from '@/components/expenses/RecurringMovements'
import { FAB } from '@/components/ui/fab'
import { ActionSheet, createActionSheetOptions } from '@/components/expenses/ActionSheet'
import { SmartChips } from '@/components/expenses/SmartChips'
import { useActionSheet } from '@/hooks/useActionSheet'
import { useCoachToast } from '@/components/expenses/CoachToast'
import { useQueryClient } from '@tanstack/react-query'

type TabValue = 'transactions' | 'scheduled' | 'recurring'
type ModalType = 'expense' | 'income' | 'savings' | 'debt' | 'subscription' | null

const TAB_OPTIONS = [
  { value: 'transactions' as TabValue, label: 'Transacciones' },
  { value: 'scheduled' as TabValue, label: 'Programados' },
  { value: 'recurring' as TabValue, label: 'Recurrentes' }
]

export default function ExpensesPage() {
  const { 
    expenses, 
    totalExpenses, 
    createExpense, 
    updateExpense, 
    deleteExpense,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting 
  } = useExpenses()

  const { debts } = useDebts()
  const { incomes } = useIncomes()
  const queryClient = useQueryClient()
  const { showMotivationalToast } = useCoachToast()

  const [activeTab, setActiveTab] = useState<TabValue>('transactions')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filters, setFilters] = useState({
    category: 'all',
    dateFrom: '',
    dateTo: ''
  })

  // Action Sheet state
  const actionSheet = useActionSheet()

  // Calculate metrics for current month
  const currentMonthMetrics = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
    
    const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const dailyAverage = totalThisMonth / now.getDate()
    const transactionCount = currentMonthExpenses.length
    
    return { totalThisMonth, dailyAverage, transactionCount }
  }, [expenses])

  // Calculate user state for smart chips
  const userState = useMemo(() => ({
    hasIncome: incomes.length > 0,
    hasSubscriptions: false, // TODO: Calculate from recurring templates
    hasOverduePayments: debts.some(debt => {
      if (!debt.due_date) return false
      const dueDate = new Date(debt.due_date)
      const today = new Date()
      return dueDate < today && debt.status === 'active'
    }),
    isOnTrack: totalExpenses < 10000 // Simple heuristic, replace with real logic
  }), [incomes, debts, totalExpenses])

  const handleCreateExpense = () => {
    setEditingExpense(null)
    setActiveModal('expense')
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setActiveModal('expense')
  }

  const handleSaveExpense = async (expenseData: {
    amount: number
    category: string
    description: string
    date: string
    isRecurring?: boolean
    recurringData?: any
  }) => {
    // Map category to ExpenseCategoryType
    const categoryMap: Record<string, ExpenseCategoryType> = {
      'Alimentación': 'Food & Dining',
      'Transporte': 'Transportation',
      'Vivienda': 'Housing & Utilities',
      'Entretenimiento': 'Entertainment',
      'Salud': 'Healthcare',
      'Educación': 'Education',
      'Ropa': 'Shopping',
      'Servicios': 'Bills & Services',
      'Otros': 'Other'
    }

    const category = (categoryMap[expenseData.category] || 'Other') as ExpenseCategoryType

    // Save recurring info to description/notes if present
    let description = expenseData.description || ''
    if (expenseData.isRecurring && expenseData.recurringData) {
      description += ` [Recurrente: ${expenseData.recurringData.frequency}]`
    }

    if (editingExpense) {
      updateExpense({ 
        ...expenseData, 
        id: editingExpense.id,
        category,
        description,
        is_recurring: expenseData.isRecurring || false
      })
    } else {
      createExpense({ 
        ...expenseData, 
        category,
        description,
        is_recurring: expenseData.isRecurring || false
      })
    }

    // Show motivational toast
    showMotivationalToast({ type: 'expense', amount: expenseData.amount })
    
    setActiveModal(null)
    return { success: true }
  }

  const handleSaveIncome = async (incomeData: {
    amount: number
    source: string
    date: string
    description?: string
    isRecurring?: boolean
    recurringData?: any
  }) => {
    // TODO: Implement income saving logic using existing hooks
    showMotivationalToast({ type: 'income', amount: incomeData.amount })
    console.log('Saving income:', incomeData)
    return { success: true }
  }

  const handleSaveSavings = async (savingsData: {
    amount: number
    goalId?: string
    date: string
    description?: string
  }) => {
    // TODO: Implement savings logic using existing hooks
    showMotivationalToast({ type: 'saving', goalProgress: 15.3 })
    console.log('Saving savings:', savingsData)
    return { success: true }
  }

  const handleSaveDebtPayment = async (paymentData: {
    debtId: string
    amount: number
    date: string
    description?: string
  }) => {
    // TODO: Implement debt payment logic using existing hooks
    showMotivationalToast({ type: 'debt', debtReduction: 8.5 })
    console.log('Saving debt payment:', paymentData)
    return { success: true }
  }

  const handleDeleteExpense = (expense: Expense) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      deleteExpense(expense.id)
    }
  }

  // Smart Chips handlers
  const handleRecalculatePlan = () => {
    queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
    showMotivationalToast({ type: 'expense' }) // Generic success message
  }

  const handleAddIncome = () => setActiveModal('income')
  const handleAddSubscription = () => setActiveModal('subscription')
  const handleViewPayments = () => setActiveTab('scheduled')
  const handleViewProgress = () => {
    // TODO: Navigate to progress page
    console.log('Navigate to progress')
  }

  const exportExpenses = () => {
    const csvContent = [
      ['Fecha', 'Descripción', 'Categoría', 'Monto'],
      ...expenses.map(expense => [
        expense.date,
        expense.description || '',
        expense.category,
        expense.amount.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'movimientos.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Action Sheet handlers
  const actionSheetOptions = useMemo(() => createActionSheetOptions({
    onAddExpense: handleCreateExpense,
    onAddIncome: () => setActiveModal('income'),
    onPayDebt: () => setActiveModal('debt'),
    onAddSaving: () => setActiveModal('savings'),
    onAddSubscription: () => setActiveModal('subscription')
  }), [])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">Cargando movimientos...</div>
        </div>
      </AppLayout>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transactions':
        return (
          <TransactionsTab
            expenses={expenses}
            filters={filters}
            onFiltersChange={setFilters}
            onCreateExpense={handleCreateExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        )
      case 'scheduled':
        return <ScheduledMovements />
      case 'recurring':
        return <RecurringMovements />
      default:
        return null
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 pb-24">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Movimientos</h1>
            <p className="text-muted-foreground">Controla y categoriza tus gastos e ingresos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportExpenses}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <MovementsMetrics
          totalThisMonth={currentMonthMetrics.totalThisMonth}
          dailyAverage={currentMonthMetrics.dailyAverage}
          transactionCount={currentMonthMetrics.transactionCount}
        />

        {/* Smart Chips */}
        <SmartChips
          userState={userState}
          onRecalculatePlan={handleRecalculatePlan}
          onAddIncome={handleAddIncome}
          onAddSubscription={handleAddSubscription}
          onViewPayments={handleViewPayments}
          onViewProgress={handleViewProgress}
        />

        {/* Segmented Control */}
        <div className="flex justify-center">
          <SegmentedControl
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabValue)}
            options={TAB_OPTIONS}
            className="w-full max-w-md"
          />
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* FAB */}
        <FAB onClick={actionSheet.open} />

        {/* Action Sheet */}
        <ActionSheet
          isOpen={actionSheet.isOpen}
          onClose={actionSheet.close}
          options={actionSheetOptions}
        />

        {/* Enhanced Expense Modal */}
        <EnhancedExpenseModal
          isOpen={activeModal === 'expense'}
          onClose={() => setActiveModal(null)}
          onSubmit={handleSaveExpense}
          expense={editingExpense}
          title={editingExpense ? 'Editar Movimiento' : 'Agregar Movimiento'}
        />

        {/* Income Modal */}
        <IncomeModal
          isOpen={activeModal === 'income'}
          onClose={() => setActiveModal(null)}
          onSubmit={handleSaveIncome}
        />

        {/* Savings Modal */}
        <SavingsModal
          isOpen={activeModal === 'savings'}
          onClose={() => setActiveModal(null)}
          onSubmit={handleSaveSavings}
        />

        {/* Debt Payment Modal */}
        <DebtPaymentModal
          isOpen={activeModal === 'debt'}
          onClose={() => setActiveModal(null)}
          onSubmit={handleSaveDebtPayment}
        />

        {/* TODO: Subscription Modal */}
        {activeModal === 'subscription' && (
          <div>Subscription modal coming soon...</div>
        )}
      </div>
    </AppLayout>
  )
}
