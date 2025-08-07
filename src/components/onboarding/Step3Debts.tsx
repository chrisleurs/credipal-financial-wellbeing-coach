
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, CreditCard, Trash2, AlertTriangle, Calendar, Clock, HelpCircle } from 'lucide-react'
import OnboardingStep from './OnboardingStep'
import { useFinancialStore } from '@/store/financialStore'
import type { Debt } from '@/types'

interface Step3DebtsProps {
  onNext: () => void
  onBack: () => void
}

// Debt type options with icons
const debtTypes = [
  { value: 'credit-card', label: 'Credit Card', icon: '💳' },
  { value: 'auto-loan', label: 'Auto Loan', icon: '🚗' },
  { value: 'student-loan', label: 'Student Loan', icon: '🎓' },
  { value: 'bnpl', label: 'Buy Now, Pay Later', icon: '🛒' },
  { value: 'personal-loan', label: 'Personal Loan', icon: '🏠' },
  { value: 'loan', label: 'Other Loan', icon: '📋' },
]

const Step3Debts: React.FC<Step3DebtsProps> = ({ onNext, onBack }) => {
  const { financialData, updateFinancialData } = useFinancialStore()
  const [debts, setDebts] = useState<Debt[]>(financialData.debts || [])
  const [newDebt, setNewDebt] = useState({
    type: '',
    name: '',
    amount: '',
    monthlyPayment: '',
    paymentDueDate: '',
    termInMonths: ''
  })

  const calculateEstimatedPayoffDate = (monthlyPayment: number, totalAmount: number, termInMonths: number) => {
    const today = new Date()
    const estimatedDate = new Date(today.getFullYear(), today.getMonth() + termInMonths, 1)
    return estimatedDate.toISOString().split('T')[0]
  }

  const addDebt = () => {
    if (newDebt.type && newDebt.name.trim() && newDebt.amount && newDebt.monthlyPayment && newDebt.paymentDueDate && newDebt.termInMonths) {
      const amount = parseFloat(newDebt.amount) || 0
      const monthlyPayment = parseFloat(newDebt.monthlyPayment) || 0
      const paymentDueDate = parseInt(newDebt.paymentDueDate) || 1
      const termInMonths = parseInt(newDebt.termInMonths) || 1
      
      if (amount > 0 && monthlyPayment > 0 && paymentDueDate >= 1 && paymentDueDate <= 31 && termInMonths > 0) {
        const estimatedPayoffDate = calculateEstimatedPayoffDate(monthlyPayment, amount, termInMonths)
        
        const debt: Debt = {
          id: Date.now().toString(),
          name: newDebt.name.trim(),
          amount,
          monthlyPayment,
          paymentDueDate,
          termInMonths,
          estimatedPayoffDate,
          type: newDebt.type
        }
        setDebts([...debts, debt])
        setNewDebt({ type: '', name: '', amount: '', monthlyPayment: '', paymentDueDate: '', termInMonths: '' })
      }
    }
  }

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id))
  }

  const handleNext = () => {
    updateFinancialData({ debts })
    onNext()
  }

  const totalDebtAmount = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0)
  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0)
  const canAddDebt = newDebt.type && newDebt.name.trim() && newDebt.amount && newDebt.monthlyPayment && newDebt.paymentDueDate && newDebt.termInMonths

  const isPaymentSufficient = (monthlyPayment: number, totalAmount: number, termInMonths: number) => {
    const requiredPayment = totalAmount / termInMonths
    return monthlyPayment >= requiredPayment
  }

  const getDebtTypeIcon = (type: string) => {
    const debtType = debtTypes.find(dt => dt.value === type)
    return debtType ? debtType.icon : '📋'
  }

  const getDebtTypeLabel = (type: string) => {
    const debtType = debtTypes.find(dt => dt.value === type)
    return debtType ? debtType.label : 'Other'
  }

  return (
    <TooltipProvider>
      <OnboardingStep
        currentStep={2}
        totalSteps={6}
        title="Do you have any debts we should know about?"
        subtitle="Add your credit cards, personal loans, and other debts. If you don't have any, no worries - you can skip this step!"
        onNext={handleNext}
        onBack={onBack}
        canProceed={true}
        nextButtonText="Done adding debts? Let's move forward with your plan."
      >
        <div className="space-y-6">
          {/* Add debt form */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <CreditCard className="h-5 w-5" />
              <h3 className="font-medium">Add a new debt</h3>
            </div>
            
            <div className="space-y-4">
              {/* Type of Debt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of debt
                </label>
                <Select value={newDebt.type} onValueChange={(value) => setNewDebt({ ...newDebt, type: value })}>
                  <SelectTrigger className="rounded-xl border-gray-300 focus:border-emerald-500">
                    <SelectValue placeholder="Select debt type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl z-50">
                    {debtTypes.map((debtType) => (
                      <SelectItem key={debtType.value} value={debtType.value} className="hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span>{debtType.icon}</span>
                          <span>{debtType.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Debt Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Debt name
                </label>
                <Input
                  placeholder="e.g., Visa Card, Car Loan"
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  className="rounded-xl border-gray-300 focus:border-emerald-500"
                />
              </div>

              {/* Total Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How much do you still owe?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newDebt.amount}
                    onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                    className="pl-8 rounded-xl border-gray-300 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Monthly Payment */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    What's your minimum monthly payment?
                  </label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border border-gray-600 rounded-lg p-2 max-w-xs z-50">
                      <p className="text-sm">Usually shown on your loan statement or credit card bill.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newDebt.monthlyPayment}
                    onChange={(e) => setNewDebt({ ...newDebt, monthlyPayment: e.target.value })}
                    className="pl-8 rounded-xl border-gray-300 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When is your next payment due?
                  </label>
                  <Select value={newDebt.paymentDueDate} onValueChange={(value) => setNewDebt({ ...newDebt, paymentDueDate: value })}>
                    <SelectTrigger className="rounded-xl border-gray-300 focus:border-emerald-500">
                      <SelectValue placeholder="Day of month" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl z-50">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()} className="hover:bg-gray-50">
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Term Remaining */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      How many months until you finish paying?
                    </label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white border border-gray-600 rounded-lg p-2 max-w-xs z-50">
                        <p className="text-sm">Number of months left to finish paying this debt.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    type="number"
                    placeholder="e.g., 24"
                    value={newDebt.termInMonths}
                    onChange={(e) => setNewDebt({ ...newDebt, termInMonths: e.target.value })}
                    className="rounded-xl border-gray-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <Button 
                onClick={addDebt}
                disabled={!canAddDebt}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add debt
              </Button>
            </div>
          </div>

          {/* Debts list */}
          {debts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Your current debts
              </h4>
              {debts.map((debt) => (
                <div key={debt.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getDebtTypeIcon(debt.type || '')}</span>
                        <h5 className="font-medium text-red-800">{debt.name}</h5>
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          {getDebtTypeLabel(debt.type || '')}
                        </span>
                      </div>
                      <div className="text-sm text-red-600 mt-1 space-y-1">
                        <div>
                          <span>Total: ${(debt.amount || 0).toLocaleString()}</span>
                          <span className="mx-2">•</span>
                          <span>Monthly payment: ${(debt.monthlyPayment || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {debt.paymentDueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due on {debt.paymentDueDate}th of each month</span>
                            </div>
                          )}
                          {debt.termInMonths && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{debt.termInMonths} months</span>
                            </div>
                          )}
                        </div>
                        {debt.estimatedPayoffDate && (
                          <div className="text-xs text-gray-600">
                            Estimated payoff: {new Date(debt.estimatedPayoffDate).toLocaleDateString()}
                          </div>
                        )}
                        {debt.termInMonths && !isPaymentSufficient(debt.monthlyPayment, debt.amount, debt.termInMonths) && (
                          <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            ⚠️ Payment may not cover the desired term
                          </div>
                        )}
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
              
              <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-xl border border-red-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-red-700">Total debt</p>
                    <p className="text-lg font-bold text-red-800">${totalDebtAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-700">Monthly payments</p>
                    <p className="text-lg font-bold text-orange-800">${totalMonthlyPayments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No debts state - improved motivational message */}
          {debts.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                You don't have any debt — and that's a big deal!
              </h3>
              <p className="text-gray-600 mb-4">
                Let's keep your finances strong and focused on your goals. 🙌
              </p>
              <div className="text-sm text-green-700 bg-green-50 inline-block px-6 py-3 rounded-lg border border-green-200">
                Being debt-free gives you incredible financial flexibility!
              </div>
            </div>
          )}

          {/* Budget impact */}
          {debts.length > 0 && financialData.monthlyIncome > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Impact on your budget
                  </p>
                  <p className="text-sm text-yellow-700">
                    Your debt payments make up{' '}
                    <strong>
                      {Math.round((totalMonthlyPayments / (financialData.monthlyIncome + financialData.extraIncome)) * 100)}%
                    </strong>{' '}
                    of your income. Credipal will help you optimize this.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </OnboardingStep>
    </TooltipProvider>
  )
}

export default Step3Debts
