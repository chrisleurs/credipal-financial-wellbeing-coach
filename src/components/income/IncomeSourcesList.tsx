
import React, { useState } from 'react'
import { useIncomes } from '@/hooks/useIncomes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, DollarSign, Trash2, Edit } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const IncomeSourcesList = () => {
  const { incomes, totalMonthlyIncome, isLoading, createIncome, deleteIncome, isCreating } = useIncomes()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    source_name: '',
    amount: '',
    frequency: 'monthly' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.source_name || !formData.amount) return

    createIncome({
      source_name: formData.source_name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      is_active: true
    })

    setFormData({ source_name: '', amount: '', frequency: 'monthly' })
    setShowForm(false)
  }

  if (isLoading) {
    return <LoadingSpinner text="Cargando fuentes de ingresos..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fuentes de Ingresos</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Ingreso
        </Button>
      </div>

      {/* Total Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Ingresos Mensuales Totales</p>
              <p className="text-3xl font-bold text-green-800">
                {formatCurrency(totalMonthlyIncome)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Fuente de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nombre de la fuente
                </label>
                <Input
                  placeholder="ej. Salario, Freelance, Negocio"
                  value={formData.source_name}
                  onChange={(e) => setFormData({...formData, source_name: e.target.value})}
                  required
                />
              </div>
              
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
                  Frecuencia
                </label>
                <Select 
                  value={formData.frequency} 
                  onValueChange={(value: any) => setFormData({...formData, frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="biweekly">Quincenal</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Income Sources List */}
      <div className="space-y-4">
        {incomes.length === 0 && !showForm ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay fuentes de ingresos</h3>
              <p className="text-muted-foreground mb-4">
                Agrega tu primera fuente de ingresos para comenzar
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ingreso
              </Button>
            </CardContent>
          </Card>
        ) : (
          incomes.map((income) => {
            const monthlyAmount = income.frequency === 'weekly' ? income.amount * 4 :
                                 income.frequency === 'biweekly' ? income.amount * 2 :
                                 income.frequency === 'yearly' ? income.amount / 12 :
                                 income.amount

            return (
              <Card key={income.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{income.source_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(income.amount)} - {income.frequency}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        ~{formatCurrency(monthlyAmount)}/mes
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteIncome(income.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
