
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'
import { useExpenses } from '@/hooks/useExpenses'
import { ExpenseModal } from '@/components/expenses/ExpenseModal'
import { AppLayout } from '@/components/layout/AppLayout'
import { Expense, ExpenseCategoryType } from '@/domains/expenses/types/expense.types'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { MovementsMetrics } from '@/components/expenses/MovementsMetrics'
import { TransactionsTab } from '@/components/expenses/TransactionsTab'
import { ScheduledMovements } from '@/components/expenses/ScheduledMovements'
import { RecurringMovements } from '@/components/expenses/RecurringMovements'

type TabValue = 'transactions' | 'scheduled' | 'recurring'

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

  const [activeTab, setActiveTab] = useState<TabValue>('transactions')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filters, setFilters] = useState({
    category: 'all',
    dateFrom: '',
    dateTo: ''
  })

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

  const handleCreateExpense = () => {
    setEditingExpense(null)
    setIsModalOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleSaveExpense = async (expenseData: {
    amount: number
    category: string
    description: string
    date: string
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

    if (editingExpense) {
      updateExpense({ 
        ...expenseData, 
        id: editingExpense.id,
        category,
        is_recurring: false
      })
    } else {
      createExpense({ 
        ...expenseData, 
        category,
        is_recurring: false
      })
    }
    setIsModalOpen(false)
    return { success: true }
  }

  const handleDeleteExpense = (expense: Expense) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      deleteExpense(expense.id)
    }
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Movimientos</h1>
            <p className="text-muted-foreground">Controla y categoriza tus gastos e ingresos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportExpenses}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleCreateExpense} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <MovementsMetrics
          totalThisMonth={currentMonthMetrics.totalThisMonth}
          dailyAverage={currentMonthMetrics.dailyAverage}
          transactionCount={currentMonthMetrics.transactionCount}
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

        {/* Modal */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveExpense}
          expense={editingExpense}
          title={editingExpense ? 'Editar Movimiento' : 'Agregar Movimiento'}
        />
      </div>
    </AppLayout>
  )
}
