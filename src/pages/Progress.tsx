
import React, { useState } from 'react'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { useUnifiedFinancialData } from '@/hooks/useUnifiedFinancialData'
import { DataConsolidationButton } from '@/components/onboarding/DataConsolidationButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle2, 
  RefreshCw,
  AlertCircle,
  BarChart3
} from 'lucide-react'

// Import dashboard components
import { PresupuestoMensual } from '@/components/dashboard/PresupuestoMensual'
import { PlanPagoDeuda } from '@/components/dashboard/PlanPagoDeuda'
import { FondoEmergencia } from '@/components/dashboard/FondoEmergencia'
import { CrecimientoPatrimonial } from '@/components/dashboard/CrecimientoPatrimonial'
import { RoadmapTrimestral } from '@/components/dashboard/RoadmapTrimestral'
import { MetasCortoPlazo } from '@/components/dashboard/MetasCortoPlazo'
import { RoadmapAccion } from '@/components/dashboard/RoadmapAccion'

// Types for the plan components
interface PresupuestoMensualData {
  necesidades: { porcentaje: number; cantidad: number }
  estiloVida: { porcentaje: number; cantidad: number }
  ahorro: { porcentaje: number; cantidad: number }
}

interface PlanPagoDeudaData {
  deuda: string
  balanceActual: number
  fechaLiquidacion: string
  pagoMensual: number
  interesesAhorrados: number
}

interface FondoEmergenciaData {
  metaTotal: number
  progresoActual: number
  ahorroMensual: number
  fechaCompletion: string
}

interface CrecimientoPatrimonialData {
  año1: number
  año3: number
  año5: number
  inversionMensual: number
  rendimientoEsperado: number
}

interface RoadmapTrimestralData {
  trimestres: Array<{
    trimestre: string
    ahorroAcumulado: number
    deudaPendiente: number
    avance: number
  }>
  metaAnual: number
}

interface MetaData {
  id: string
  titulo: string
  meta: number
  progreso: number
  tipo: 'ahorro' | 'gasto' | 'ingreso'
  completada: boolean
  fechaLimite?: string
}

interface MetasCortoPlazoData {
  semanales: MetaData[]
  mensuales: MetaData[]
}

interface RoadmapAccionData {
  pasos: Array<{
    paso: number
    titulo: string
    fechaObjetivo: string
    completado: boolean
  }>
  progreso: number
  siguientePaso: {
    titulo: string
    descripcion: string
    dificultad: 'facil' | 'medio' | 'dificil'
  }
}

