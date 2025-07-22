
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DollarSign, Calendar, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Debt } from '@/types/debt'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payment: { debt_id: string; amount: number; payment_date: string; notes?: string }) => void
  debt: Debt
  isLoading?: boolean
}

export default function PaymentModal({ isOpen, onClose, onSubmit, debt, isLoading = false }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const [paymentImpact, setPaymentImpact] = useState({
    newBalance: 0,
    progressPercentage: 0,
    monthsReduced: 0
  })

  React.useEffect(() => {
    if (formData.amount) {
      calculatePaymentImpact()
    }
  }, [formData.amount])

  const calculatePaymentImpact = () => {
    const paymentAmount = parseFloat(formData.amount) || 0
    if (paymentAmount <= 0) return

    const newBalance = Math.max(0, debt.current_balance - paymentAmount)
    const progressPercentage = Math.round(((debt.total_amount - newBalance) / debt.total_amount) * 100)
    
    // Calculate months reduced (simplified calculation)
    const currentMonths = Math.ceil(debt.current_balance / debt.minimum_payment)
    const newMonths = Math.ceil(newBalance / debt.minimum_payment)
    const monthsReduced = Math.max(0, currentMonths - newMonths)

    setPaymentImpact({
      newBalance,
      progressPercentage,
      monthsReduced
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return
    }

    onSubmit({
      debt_id: debt.id,
      amount: parseFloat(formData.amount),
      payment_date: formData.payment_date,
      notes: formData.notes || undefined
    })

    // Reset form
    setFormData({
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  const handleAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, amount: value }))
  }

  const setQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-success" />
            Registrar Pago - {debt.creditor_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Debt Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Saldo Actual</p>
                <p className="text-2xl font-bold text-destructive">
                  ${debt.current_balance.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  de ${debt.total_amount.toLocaleString()} total
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-sm font-medium">Montos Rápidos</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickAmount(debt.minimum_payment)}
              >
                Mínimo
                <br />
                <span className="text-xs">${debt.minimum_payment.toLocaleString()}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickAmount(debt.minimum_payment * 2)}
              >
                Doble
                <br />
                <span className="text-xs">${(debt.minimum_payment * 2).toLocaleString()}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickAmount(debt.current_balance)}
              >
                Total
                <br />
                <span className="text-xs">${debt.current_balance.toLocaleString()}</span>
              </Button>
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <Label htmlFor="amount">Monto del Pago *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0"
                className="pl-10"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                max={debt.current_balance}
                required
              />
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <Label htmlFor="payment_date">Fecha del Pago</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="payment_date"
                type="date"
                className="pl-10"
                value={formData.payment_date}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Comentarios sobre este pago..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Payment Impact */}
          {formData.amount && parseFloat(formData.amount) > 0 && (
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-3 text-success">Impacto de tu Pago</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nuevo saldo:</span>
                    <span className="font-medium text-destructive">
                      ${paymentImpact.newBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progreso total:</span>
                    <span className="font-medium text-success">
                      {paymentImpact.progressPercentage}%
                    </span>
                  </div>
                  {paymentImpact.monthsReduced > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Meses ahorrados:</span>
                      <span className="font-medium text-primary">
                        {paymentImpact.monthsReduced} meses
                      </span>
                    </div>
                  )}
                </div>
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
              disabled={isLoading || !formData.amount || parseFloat(formData.amount) <= 0}
              className="flex-1 bg-gradient-success"
            >
              {isLoading ? 'Registrando...' : 'Registrar Pago'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
