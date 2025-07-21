import React, { useState } from 'react'
import { Plus, Filter, TrendingUp, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useFinancialStore } from '@/store/financialStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const expenseCategories = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Ropa',
  'Servicios',
  'Otros'
]

interface Expense {
  id: string
  name: string
  amount: number
  category: string
  date: Date
}

export default function Expenses() {
  const { financialData, addExpense } = useFinancialStore()
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      name: 'Supermercado',
      amount: 85000,
      category: 'Alimentación',
      date: new Date()
    },
    {
      id: '2',
      name: 'Gasolina',
      amount: 50000,
      category: 'Transporte',
      date: new Date(Date.now() - 86400000)
    }
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: ''
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.category) return

    const expense: Expense = {
      id: Date.now().toString(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date()
    }

    setExpenses(prev => [expense, ...prev])
    addExpense(newExpense.name, parseFloat(newExpense.amount))
    
    setNewExpense({ name: '', amount: '', category: '' })
    setIsDialogOpen(false)
  }

  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory)

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const getCategoryExpenses = (category: string) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gastos</h1>
          <p className="text-muted-foreground">Gestiona y controla tus gastos mensuales</p>
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
                <Label htmlFor="name">Descripción</Label>
                <Input
                  id="name"
                  placeholder="Ej: Supermercado, Gasolina..."
                  value={newExpense.name}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
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
                    {expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
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
              <Receipt className="h-4 w-4" />
              Total Gastado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Presupuesto Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">${financialData.monthlyExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${financialData.monthlyExpenses - totalExpenses >= 0 ? 'text-secondary' : 'text-destructive'}`}>
              ${(financialData.monthlyExpenses - totalExpenses).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {expenseCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay gastos en esta categoría
              </p>
            ) : (
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{expense.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{format(expense.date, 'dd MMM yyyy', { locale: es })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-destructive">-${expense.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expenseCategories.map(category => {
              const categoryTotal = getCategoryExpenses(category)
              return categoryTotal > 0 ? (
                <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="text-muted-foreground">{category}</span>
                  <span className="font-bold text-foreground">${categoryTotal.toLocaleString()}</span>
                </div>
              ) : null
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}