
import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { ExpenseFilters } from './ExpenseFilters'
import { QuickActionButtons } from './QuickActionButtons'
import { Badge } from '@/components/ui/badge'
import { Expense } from '@/domains/expenses/types/expense.types'

interface TransactionsTabProps {
  expenses: Expense[]
  filters: {
    category: string
    dateFrom: string
    dateTo: string
  }
  onFiltersChange: (filters: { category: string; dateFrom: string; dateTo: string }) => void
  onCreateExpense: () => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (expense: Expense) => void
  onAddIncome: () => void
  onAddSaving: () => void
  isUpdating: boolean
  isDeleting: boolean
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  expenses,
  filters,
  onFiltersChange,
  onCreateExpense,
  onEditExpense,
  onDeleteExpense,
  onAddIncome,
  onAddSaving,
  isUpdating,
  isDeleting
}) => {
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

  return (
    <div className="space-y-4">
      {/* Quick Action Buttons */}
      <QuickActionButtons
        onAddIncome={onAddIncome}
        onAddExpense={onCreateExpense}
        onAddSaving={onAddSaving}
      />

      {/* Filters */}
      <ExpenseFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Sin movimientos aún</h3>
              <p className="text-muted-foreground mb-4">
                {expenses.length === 0 
                  ? 'Usa los botones de arriba para comenzar a registrar tus finanzas'
                  : 'No hay movimientos que coincidan con los filtros seleccionados.'
                }
              </p>
              <Button onClick={onCreateExpense}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Movimiento
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{expense.description || expense.category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      -{formatCurrency(expense.amount)}
                    </p>
                    <Badge variant="secondary">
                      {expense.category}
                    </Badge>
                  </div>
                </div>

                {expense.subcategory && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {expense.subcategory}
                  </p>
                )}

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
                      onClick={() => onEditExpense(expense)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteExpense(expense)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
