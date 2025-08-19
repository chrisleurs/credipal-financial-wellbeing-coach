
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Download, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { useExpenses } from '@/hooks/useExpenses'
import { ExpenseModal } from '@/components/expenses/ExpenseModal'
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters'
import { AppLayout } from '@/components/layout/AppLayout'
import { Expense, ExpenseCategoryType } from '@/domains/expenses/types/expense.types'

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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filters, setFilters] = useState({
    category: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const filteredExpenses = useMemo(() => {
    let filtered = expenses

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(expense => expense.category === filters.category)
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(expense => new Date(expense.date) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      filtered = filtered.filter(expense => new Date(expense.date) <= new Date(filters.dateTo))
    }

    return filtered
  }, [expenses, filters])

  const expensesByCategory = useMemo(() => {
    const categories: Record<string, { total: number; count: number }> = {}
    
    filteredExpenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = { total: 0, count: 0 }
      }
      categories[expense.category].total += expense.amount
      categories[expense.category].count += 1
    })

    return Object.entries(categories)
      .map(([category, data]) => ({
        category,
        ...data,
        percentage: (data.total / totalExpenses) * 100
      }))
      .sort((a, b) => b.total - a.total)
  }, [filteredExpenses, totalExpenses])

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
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      deleteExpense(expense.id)
    }
  }

  const exportExpenses = () => {
    const csvContent = [
      ['Fecha', 'Descripción', 'Categoría', 'Monto'],
      ...filteredExpenses.map(expense => [
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
    a.download = 'gastos.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">Cargando gastos...</div>
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
            <h1 className="text-3xl font-bold">Gestión de Gastos</h1>
            <p className="text-muted-foreground">Controla y categoriza tus gastos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportExpenses}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleCreateExpense} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Gasto
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) / 30).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredExpenses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categoría Principal</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {expensesByCategory[0]?.category || 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <ExpenseFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {expenses.length === 0 
                    ? 'No has registrado gastos aún.' 
                    : 'No hay gastos que coincidan con los filtros seleccionados.'
                  }
                </p>
                <Button onClick={handleCreateExpense}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primer Gasto
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{expense.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">
                          ${expense.amount.toLocaleString()}
                        </p>
                        <Badge variant="secondary">
                          {expense.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2">
                        {expense.is_recurring && (
                          <Badge variant="outline">Recurrente</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditExpense(expense)}
                          disabled={isUpdating}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteExpense(expense)}
                          disabled={isDeleting}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveExpense}
          expense={editingExpense}
          title={editingExpense ? 'Editar Gasto' : 'Agregar Gasto'}
        />
      </div>
    </AppLayout>
  )
}
