import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useFinancialPlan } from '@/hooks/useFinancialPlan'
import { Loader2, RefreshCw, TrendingUp } from 'lucide-react'

/**
 * Example component showing how to use the useFinancialPlan hook
 * in a real dashboard scenario
 */
export const FinancialPlanExample: React.FC = () => {
  const {
    plan,
    loading,
    error,
    generatePlan,
    isGenerating,
    isStale,
    lastUpdated
  } = useFinancialPlan()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando tu plan financiero...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            onClick={() => generatePlan()} 
            variant="outline" 
            className="mt-4"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!plan) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No hay plan financiero activo</p>
          <p className="text-sm text-gray-400 mt-2">
            Completa tu onboarding para generar tu plan personalizado
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and stale indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mi Plan Financiero</h2>
          <p className="text-gray-600">¡Tu plan personalizado está listo!</p>
        </div>
        <div className="flex items-center gap-2">
          {isStale && (
            <Badge variant="outline" className="text-yellow-600">
              Datos no actualizados
            </Badge>
          )}
          <Button
            onClick={() => generatePlan()}
            variant="outline"
            size="sm"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Snapshot Inicial */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">${plan.snapshotInicial.hoy.ingresos.toLocaleString()}</div>
              <div className="text-sm opacity-90">Ingresos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${plan.snapshotInicial.hoy.gastos.toLocaleString()}</div>
              <div className="text-sm opacity-90">Gastos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${plan.snapshotInicial.hoy.deuda.toLocaleString()}</div>
              <div className="text-sm opacity-90">Deuda Actual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${plan.snapshotInicial.hoy.ahorro.toLocaleString()}</div>
              <div className="text-sm opacity-90">Ahorros</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presupuesto Mensual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Presupuesto Mensual Recomendado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Necesidades ({plan.presupuestoMensual.necesidades.porcentaje}%)</span>
              <span className="font-medium">${plan.presupuestoMensual.necesidades.cantidad.toLocaleString()}</span>
            </div>
            <Progress value={plan.presupuestoMensual.necesidades.porcentaje} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span>Estilo de Vida ({plan.presupuestoMensual.estiloVida.porcentaje}%)</span>
              <span className="font-medium">${plan.presupuestoMensual.estiloVida.cantidad.toLocaleString()}</span>
            </div>
            <Progress value={plan.presupuestoMensual.estiloVida.porcentaje} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span>Ahorro ({plan.presupuestoMensual.ahorro.porcentaje}%)</span>
              <span className="font-medium">${plan.presupuestoMensual.ahorro.cantidad.toLocaleString()}</span>
            </div>
            <Progress value={plan.presupuestoMensual.ahorro.porcentaje} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Fondo de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle>Fondo de Emergencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progreso: ${plan.fondoEmergencia.progresoActual.toLocaleString()}</span>
            <span>Meta: ${plan.fondoEmergencia.metaTotal.toLocaleString()}</span>
          </div>
          <Progress 
            value={(plan.fondoEmergencia.progresoActual / plan.fondoEmergencia.metaTotal) * 100} 
            className="h-3" 
          />
          <p className="text-sm text-gray-600">
            Ahorro mensual sugerido: ${plan.fondoEmergencia.ahorroMensual.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Fecha estimada de completación: {plan.fondoEmergencia.fechaCompletion}
          </p>
        </CardContent>
      </Card>

      {/* Metas de Corto Plazo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Metas Semanales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.metasCortoPlazo.semanales.map((meta, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{meta.titulo}</span>
                  <Badge variant={meta.tipo === 'ahorro' ? 'default' : 'destructive'}>
                    ${meta.meta.toLocaleString()}
                  </Badge>
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
            {plan.metasCortoPlazo.mensuales.map((meta, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{meta.titulo}</span>
                  <Badge variant={meta.tipo === 'ahorro' ? 'default' : 'destructive'}>
                    ${meta.meta.toLocaleString()}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>Última actualización: {lastUpdated}</p>
            <p>Es obsoleto: {isStale ? 'Sí' : 'No'}</p>
            <p>Deuda inicial: ${plan.snapshotInicial.hoy.deuda.toLocaleString()}</p>
            <p>Proyección 12 meses: ${plan.snapshotInicial.en12Meses.patrimonio.toLocaleString()}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FinancialPlanExample
