import React, { useState } from 'react'
import { Plus, CreditCard, DollarSign, Calendar, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useFinancialStore } from '@/store/financialStore'
import { useToast } from '@/hooks/use-toast'

interface DebtPayment {
  id: string
  debtId: string
  amount: number
  date: Date
}

export default function Debts() {
  const { financialData, updateDebts } = useFinancialStore()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedDebtId, setSelectedDebtId] = useState<string>('')
  const [payments, setPayments] = useState<DebtPayment[]>([])
  const [newDebt, setNewDebt] = useState({
    name: '',
    totalAmount: '',
    monthlyPayment: '',
    interestRate: ''
  })
  const [paymentAmount, setPaymentAmount] = useState('')

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.totalAmount || !newDebt.monthlyPayment) return

    const debt = {
      id: Date.now().toString(),
      name: newDebt.name,
      amount: parseFloat(newDebt.totalAmount),
      monthlyPayment: parseFloat(newDebt.monthlyPayment)
    }

    const updatedDebts = [...financialData.debts, debt]
    updateDebts(updatedDebts)
    
    setNewDebt({ name: '', totalAmount: '', monthlyPayment: '', interestRate: '' })
    setIsDialogOpen(false)

    toast({
      title: "Deuda agregada",
      description: `Se agregó la deuda "${debt.name}" exitosamente.`,
    })
  }

  const handleRegisterPayment = () => {
    if (!paymentAmount || !selectedDebtId) return

    const payment: DebtPayment = {
      id: Date.now().toString(),
      debtId: selectedDebtId,
      amount: parseFloat(paymentAmount),
      date: new Date()
    }

    setPayments(prev => [...prev, payment])
    setPaymentAmount('')
    setIsPaymentDialogOpen(false)

    toast({
      title: "Pago registrado",
      description: `Se registró un pago de $${parseFloat(paymentAmount).toLocaleString()}.`,
    })
  }

  const getDebtProgress = (debtId: string, totalAmount: number) => {
    const totalPaid = payments
      .filter(payment => payment.debtId === debtId)
      .reduce((sum, payment) => sum + payment.amount, 0)
    
    return Math.min((totalPaid / totalAmount) * 100, 100)
  }

  const getRemainingAmount = (debtId: string, totalAmount: number) => {
    const totalPaid = payments
      .filter(payment => payment.debtId === debtId)
      .reduce((sum, payment) => sum + payment.amount, 0)
    
    return Math.max(totalAmount - totalPaid, 0)
  }

  const calculateMonthsToPayOff = (remainingAmount: number, monthlyPayment: number) => {
    if (monthlyPayment <= 0) return 0
    return Math.ceil(remainingAmount / monthlyPayment)
  }

  const totalDebt = financialData.debts.reduce((sum, debt) => {
    const remaining = getRemainingAmount(debt.id, debt.totalAmount)
    return sum + remaining
  }, 0)

  const totalMonthlyPayments = financialData.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deudas</h1>
          <p className="text-muted-foreground">Controla y gestiona tus deudas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Deuda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Deuda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la deuda</Label>
                <Input
                  id="name"
                  placeholder="Ej: Tarjeta de crédito, Préstamo..."
                  value={newDebt.name}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="totalAmount">Monto total</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  placeholder="0"
                  value={newDebt.totalAmount}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, totalAmount: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="monthlyPayment">Pago mensual</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  placeholder="0"
                  value={newDebt.monthlyPayment}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Tasa de interés (% anual - opcional)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  placeholder="0"
                  value={newDebt.interestRate}
                  onChange={(e) => setNewDebt(prev => ({ ...prev, interestRate: e.target.value }))}
                />
              </div>
              
              <Button onClick={handleAddDebt} className="w-full bg-gradient-primary">
                Agregar Deuda
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
              <CreditCard className="h-4 w-4" />
              Deuda Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">${totalDebt.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pagos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">${totalMonthlyPayments.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Número de Deudas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{financialData.debts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Debts List */}
      {financialData.debts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No tienes deudas registradas</h3>
            <p className="text-muted-foreground mb-4">¡Excelente! Mantén tu situación financiera saludable.</p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Agregar primera deuda
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {financialData.debts.map((debt) => {
            const progress = getDebtProgress(debt.id, debt.amount)
            const remaining = getRemainingAmount(debt.id, debt.amount)
            const monthsToPayOff = calculateMonthsToPayOff(remaining, debt.monthlyPayment)
            
            return (
              <Card key={debt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      {debt.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedDebtId(debt.id)}
                            className="bg-gradient-success"
                          >
                            Registrar Pago
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Registrar Pago - {debt.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="paymentAmount">Monto del pago</Label>
                              <Input
                                id="paymentAmount"
                                type="number"
                                placeholder="0"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                              />
                            </div>
                            <Button onClick={handleRegisterPayment} className="w-full bg-gradient-success">
                              Registrar Pago
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Debt details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monto original</p>
                        <p className="font-medium">${debt.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Restante</p>
                        <p className="font-medium text-destructive">${remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pago mensual</p>
                        <p className="font-medium">${debt.monthlyPayment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Meses restantes</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {monthsToPayOff}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 10)
                .map((payment) => {
                  const debt = financialData.debts.find(d => d.id === payment.debtId)
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <h4 className="font-medium text-foreground">{debt?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {payment.date.toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-secondary">-${payment.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}