import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard, Trash2, AlertTriangle } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'
import type { Debt } from '@/types'

interface Step3DebtsProps {
  onNext: () => void
  onBack: () => void
}

const Step3Debts: React.FC<Step3DebtsProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const [debts, setDebts] = useState<Debt[]>(financialData.debts || [])
  const [newDebt, setNewDebt] = useState({
    name: '',
    amount: '',
    monthlyPayment: ''
  })

  const addDebt = () => {
    if (newDebt.name.trim() && newDebt.amount && newDebt.monthlyPayment) {
      const debt: Debt = {
        id: Date.now().toString(),
        name: newDebt.name.trim(),
        amount: parseFloat(newDebt.amount),
        monthlyPayment: parseFloat(newDebt.monthlyPayment)
      }
      setDebts([...debts, debt])
      setNewDebt({ name: '', amount: '', monthlyPayment: '' })
    }
  }

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id))
  }

  const handleNext = () => {
    updateFinancialData({ debts })
    onNext()
  }

  const totalDebtAmount = debts.reduce((sum, debt) => sum + debt.amount, 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
  const canAddDebt = newDebt.name.trim() && newDebt.amount && newDebt.monthlyPayment

  return (
    <OnboardingStep
      currentStep={2}
      totalSteps={9}
      title="¿Tienes deudas activas?"
      subtitle="Agrega tus tarjetas de crédito, préstamos personales y otras deudas. Si no tienes ninguna, puedes continuar."
      onNext={handleNext}
      onBack={onBack}
      canProceed={true} // Las deudas son opcionales
    >
      <div className="space-y-6">
        {/* Formulario para agregar deuda */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <CreditCard className="h-5 w-5" />
            <h3 className="font-medium">Agregar nueva deuda</h3>
          </div>
          
          <div className="space-y-3">
            <Input
              placeholder="Nombre de la deuda (ej: Tarjeta Visa, Préstamo personal)"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              className="rounded-xl border-gray-300 focus:border-emerald-500"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder="Deuda total"
                  value={newDebt.amount}
                  onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                  className="pl-8 rounded-xl border-gray-300 focus:border-emerald-500"
                />
              </div>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder="Pago mensual"
                  value={newDebt.monthlyPayment}
                  onChange={(e) => setNewDebt({ ...newDebt, monthlyPayment: e.target.value })}
                  className="pl-8 rounded-xl border-gray-300 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <Button 
              onClick={addDebt}
              disabled={!canAddDebt}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar deuda
            </Button>
          </div>
        </div>

        {/* Lista de deudas */}
        {debts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Tus deudas actuales
            </h4>
            {debts.map((debt) => (
              <div key={debt.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-red-800">{debt.name}</h5>
                    <div className="text-sm text-red-600 mt-1">
                      <span>Total: ${debt.amount.toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>Pago mensual: ${debt.monthlyPayment.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Resumen de deudas */}
            <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-xl border border-red-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-red-700">Deuda total</p>
                  <p className="text-lg font-bold text-red-800">${totalDebtAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-700">Pagos mensuales</p>
                  <p className="text-lg font-bold text-orange-800">${totalMonthlyPayments.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado sin deudas */}
        {debts.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin deudas registradas</h3>
            <p className="text-gray-600 mb-4">
              Si no tienes deudas activas, ¡excelente! Puedes continuar al siguiente paso.
            </p>
            <p className="text-sm text-green-700 bg-green-50 inline-block px-4 py-2 rounded-lg">
              Estar libre de deudas te da más flexibilidad financiera
            </p>
          </div>
        )}

        {/* Impacto en el balance */}
        {debts.length > 0 && financialData.monthlyIncome > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Impacto en tu presupuesto
                </p>
                <p className="text-sm text-yellow-700">
                  Tus pagos de deuda representan el{' '}
                  <strong>
                    {Math.round((totalMonthlyPayments / (financialData.monthlyIncome + financialData.extraIncome)) * 100)}%
                  </strong>{' '}
                  de tus ingresos. Credipal te ayudará a optimizar esto.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </OnboardingStep>
  )
}

export default Step3Debts