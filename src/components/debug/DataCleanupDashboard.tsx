
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDataCleanup } from '@/hooks/useDataCleanup'
import { AlertTriangle, CheckCircle, RefreshCw, Database } from 'lucide-react'

export const DataCleanupDashboard = () => {
  const { cleanupStatus, isCleaningUp, executeCleanup, analyzeDataState } = useDataCleanup()

  if (!cleanupStatus) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Analizando estado de los datos...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Estado de Consolidación de Datos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Datos del Onboarding</span>
            <Badge variant={cleanupStatus.hasOnboardingData ? "destructive" : "secondary"}>
              {cleanupStatus.hasOnboardingData ? "Presente" : "Limpio"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Datos Consolidados</span>
            <Badge variant={cleanupStatus.hasConsolidatedData ? "default" : "secondary"}>
              {cleanupStatus.hasConsolidatedData ? "Presente" : "Ausente"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Estado</span>
            <Badge variant={cleanupStatus.needsCleanup ? "destructive" : "default"}>
              {cleanupStatus.needsCleanup ? "Necesita Limpieza" : "Óptimo"}
            </Badge>
          </div>
        </div>

        {cleanupStatus.needsCleanup && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Duplicación de Datos Detectada
                </h4>
                <p className="text-yellow-700 text-sm mb-4">
                  Se detectaron datos tanto en el JSON de onboarding como en las tablas consolidadas. 
                  Esto puede causar inconsistencias en el dashboard.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={executeCleanup}
                    disabled={isCleaningUp}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isCleaningUp ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Limpiando...
                      </>
                    ) : (
                      'Ejecutar Limpieza'
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={analyzeDataState}
                    disabled={isCleaningUp}
                  >
                    Re-analizar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!cleanupStatus.needsCleanup && cleanupStatus.hasConsolidatedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">
                  Datos Consolidados Correctamente
                </h4>
                <p className="text-green-700 text-sm">
                  Los datos están unificados y el dashboard lee de una sola fuente.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
