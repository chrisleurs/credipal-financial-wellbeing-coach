
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/helpers'
import { CreditCard, AlertTriangle, Building, User } from 'lucide-react'

interface DebtsSectionProps {
  debts: Array<{
    id: string
    name: string
    creditor: string
    amount: number
    monthlyPayment: number
    source: 'onboarding' | 'kueski' | 'database'
    isKueski?: boolean
  }>
  totalDebt: number
  totalMonthlyPayments: number
}

export const DebtsSection: React.FC<DebtsSectionProps> = ({
  debts,
  totalDebt,
  totalMonthlyPayments
}) => {
  const getSourceIcon = (source: string, isKueski?: boolean) => {
    if (isKueski) return <Building className="h-4 w-4 text-blue-600" />
    switch (source) {
      case 'onboarding':
        return <User className="h-4 w-4 text-purple-600" />
      case 'kueski':
        return <Building className="h-4 w-4 text-blue-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getSourceLabel = (source: string, isKueski?: boolean) => {
    if (isKueski) return 'Préstamo Kueski'
    switch (source) {
      case 'onboarding':
        return 'Del onboarding'
      case 'kueski':
        return 'Préstamo Kueski'
      default:
        return 'Sistema'
    }
  }

  const getSourceColor = (source: string, isKueski?: boolean) => {
    if (isKueski) return 'bg-blue-100 text-blue-800'
    switch (source) {
      case 'onboarding':
        return 'bg-purple-100 text-purple-800'
      case 'kueski':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!debts || debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Mis Deudas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Excelente! No tienes deudas registradas
            </h3>
            <p className="text-gray-600">
              Mantén este estado para tener mayor flexibilidad financiera
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen de deudas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Resumen de Deudas
            <Badge variant="secondary">{debts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 mb-1">Total Deuda</p>
              <p className="text-2xl font-bold text-red-700">
                {formatCurrency(totalDebt)}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 mb-1">Pago Mensual</p>
              <p className="text-2xl font-bold text-orange-700">
                {formatCurrency(totalMonthlyPayments)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de deudas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Deudas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debts.map((debt) => (
              <div
                key={debt.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getSourceIcon(debt.source, debt.isKueski)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{debt.name}</h4>
                      <p className="text-sm text-gray-600">{debt.creditor}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getSourceColor(debt.source, debt.isKueski)}
                  >
                    {getSourceLabel(debt.source, debt.isKueski)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Monto Total</p>
                    <p className="font-semibold">{formatCurrency(debt.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pago Mensual</p>
                    <p className="font-semibold">{formatCurrency(debt.monthlyPayment)}</p>
                  </div>
                </div>

                {debt.isKueski && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Préstamo activo con pagos quincenales</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
