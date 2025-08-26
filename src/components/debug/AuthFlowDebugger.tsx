
import React, { useState, useEffect } from 'react'
import { useAuthFlowAudit } from '@/hooks/useAuthFlowAudit'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, Clock, Download, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

export const AuthFlowDebugger = () => {
  const { user } = useAuth()
  const { onboardingCompleted } = useOnboardingStatus()
  const { audit, runFullAudit, getAuditSummary, exportAuditLog, flowStatus } = useAuthFlowAudit()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const summary = getAuditSummary()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      loading: 'outline',
      error: 'destructive', 
      unauthenticated: 'secondary',
      determining_onboarding: 'outline',
      needs_onboarding: 'default',
      ready_for_dashboard: 'default'
    }
    
    return <Badge variant={variants[status] || 'outline'}>{status.replace('_', ' ')}</Badge>
  }

  const handleExportLog = () => {
    const auditData = exportAuditLog()
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auth-audit-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Auto-run audit when user state changes
  useEffect(() => {
    if (user) {
      runFullAudit()
    }
  }, [user?.id])

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="bg-background/95 backdrop-blur border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Auth Flow Debug</CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(flowStatus)}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? '−' : '+'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 space-y-4">
            {/* Current State Summary */}
            <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1">
              <div><strong>User:</strong> {user?.email || 'Not authenticated'}</div>
              <div><strong>User ID:</strong> {user?.id || 'None'}</div>
              <div><strong>Onboarding:</strong> {onboardingCompleted === null ? 'Unknown' : onboardingCompleted ? 'Completed' : 'Pending'}</div>
              <div><strong>Flow Status:</strong> {flowStatus}</div>
            </div>

            {/* Steps Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Steps: {summary.totalSteps}</span>
                <div className="flex gap-2">
                  <span className="text-green-600">✓{summary.successCount}</span>
                  <span className="text-red-600">✗{summary.errorCount}</span>
                  <span className="text-yellow-600">⏳{summary.pendingCount}</span>
                </div>
              </div>
            </div>

            {/* Error Summary */}
            {summary.hasErrors && (
              <div className="bg-red-50 border border-red-200 p-2 rounded text-xs">
                <div className="font-medium text-red-800 mb-1">Errors Found:</div>
                {summary.errors.map((error, idx) => (
                  <div key={idx} className="text-red-700">
                    • {error.step}: {error.error}
                  </div>
                ))}
              </div>
            )}

            {/* Latest Steps */}
            <div className="max-h-32 overflow-y-auto space-y-1">
              <div className="text-xs font-medium mb-1">Recent Steps:</div>
              {audit.steps.slice(-5).reverse().map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs bg-muted/30 p-1 rounded">
                  {getStatusIcon(step.status)}
                  <span className="flex-1 font-mono">{step.step}</span>
                  <span className="text-muted-foreground">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runFullAudit}
                className="flex-1"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Re-audit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportLog}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
