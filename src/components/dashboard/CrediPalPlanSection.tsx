
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CrediPalPlanView } from './CrediPalPlanView'
import { Eye, EyeOff, FileText, BarChart3 } from 'lucide-react'

interface CrediPalPlanSectionProps {
  consolidatedData: {
    monthlyIncome: number
    monthlyExpenses: number
    totalDebtBalance: number
    totalMonthlyDebtPayments: number
    currentSavings: number
    savingsCapacity: number
    debts: Array<{
      id: string
      creditor: string
      current_balance: number
      monthly_payment: number
      interest_rate: number
    }>
  }
}

export const CrediPalPlanSection: React.FC<CrediPalPlanSectionProps> = ({ consolidatedData }) => {
  const [showDetailedPlan, setShowDetailedPlan] = useState(false)

  return (
    <div className="space-y-6">
      {/* Toggle para mostrar/ocultar plan detallado */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              📋 Tu Plan Financiero CrediPal
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowDetailedPlan(!showDetailedPlan)}
              className="flex items-center gap-2"
            >
              {showDetailedPlan ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDetailedPlan ? 'Ocultar Plan Detallado' : 'Ver Plan Completo'}
            </Button>
          </div>
        </CardHeader>
        {!showDetailedPlan && (
          <CardContent>
            <div className="text-center p-6">
              <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Plan Financiero Metodología 3.2.1</h3>
              <p className="text-muted-foreground mb-4">
                Tu roadmap personalizado hacia la libertad financiera con 3 hitos principales, 
                presupuesto optimizado y proyecciones a 5 años.
              </p>
              <Button onClick={() => setShowDetailedPlan(true)}>
                Ver mi Plan Completo
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Plan detallado */}
      {showDetailedPlan && (
        <CrediPalPlanView consolidatedData={consolidatedData} />
      )}
    </div>
  )
}
