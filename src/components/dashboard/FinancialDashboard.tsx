import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuickActionsSection } from './QuickActionsSection'
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PlusCircle, TrendingUp, Target, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface FinancialDashboardProps {
  userId: string
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ userId }) => {
  const { data, isLoading, error } = useConsolidatedFinancialData()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">Error cargando datos financieros</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalIncome = data?.monthlyIncome || 0
  const totalExpenses = data?.monthlyExpenses || 0
  const totalDebts = data?.totalDebtBalance || 0
  const totalSavings = data?.currentSavings || 0

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ¡Hola! 👋
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu situación financiera
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Ingresos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total mensual
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Gastos
            </CardTitle>
            <PlusCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total mensual
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Deudas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${totalDebts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo total
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Ahorros
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${totalSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total ahorrado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <QuickActionsSection userId={userId} />

      {/* Financial Balance Summary */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-card-foreground">Balance mensual:</span>
              <span className={`font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(totalIncome - totalExpenses).toLocaleString()}
              </span>
            </div>
            
            {totalDebts > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  💡 <strong>Tip de CrediPal:</strong> Con un balance mensual positivo de ${(totalIncome - totalExpenses).toLocaleString()}, 
                  podrías destinar parte de este excedente para acelerar el pago de tus deudas.
                </p>
              </div>
            )}
            
            {totalIncome - totalExpenses >= 0 && totalDebts === 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🎉 <strong>¡Excelente!</strong> Tienes un balance positivo sin deudas. 
                  Es el momento perfecto para aumentar tus ahorros e inversiones.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
