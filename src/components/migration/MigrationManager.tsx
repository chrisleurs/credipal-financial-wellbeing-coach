
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { AlertTriangle, CheckCircle, Play, RotateCcw, BarChart3 } from 'lucide-react'

interface MigrationStatus {
  migration_name: string
  status: string
  total_records: number
  migrated_records: number
  failed_records: number
  success_percentage: number
  started_at: string | null
  completed_at: string | null
  duration: string | null
}

interface ValidationResult {
  validation_type: string
  old_count: number
  new_count: number
  status: string
}

export const MigrationManager = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isRollingBack, setIsRollingBack] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus[]>([])
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const { toast } = useToast()

  const runMigration = async () => {
    setIsRunning(true)
    try {
      const { error } = await supabase.rpc('run_credipal_migration')
      
      if (error) throw error
      
      toast({
        title: "Migración iniciada",
        description: "La migración de datos se ha ejecutado exitosamente.",
      })
      
      await fetchMigrationStatus()
    } catch (error) {
      console.error('Migration error:', error)
      toast({
        title: "Error en migración",
        description: "Hubo un error al ejecutar la migración de datos.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const validateMigration = async () => {
    setIsValidating(true)
    try {
      const { data, error } = await supabase.rpc('validate_migration')
      
      if (error) throw error
      
      setValidationResults(data || [])
      toast({
        title: "Validación completada",
        description: "Los resultados de la migración han sido validados.",
      })
    } catch (error) {
      console.error('Validation error:', error)
      toast({
        title: "Error en validación",
        description: "Hubo un error al validar la migración.",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const rollbackMigration = async () => {
    if (!window.confirm('¿Estás seguro de que quieres revertir la migración? Esta acción no se puede deshacer.')) {
      return
    }

    setIsRollingBack(true)
    try {
      const { error } = await supabase.rpc('rollback_migration')
      
      if (error) throw error
      
      toast({
        title: "Rollback completado",
        description: "La migración ha sido revertida exitosamente.",
      })
      
      await fetchMigrationStatus()
    } catch (error) {
      console.error('Rollback error:', error)
      toast({
        title: "Error en rollback",
        description: "Hubo un error al revertir la migración.",
        variant: "destructive",
      })
    } finally {
      setIsRollingBack(false)
    }
  }

  const fetchMigrationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('migration_summary')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setMigrationStatus(data || [])
    } catch (error) {
      console.error('Error fetching migration status:', error)
    }
  }

  React.useEffect(() => {
    fetchMigrationStatus()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Migración de Datos CrediPal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta herramienta migra datos desde las tablas antiguas de CrediPal (en español) 
              a la nueva estructura en inglés. Asegúrate de hacer un respaldo antes de ejecutar.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              onClick={runMigration} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Ejecutando...' : 'Ejecutar Migración'}
            </Button>

            <Button 
              variant="outline"
              onClick={validateMigration} 
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isValidating ? 'Validando...' : 'Validar Resultados'}
            </Button>

            <Button 
              variant="destructive"
              onClick={rollbackMigration} 
              disabled={isRollingBack}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {isRollingBack ? 'Revirtiendo...' : 'Revertir Migración'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {migrationStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estado de la Migración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migrationStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{status.migration_name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {status.migrated_records} exitosos, {status.failed_records} fallidos
                      {status.duration && ` • ${status.duration}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{status.success_percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {status.migrated_records}/{status.total_records}
                      </div>
                    </div>
                    <Badge variant={
                      status.status === 'completed' ? 'default' :
                      status.status === 'in_progress' ? 'secondary' :
                      status.status === 'failed' ? 'destructive' : 'outline'
                    }>
                      {status.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Validación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <span className="font-medium">{result.validation_type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Migrados: {result.old_count} → Actuales: {result.new_count}
                    </span>
                    <Badge variant={result.status === 'OK' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
