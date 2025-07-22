
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calculator, DollarSign, Percent, Calendar, Building } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Debt } from '@/types/debt'

interface DebtModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (debt: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  debt?: Debt
  isLoading?: boolean
}

export default function DebtModal({ isOpen, onClose, onSubmit, debt, isLoading = false }: DebtModalProps) {
  const [formData, setFormData] = useState({
    creditor_name: '',
    total_amount: '',
    annual_interest_rate: '',
    minimum_payment: '',
    due_day: '',
    description: ''
  })

  const [calculations, setCalculations] = useState({
    monthsToPayOff: 0,
    totalInterest: 0,
    totalPayment: 0
  })

  useEffect(() => {
    if (debt) {
      setFormData({
        creditor_name: debt.creditor_name,
        total_amount: debt.total_amount.toString(),
        annual_interest_rate: debt.annual_interest_rate.toString(),
        minimum_payment: debt.minimum_payment.toString(),
        due_day: debt.due_day.toString(),
        description: debt.description || ''
      })
    } else {
      setFormData({
        creditor_name: '',
        total_amount: '',
        annual_interest_rate: '',
        minimum_payment: '',
        due_day: '',
        description: ''
      })
    }
  }, [debt, isOpen])

  useEffect(() => {
    calculatePaymentScenario()
  }, [formData.total_amount, formData.annual_interest_rate, formData.minimum_payment])

  const calculatePaymentScenario = () => {
    const amount = parseFloat(formData.total_amount) || 0
    const annualRate = parseFloat(formData.annual_interest_rate) || 0
    const monthlyPayment = parseFloat(formData.minimum_payment) || 0

    if (amount <= 0 || monthlyPayment <= 0) {
      setCalculations({ monthsToPayOff: 0, totalInterest: 0, totalPayment: 0 })
      return
    }

    const monthlyRate = annualRate / 100 / 12

    if (monthlyRate === 0) {
      // No interest calculation
      const months = Math.ceil(amount / monthlyPayment)
      setCalculations({
        monthsToPayOff: months,
        totalInterest: 0,
        totalPayment: amount
      })
      return
    }

    // Calculate months to pay off with compound interest
    if (monthlyPayment <= amount * monthlyRate) {
      // Payment is too low to ever pay off the debt
      setCalculations({
        monthsToPayOff: 999,
        totalInterest: 999999,
        totalPayment: 999999
      })
      return
    }

    const months = Math.ceil(
      -Math.log(1 - (amount * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate)
    )

    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - amount

    setCalculations({
      monthsToPayOff: months,
      totalInterest: Math.max(0, totalInterest),
      totalPayment: totalPayment
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.creditor_name || !formData.total_amount || !formData.minimum_payment || !formData.due_day) {
      return
    }

    const debtData = {
      creditor_name: formData.creditor_name,
      total_amount: parseFloat(formData.total_amount),
      current_balance: debt ? debt.current_balance : parseFloat(formData.total_amount),
      annual_interest_rate: parseFloat(formData.annual_interest_rate) || 0,
      minimum_payment: parseFloat(formData.minimum_payment),
      due_day: parseInt(formData.due_day),
      description: formData.description
    }

    onSubmit(debtData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            {debt ? 'Editar Deuda' : 'Agregar Nueva Deuda'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creditor_name">Acreedor / Institución *</Label>
              <Input
                id="creditor_name"
                placeholder="Ej: Banco XYZ, Tarjeta ABC..."
                value={formData.creditor_name}
                onChange={(e) => handleChange('creditor_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="total_amount">Monto Total de la Deuda *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="total_amount"
                  type="number"
                  placeholder="0"
                  className="pl-10"
                  value={formData.total_amount}
                  onChange={(e) => handleChange('total_amount', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="annual_interest_rate">Tasa de Interés Anual (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="annual_interest_rate"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-10"
                  value={formData.annual_interest_rate}
                  onChange={(e) => handleChange('annual_interest_rate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minimum_payment">Pago Mínimo Mensual *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="minimum_payment"
                  type="number"
                  placeholder="0"
                  className="pl-10"
                  value={formData.minimum_payment}
                  onChange={(e) => handleChange('minimum_payment', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="due_day">Día de Vencimiento (1-31) *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="due_day"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="15"
                  className="pl-10"
                  value={formData.due_day}
                  onChange={(e) => handleChange('due_day', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Notas adicionales sobre esta deuda..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Payment Calculations */}
          {(formData.total_amount && formData.minimum_payment) && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Cálculos Automáticos</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Meses para Pagar</p>
                    <p className="text-xl font-bold text-warning">
                      {calculations.monthsToPayOff > 999 ? '∞' : calculations.monthsToPayOff}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Intereses Totales</p>
                    <p className="text-xl font-bold text-destructive">
                      ${calculations.totalInterest > 999999 ? '∞' : calculations.totalInterest.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Pago Total</p>
                    <p className="text-xl font-bold text-foreground">
                      ${calculations.totalPayment > 999999 ? '∞' : calculations.totalPayment.toLocaleString()}
                    </p>
                  </div>
                </div>

                {calculations.monthsToPayOff > 999 && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ El pago mínimo es muy bajo comparado con el interés. La deuda podría no pagarse nunca.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-primary"
            >
              {isLoading ? 'Guardando...' : debt ? 'Actualizar Deuda' : 'Agregar Deuda'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
