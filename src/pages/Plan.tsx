
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useFinancialPlanGenerator } from '@/hooks/useFinancialPlanGenerator'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { TrendingUp, Target, AlertCircle, CheckCircle, Lightbulb, Calendar, Banknote, PiggyBank } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

const Plan = () => {
  const {
    consolidatedProfile,
    hasCompleteData,
    isLoading,
    generatePlan,
    isGenerating,
    generatedPlan,
    savePlan,
    clearPlan
  } = useFinancialPlanGenerator()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando información financiera..." />
      </div>
    )
  }

  if (!hasCompleteData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Información Incompleta</h1>
              <p className="text-muted-foreground mb-6">
                Para generar un plan financiero personalizado, necesitamos más información sobre tus finanzas.
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-sm">• Agrega tus fuentes de ingresos</p>
                <p className="text-sm">• Registra tus gastos mensuales</p>
                <p className="text-sm">• Incluye información sobre deudas</p>
                <p className="text-sm">• Define tus metas financieras</p>
              </div>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Completar Información
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plan Financiero Personalizado</h1>
          <p className="text-muted-foreground">
            Generamos recomendaciones basadas en tu situación financiera actual
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(consolidatedProfile?.monthlyIncome || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(consolidatedProfile?.monthlyExpenses || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Gastos Mensuales</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(consolidatedProfile?.currentSavings || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Ahorros Actuales</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(consolidatedProfile?.totalDebtBalance || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Deudas Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Plan Section */}
        {!generatedPlan ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Generar Plan Financiero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Analizaremos tu situación financiera y crearemos un plan personalizado con recomendaciones específicas para mejorar tus finanzas.
              </p>
              <Button 
                onClick={generatePlan} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Generando Plan...
                  </>
                ) : (
                  'Generar Plan Financiero'
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Generated Plan Display */
          <div className="space-y-6">
            {/* Plan Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Tu Plan Financiero Personalizado
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={savePlan} variant="default">
                      Guardar Plan
                    </Button>
                    <Button onClick={clearPlan} variant="outline">
                      Generar Nuevo
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Snapshot Inicial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Situación Actual vs 12 Meses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Hoy</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Ingresos: {formatCurrency(generatedPlan.snapshotInicial.hoy.ingresos)}</div>
                        <div>Gastos: {formatCurrency(generatedPlan.snapshotInicial.hoy.gastos)}</div>
                        <div>Deuda: {formatCurrency(generatedPlan.snapshotInicial.hoy.deuda)}</div>
                        <div>Ahorro: {formatCurrency(generatedPlan.snapshotInicial.hoy.ahorro)}</div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">En 12 Meses</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Deuda: {formatCurrency(generatedPlan.snapshotInicial.en12Meses.deuda)}</div>
                        <div>Fondo Emergencia: {formatCurrency(generatedPlan.snapshotInicial.en12Meses.fondoEmergencia)}</div>
                        <div className="col-span-2">Patrimonio: {formatCurrency(generatedPlan.snapshotInicial.en12Meses.patrimonio)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Presupuesto Mensual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-green-500" />
                    Presupuesto Mensual Recomendado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Necesidades ({generatedPlan.presupuestoMensual.necesidades.porcentaje}%)</span>
                    <span className="font-medium">{formatCurrency(generatedPlan.presupuestoMensual.necesidades.cantidad)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Estilo de Vida ({generatedPlan.presupuestoMensual.estiloVida.porcentaje}%)</span>
                    <span className="font-medium">{formatCurrency(generatedPlan.presupuestoMensual.estiloVida.cantidad)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ahorro ({generatedPlan.presupuestoMensual.ahorro.porcentaje}%)</span>
                    <span className="font-medium">{formatCurrency(generatedPlan.presupuestoMensual.ahorro.cantidad)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan de Pago de Deuda */}
            {generatedPlan.planPagoDeuda.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-red-500" />
                    Plan de Eliminación de Deudas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedPlan.planPagoDeuda.map((deuda, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{deuda.deuda}</h4>
                          <Badge variant="outline">{formatCurrency(deuda.balanceActual)}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>Pago mensual: {formatCurrency(deuda.pagoMensual)}</div>
                          <div>Liquidación: {deuda.fechaLiquidacion}</div>
                          <div className="col-span-2">Intereses ahorrados: {formatCurrency(deuda.interesesAhorrados)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Roadmap de Acción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Plan de Acción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPlan.roadmapAccion.map((accion, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {accion.paso}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{accion.titulo}</h4>
                        <Badge variant="outline" className="mt-2">
                          {accion.fechaObjetivo}
                        </Badge>
                      </div>
                      {accion.completado && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Metas de Corto Plazo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metas Semanales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedPlan.metasCortoPlazo.semanales.map((meta, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{meta.titulo}</span>
                        <Badge variant={meta.tipo === 'ahorro' ? 'default' : 'destructive'}>
                          {meta.tipo}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Meta: {formatCurrency(meta.meta)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedPlan.metasCortoPlazo.mensuales.map((meta, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{meta.titulo}</span>
                        <Badge variant={meta.tipo === 'ahorro' ? 'default' : 'destructive'}>
                          {meta.tipo}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Meta: {formatCurrency(meta.meta)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Plan
