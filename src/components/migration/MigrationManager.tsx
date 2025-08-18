
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Database, CheckCircle, XCircle, Clock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface MigrationStatus {
  migration_name: string
  status: string
  total_records: number
  migrated_records: number
  failed_records: number
  started_at: string | null
  completed_at: string | null
}

interface ValidationResult {
  validation_type: string
  old_count: number
  new_count: number
  status: string
}

export default function MigrationManager() {
  const [isRunning, setIsRunning] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus[]>([])
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const { toast } = useToast()

  const runMigration = async () => {
    setIsRunning(true)
    try {
      // Execute the migration function via SQL
      const { error } = await supabase.rpc('run_credipal_migration' as any)
      
      if (error) throw error
      
      toast({
        title: "Migration Started",
        description: "The data migration process has been initiated.",
      })
      
      // Refresh status after a delay
      setTimeout(() => {
        fetchMigrationStatus()
      }, 2000)
      
    } catch (error) {
      console.error('Migration error:', error)
      toast({
        title: "Migration Error",
        description: "Failed to start migration process.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const validateMigration = async () => {
    try {
      // Execute validation function via SQL
      const { data, error } = await supabase.rpc('validate_migration' as any)
      
      if (error) throw error
      
      setValidationResults(data || [])
      
      toast({
        title: "Validation Complete",
        description: "Migration validation has been completed.",
      })
      
    } catch (error) {
      console.error('Validation error:', error)
      toast({
        title: "Validation Error",
        description: "Failed to validate migration.",
        variant: "destructive",
      })
    }
  }

  const rollbackMigration = async () => {
    if (!window.confirm('Are you sure you want to rollback the migration? This will remove all migrated data.')) {
      return
    }
    
    try {
      const { error } = await supabase.rpc('rollback_migration' as any)
      
      if (error) throw error
      
      toast({
        title: "Rollback Complete",
        description: "Migration has been rolled back successfully.",
      })
      
      setMigrationStatus([])
      setValidationResults([])
      
    } catch (error) {
      console.error('Rollback error:', error)
      toast({
        title: "Rollback Error",
        description: "Failed to rollback migration.",
        variant: "destructive",
      })
    }
  }

  const fetchMigrationStatus = async () => {
    try {
      // Use raw SQL query since the table may not be in types
      const { data, error } = await supabase
        .from('migration_status' as any)
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Migration status query error:', error)
        // If table doesn't exist, just set empty array
        setMigrationStatus([])
        return
      }
      
      // Safely cast the data to our interface
      const statusData: MigrationStatus[] = (data || []).map((item: any) => ({
        migration_name: item.migration_name || '',
        status: item.status || 'unknown',
        total_records: item.total_records || 0,
        migrated_records: item.migrated_records || 0,
        failed_records: item.failed_records || 0,
        started_at: item.started_at || null,
        completed_at: item.completed_at || null
      }))
      
      setMigrationStatus(statusData)
      
    } catch (error) {
      console.error('Failed to fetch migration status:', error)
      setMigrationStatus([])
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
            <Database className="h-5 w-5" />
            CrediPal Data Migration Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runMigration} 
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Running Migration...
                </>
              ) : (
                'Run Migration'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={validateMigration}
              className="flex-1"
            >
              Validate Results
            </Button>
            <Button 
              variant="destructive" 
              onClick={rollbackMigration}
              className="flex-1"
            >
              Rollback
            </Button>
          </div>
        </CardContent>
      </Card>

      {migrationStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migrationStatus.map((status) => (
                <div key={status.migration_name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{status.migration_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {status.migrated_records}/{status.total_records} records
                      {status.failed_records > 0 && ` (${status.failed_records} failed)`}
                    </p>
                  </div>
                  <Badge
                    variant={
                      status.status === 'completed' ? 'default' :
                      status.status === 'in_progress' ? 'secondary' :
                      status.status === 'failed' ? 'destructive' : 'outline'
                    }
                  >
                    {status.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {validationResults.map((result) => (
                <div key={result.validation_type} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium capitalize">{result.validation_type.replace('_', ' ')}</h4>
                    <p className="text-sm text-muted-foreground">
                      Migrated: {result.old_count} → Current: {result.new_count}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.status === 'OK' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <Badge variant={result.status === 'OK' ? 'default' : 'secondary'}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Always create a backup before running migration</li>
            <li>• Test with a subset of users first</li>
            <li>• Validate results before proceeding to production</li>
            <li>• Keep rollback scripts ready in case of issues</li>
            <li>• Monitor system performance during migration</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