export default function Progress() {
  const [activeTab, setActiveTab] = useState('overview')
  const { 
    consolidatedProfile, 
    hasCompleteData, 
    isLoading: isDataLoading,
    generatePlan, 
    isGenerating, 
    generatedPlan 
  } = useFinancialPlanGenerator()
  
  const { data: unifiedData, isLoading: isUnifiedLoading } = useUnifiedFinancialData()

  // Show data consolidation button if user has no financial data but completed onboarding
  const showConsolidationButton = unifiedData?.isOnboardingComplete && !unifiedData?.hasFinancialData

  if (isDataLoading || isUnifiedLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu progreso financiero..." />
      </div>
    )
  }

  if (!hasCompleteData && !showConsolidationButton) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Completa tu perfil financiero</CardTitle>
              <CardDescription>
                Para generar tu plan de progreso personalizado, necesitamos que completes 
                tu información financiera básica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/onboarding'}>
                Completar Onboarding
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Create mock data that matches the expected interfaces
  const mockPlan = generatedPlan || {
    presupuestoMensual: {
      necesidades: { porcentaje: 50, cantidad: unifiedData?.monthlyIncome ? unifiedData.monthlyIncome * 0.5 : 2500 },
      estiloVida: { porcentaje: 30, cantidad: unifiedData?.monthlyIncome ? unifiedData.monthlyIncome * 0.3 : 1500 },
      ahorro: { porcentaje: 20, cantidad: unifiedData?.monthlyIncome ? unifiedData.monthlyIncome * 0.2 : 1000 }
    } as PresupuestoMensualData,
    
    planPagoDeuda: unifiedData?.debts?.slice(0, 3).map(debt => ({
      deuda: debt.creditor,
      balanceActual: debt.amount,
      fechaLiquidacion: '2025-12-31',
      pagoMensual: debt.monthlyPayment,
      interesesAhorrados: debt.amount * 0.1
    })) || [] as PlanPagoDeudaData[],
    
    fondoEmergencia: {
      metaTotal: (unifiedData?.monthlyExpenses || 3000) * 6,
      progresoActual: unifiedData?.currentSavings || 0,
      ahorroMensual: unifiedData?.monthlySavingsCapacity || 500,
      fechaCompletion: '2026-06-30'
    } as FondoEmergenciaData,
    
    crecimientoPatrimonial: {
      año1: (unifiedData?.currentSavings || 0) + ((unifiedData?.monthlySavingsCapacity || 500) * 12),
      año3: (unifiedData?.currentSavings || 0) + ((unifiedData?.monthlySavingsCapacity || 500) * 36 * 1.05),
      año5: (unifiedData?.currentSavings || 0) + ((unifiedData?.monthlySavingsCapacity || 500) * 60 * 1.08),
      inversionMensual: (unifiedData?.monthlySavingsCapacity || 500) * 0.7,
      rendimientoEsperado: 8.5
    } as CrecimientoPatrimonialData,
    
    roadmapTrimestral: {
      trimestres: [
        { trimestre: 'Q1 2025', ahorroAcumulado: 3000, deudaPendiente: 8000, avance: 25 },
        { trimestre: 'Q2 2025', ahorroAcumulado: 6000, deudaPendiente: 6000, avance: 50 },
        { trimestre: 'Q3 2025', ahorroAcumulado: 9000, deudaPendiente: 4000, avance: 75 },
        { trimestre: 'Q4 2025', ahorroAcumulado: 12000, deudaPendiente: 2000, avance: 100 }
      ],
      metaAnual: 12000
    } as RoadmapTrimestralData,
    
    metasCortoPlazo: {
      semanales: [
        {
          id: '1',
          titulo: 'Revisar gastos diarios',
          meta: 7,
          progreso: 5,
          tipo: 'gasto' as const,
          completada: false,
          fechaLimite: '2025-01-05'
        },
        {
          id: '2',
          titulo: 'Ahorrar $100 esta semana',
          meta: 100,
          progreso: 60,
          tipo: 'ahorro' as const,
          completada: false,
          fechaLimite: '2025-01-05'
        }
      ],
      mensuales: [
        {
          id: '3',
          titulo: 'Reducir gastos en entretenimiento',
          meta: 300,
          progreso: 150,
          tipo: 'gasto' as const,
          completada: false,
          fechaLimite: '2025-01-31'
        },
        {
          id: '4',
          titulo: 'Aumentar ingresos extras',
          meta: 500,
          progreso: 200,
          tipo: 'ingreso' as const,
          completada: false,
          fechaLimite: '2025-01-31'
        }
      ]
    } as MetasCortoPlazoData,
    
    roadmapAccion: {
      pasos: [
        { paso: 1, titulo: 'Establecer fondo de emergencia básico', fechaObjetivo: '2025-03-31', completado: false },
        { paso: 2, titulo: 'Reducir deuda de tarjetas de crédito', fechaObjetivo: '2025-06-30', completado: false },
        { paso: 3, titulo: 'Aumentar inversiones mensuales', fechaObjetivo: '2025-09-30', completado: false },
        { paso: 4, titulo: 'Completar fondo de emergencia', fechaObjetivo: '2025-12-31', completado: false }
      ],
      progreso: 15,
      siguientePaso: {
        titulo: 'Crear presupuesto detallado',
        descripcion: 'Analiza todos tus gastos del mes pasado y crea categorías específicas',
        dificultad: 'medio' as const
      }
    } as RoadmapAccionData
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Progreso Financiero</h1>
          <p className="text-muted-foreground">
            Sigue tu avance hacia la libertad financiera
          </p>
        </div>

        {/* Show consolidation button if needed */}
        {showConsolidationButton && <DataConsolidationButton />}

        {/* Generate Plan Section */}
        {!generatedPlan && hasCompleteData && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Genera tu Plan Personalizado</CardTitle>
                  <CardDescription className="text-blue-700">
                    Crea un plan de progreso basado en tu situación financiera actual
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generatePlan}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generando Plan...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generar Mi Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Plan Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="budget">Presupuesto</TabsTrigger>
            <TabsTrigger value="wealth">Patrimonio</TabsTrigger>
            <TabsTrigger value="actions">Acciones</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Monthly Budget */}
              {mockPlan.presupuestoMensual && (
                <PresupuestoMensual data={mockPlan.presupuestoMensual} />
              )}

              {/* Emergency Fund */}
              {mockPlan.fondoEmergencia && (
                <FondoEmergencia data={mockPlan.fondoEmergencia} />
              )}
            </div>

            {/* Debt Payment Plan */}
            {mockPlan.planPagoDeuda && mockPlan.planPagoDeuda.length > 0 && (
              <PlanPagoDeuda data={mockPlan.planPagoDeuda} />
            )}
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid gap-6">
              {/* Monthly Budget Detail */}
              {mockPlan.presupuestoMensual && (
                <PresupuestoMensual data={mockPlan.presupuestoMensual} />
              )}

              {/* Emergency Fund Progress */}
              {mockPlan.fondoEmergencia && (
                <FondoEmergencia data={mockPlan.fondoEmergencia} />
              )}
            </div>
          </TabsContent>

          {/* Wealth Tab */}
          <TabsContent value="wealth" className="space-y-6">
            <div className="space-y-6">
              {/* Wealth Growth - Fixed with all required properties */}
              {mockPlan.crecimientoPatrimonial && (
                <CrecimientoPatrimonial data={mockPlan.crecimientoPatrimonial} />
              )}

              {/* Quarterly Roadmap - Fixed with proper structure */}
              {mockPlan.roadmapTrimestral && (
                <RoadmapTrimestral data={mockPlan.roadmapTrimestral} />
              )}
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="space-y-6">
              {/* Short-term Goals - Fixed with all required properties */}
              {mockPlan.metasCortoPlazo && (
                <MetasCortoPlazo data={mockPlan.metasCortoPlazo} />
              )}

              {/* Action Roadmap - Fixed with proper structure */}
              {mockPlan.roadmapAccion && (
                <RoadmapAccion data={mockPlan.roadmapAccion} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
