
import React, { useState } from 'react'
import { useExpenses } from '@/domains/expenses/hooks/useExpenses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, CreditCard, Trash2, Edit } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ExpenseCategoryType, CreateExpenseData } from '@/domains/expenses/types/expense.types'

const CATEGORIES: ExpenseCategoryType[] = [
  'Food & Dining',
  'Transportation',
  'Housing & Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Bills & Services',
  'Other'
]

export const ExpensesList = () => {
  const { expenses, isLoading, createExpense, deleteExpense, isCreating } = useExpenses()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: '' as ExpenseCategoryType,
    subcategory: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.amount) return

    const expenseData: CreateExpenseData = {
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description || '',
      is_recurring: formData.isRecurring
    }

    createExpense(expenseData)
    setFormData({
      category: '' as ExpenseCategoryType,
      subcategory: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      isRecurring: false
    })
    setShowForm(false)
  }

  if (isLoading) {
    return <LoadingSpinner text="Cargando gastos..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gastos</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Gasto
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nuevo Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Categoría
                  </label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: ExpenseCategoryType) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subcategoría
                  </label>
                  <Input
                    placeholder="Opcional"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Cantidad
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Descripción
                </label>
                <Input
                  placeholder="Descripción opcional del gasto"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                />
                <label htmlFor="recurring" className="text-sm font-medium">
                  Es un gasto recurrente
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Agregando...' : 'Agregar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 && !showForm ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay gastos registrados</h3>
              <p className="text-muted-foreground mb-4">
                Agrega tu primer gasto para comenzar a hacer seguimiento
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Gasto
              </Button>
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{expense.category}</h4>
                      {expense.subcategory && (
                        <span className="text-sm text-muted-foreground">
                          • {expense.subcategory}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('es-ES')}
                    </p>
                    {expense.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {expense.description}
                      </p>
                    )}
                    {expense.is_recurring && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                        Recurrente
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-red-600">
                      -{formatCurrency(expense.amount)}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
