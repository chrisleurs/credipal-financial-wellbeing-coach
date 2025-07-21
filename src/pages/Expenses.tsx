
import React, { useState } from 'react'
import { Plus, DollarSign, TrendingDown, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useFinancialStore } from '@/store/financialStore'
import { useToast } from '@/hooks/use-toast'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
}

const EXPENSE_CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Servicios',
  'Salud',
  'Ropa',
  'Educación',
  'Otros'
]

export default function Expenses() {
  const { financialData, addExpense } = useFinancialStore()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: ''
  })

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date()
    }

    setExpenses(prev => [...prev, expense])
    addExpense(newExpense.description, parseFloat(newExpense.amount))
    
    setNewExpense({ description: '', amount: '', category: '' })
    setIsDialogOpen(false)

    toast({
      title: "Gasto agregado",
      description: `Se agregó el gasto "${expense.description}" por $${expense.amount.toLocaleString()}.`,
    })
  }

  const filteredExpenses = expenses.filter(expense => 
    filterCategory === 'all' || expense.category === filterCategory
  )

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyBudget = financialData.monthlyExpenses
  const remainingBudget = monthlyBudget - totalExpenses

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gastos</h1>
          <p className="text-muted-foreground">Rastrea y gestiona tus gastos mensuales</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Gasto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Gasto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  placeholder="Ej: Almuerzo, Gasolina, Supermercado..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddExpense} className="w-full bg-gradient-primary">
                Agregar Gasto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Gastos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Presupuesto Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">${monthlyBudget.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-secondary' : 'text-destructive'}`}>
              ${remainingBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="filter-category">Filtrar por categoría</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses by Category */}
      {Object.keys(expensesByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">{category}</p>
                  <p className="text-lg font-bold text-foreground">${amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {filterCategory === 'all' ? 'No tienes gastos registrados' : `No hay gastos en la categoría "${filterCategory}"`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filterCategory === 'all' ? 'Comienza agregando tus primeros gastos.' : 'Prueba con otra categoría o agrega nuevos gastos.'}
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Agregar primer gasto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{expense.description}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{expense.category}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {expense.date.toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-destructive">-${expense.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
