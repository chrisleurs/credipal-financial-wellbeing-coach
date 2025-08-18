import React, { useState } from 'react'
import { useDebts } from '@/hooks/useDebts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, CreditCard, Trash2, Edit } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const DebtsList = () => {
  const { debts, totalDebt, totalMonthlyPayments, isLoading, createDebt, deleteDebt, isCreating } = useDebts()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    creditor: '',
    originalAmount: '',
    currentBalance: '',
    monthlyPayment: '',
    interestRate: '',
    dueDate: '',
    status: 'active' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.creditor || !formData.originalAmount || !formData.currentBalance) return

    createDebt({
      creditor: formData.creditor,
      original_amount: parseFloat(formData.originalAmount),
      current_balance: parseFloat(formData.currentBalance),
      monthly_payment: parseFloat(formData.monthlyPayment) || 0,
      interest_rate: parseFloat(formData.interestRate) || 0,
      due_date: formData.dueDate || new Date().toISOString().split('T')[0],
      status: formData.status
    })

    setFormData({
      creditor: '',
      originalAmount: '',
      currentBalance: '',
      monthlyPayment: '',
      interestRate: '',
      dueDate: '',
      status: 'active'
    })
    setShowForm(false)
  }

  if (isLoading) {
    return <LoadingSpinner text="Cargando deudas..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Deudas</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Deuda
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-red-600 mr-2" />
              <div>
                <p className="text-sm text-red-600 font-medium">Total de Deudas</p>
                <p className="text-2xl font-bold text-red-800">
                  {formatCurrency(totalDebt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-orange-600 mr-2" />
              <div>
                <p className="text-sm text-orange-600 font-medium">Pagos Mensuales</p>
                <p className="text-2xl font-bold text-orange-800">
                  {formatCurrency(totalMonthlyPayments)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Acreedor
                </label>
                <Input
                  placeholder="ej. Banco, Tarjeta de crédito, Préstamo personal"
                  value={formData.creditor}
                  onChange={(e) => setFormData({...formData, creditor: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monto Original
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.originalAmount}
                    onChange={(e) => setFormData({...formData, originalAmount: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Balance Actual
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.currentBalance}
                    onChange={(e) => setFormData({...formData, currentBalance: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Pago Mensual
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.monthlyPayment}
                    onChange={(e) => setFormData({...formData, monthlyPayment: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tasa de Interés (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Fecha de Vencimiento
                  </label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Estado
                  </label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activa</SelectItem>
                      <SelectItem value="paid">Pagada</SelectItem>
                      <SelectItem value="delinquent">Morosa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

      {/* Debts List */}
      <div className="space-y-4">
        {debts.length === 0 && !showForm ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay deudas registradas</h3>
              <p className="text-muted-foreground mb-4">
                ¡Excelente! No tienes deudas registradas o puedes agregar una si la tienes
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Deuda
              </Button>
            </CardContent>
          </Card>
        ) : (
          debts.map((debt) => {
            const progress = debt.original_amount > 0 
              ? ((debt.original_amount - debt.current_balance) / debt.original_amount) * 100 
              : 0

            return (
              <Card key={debt.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{debt.creditor}</h4>
                      <p className="text-sm text-muted-foreground">
                        Balance: {formatCurrency(debt.current_balance)} de {formatCurrency(debt.original_amount)}
                      </p>
                      {debt.monthly_payment > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Pago mensual: {formatCurrency(debt.monthly_payment)}
                        </p>
                      )}
                      {debt.due_date && (
                        <p className="text-sm text-muted-foreground">
                          Vence: {new Date(debt.due_date).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        debt.status === 'active' ? 'bg-red-100 text-red-800' :
                        debt.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {debt.status === 'active' ? 'Activa' :
                         debt.status === 'paid' ? 'Pagada' : 'Morosa'}
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteDebt(debt.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress.toFixed(1)}% pagado
                  </p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
