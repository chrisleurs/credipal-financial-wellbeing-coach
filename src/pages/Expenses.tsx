
import React, { useState } from 'react'
import { Plus, Calendar, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseModal } from '@/components/expenses/ExpenseModal'
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters'
import { DeleteExpenseDialog } from '@/components/expenses/DeleteExpenseDialog'
import { useExpenses } from '@/hooks/useExpenses'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { useLanguage } from '@/contexts/LanguageContext'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { Expense } from '@/hooks/useExpenses'

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null)
  const [deleteExpenseDescription, setDeleteExpenseDescription] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  const { expenses, isLoading: isLoadingExpenses, addExpense, updateExpense, deleteExpense } = useExpenses()
  const { consolidatedProfile } = useConsolidatedFinancialData()
  const { t } = useLanguage()

  // Use consolidated data when no specific expenses are recorded
  const hasSpecificExpenses = expenses.length > 0
  const totalExpenses = hasSpecificExpenses 
    ? expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    : consolidatedProfile?.monthlyExpenses || 0

  // Get expense categories from consolidated data when no specific expenses
  const expensesByCategory = hasSpecificExpenses
    ? expenses.reduce((acc, expense) => {
        const category = expense.category
        if (!acc[category]) acc[category] = []
        acc[category].push(expense)
        return acc
      }, {} as Record<string, Expense[]>)
    : Object.entries(consolidatedProfile?.expenseCategories || {}).reduce((acc, [category, amount]) => {
        acc[category] = [{
          id: category,
          user_id: consolidatedProfile?.userId || '',
          amount: amount,
          category: category,
          description: `Gastos de ${category}`,
          expense_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }] as Expense[]
        return acc
      }, {} as Record<string, Expense[]>)

  const categories = Object.keys(expensesByCategory)
  const averageExpense = hasSpecificExpenses && expenses.length > 0 
    ? totalExpenses / expenses.length 
    : totalExpenses

  // Filter expenses
  const filteredExpenses = hasSpecificExpenses ? expenses.filter(expense => {
    const matchesCategory = !selectedCategory || expense.category === selectedCategory
    const matchesDateFrom = !dateFrom || expense.expense_date >= dateFrom
    const matchesDateTo = !dateTo || expense.expense_date <= dateTo
    return matchesCategory && matchesDateFrom && matchesDateTo
  }) : Object.values(expensesByCategory).flat()

  const handleEditExpense = (expense: Expense) => {
    if (!hasSpecificExpenses) {
      // Convert consolidated data to editable expense
      setIsModalOpen(true)
      return
    }
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleDeleteExpense = (expense: Expense) => {
    if (!hasSpecificExpenses) return // Can't delete consolidated data
    setDeleteExpenseId(expense.id)
    setDeleteExpenseDescription(expense.description)
  }

  const handleModalSubmit = async (expenseData: {
    amount: number
    category: string
    description: string
    expense_date: string
  }) => {
    if (editingExpense) {
      const result = await updateExpense(editingExpense.id, expenseData)
      if (result.success) {
        setIsModalOpen(false)
        setEditingExpense(null)
      }
      return result
    } else {
      const result = await addExpense(expenseData)
      if (result.success) {
        setIsModalOpen(false)
      }
      return result
    }
  }

  const handleDeleteConfirm = async () => {
    if (deleteExpenseId) {
      await deleteExpense(deleteExpenseId)
      setDeleteExpenseId(null)
      setDeleteExpenseDescription('')
    }
  }

  if (isLoadingExpenses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('loading_expenses')} />
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
                {t('expenses')}
              </h1>
              <p className="text-text-secondary">
                {hasSpecificExpenses 
                  ? t('manage_expenses_desc') 
                  : 'Datos del onboarding - Agrega gastos específicos para mayor detalle'
                }
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('add_expense')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_expenses')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpecificExpenses ? `${expenses.length} gastos` : 'Del onboarding'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('average_expense')}
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${averageExpense.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpecificExpenses ? 'Por gasto' : 'Promedio estimado'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('this_month')}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Only show for specific expenses */}
        {hasSpecificExpenses && (
          <ExpenseFilters
            filters={{
              category: selectedCategory,
              dateFrom: dateFrom,
              dateTo: dateTo
            }}
            onFiltersChange={(filters) => {
              setSelectedCategory(filters.category)
              setDateFrom(filters.dateFrom)
              setDateTo(filters.dateTo)
            }}
          />
        )}

        {/* Data Source Indicator */}
        {!hasSpecificExpenses && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <p className="text-blue-800 font-medium">
                Mostrando datos del onboarding
              </p>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Agrega gastos específicos para obtener análisis más detallados y personalizados.
            </p>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">
              {t('recent_expenses')}
            </h2>
          </div>
          
          {filteredExpenses.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                {t('no_expenses')}
              </h3>
              <p className="text-text-secondary mb-4">
                {t('no_expenses_desc')}
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('add_first_expense')}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-text-primary">
                          {expense.description}
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {new Date(expense.expense_date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-red-600">
                        -${Number(expense.amount).toLocaleString()}
                      </span>
                      {hasSpecificExpenses && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExpense(expense)}
                          >
                            {t('edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense)}
                            className="text-red-600 hover:text-red-700"
                          >
                            {t('delete')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingExpense(null)
        }}
        onSubmit={handleModalSubmit}
        expense={editingExpense}
      />

      <DeleteExpenseDialog
        isOpen={!!deleteExpenseId}
        onClose={() => {
          setDeleteExpenseId(null)
          setDeleteExpenseDescription('')
        }}
        onConfirm={handleDeleteConfirm}
        expenseDescription={deleteExpenseDescription}
      />
    </div>
  )
}

export default Expenses
