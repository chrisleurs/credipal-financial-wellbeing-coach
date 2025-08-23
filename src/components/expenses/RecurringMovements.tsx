
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecurringTemplateCard } from './RecurringTemplateCard'
import { formatCurrency } from '@/utils/helpers'
import { useToast } from '@/hooks/use-toast'

// Mock data for recurring templates - in real app, this would come from API
const mockRecurringTemplates = [
  {
    id: '1',
    name: 'Netflix',
    amount: 199,
    frequency: 'monthly' as const,
    nextDate: '2024-01-15',
    category: 'Entertainment',
    isActive: true
  },
  {
    id: '2',
    name: 'Renta',
    amount: 8000,
    frequency: 'monthly' as const,
    nextDate: '2024-01-01',
    category: 'Housing & Utilities',
    isActive: true
  },
  {
    id: '3',
    name: 'Gym',
    amount: 500,
    frequency: 'monthly' as const,
    nextDate: '2024-01-10',
    category: 'Healthcare',
    isActive: false
  }
]

export const RecurringMovements: React.FC = () => {
  const [templates, setTemplates] = useState(mockRecurringTemplates)
  const { toast } = useToast()

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeTemplates = templates.filter(t => t.isActive)
    const totalMonthly = activeTemplates.reduce((sum, template) => {
      // Convert all frequencies to monthly amount
      switch (template.frequency) {
        case 'weekly': return sum + (template.amount * 4)
        case 'biweekly': return sum + (template.amount * 2)
        case 'yearly': return sum + (template.amount / 12)
        default: return sum + template.amount
      }
    }, 0)

    const next30Days = activeTemplates.filter(template => {
      const nextDate = new Date(template.nextDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return nextDate <= thirtyDaysFromNow
    })

    return {
      totalMonthly,
      activeCount: activeTemplates.length,
      totalCount: templates.length,
      next30Days: next30Days.length
    }
  }, [templates])

  const handleToggleActive = (id: string, isActive: boolean) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, isActive } : template
    ))
    
    toast({
      title: isActive ? "Suscripción activada" : "Suscripción pausada",
      description: isActive ? "Se reanudarán los cargos" : "Se pausaron los cargos automáticos",
    })
  }

  const handleEdit = (id: string) => {
    // TODO: Open edit modal
    console.log('Edit template:', id)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta suscripción?')) {
      setTemplates(prev => prev.filter(template => template.id !== id))
      toast({
        title: "Suscripción eliminada",
        description: "La suscripción se ha eliminado permanentemente",
      })
    }
  }

  const handleViewHistory = (id: string) => {
    // TODO: Show history modal
    console.log('View history for:', id)
    toast({
      title: "Historial",
      description: "Mostrando historial de transacciones...",
    })
  }

  if (templates.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Suscripciones recurrentes</h3>
            <p className="text-muted-foreground mb-4">
              Crea suscripciones recurrentes desde el botón +
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Crear Suscripción
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumen Recurrente</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(metrics.totalMonthly)}
              </p>
              <p className="text-sm text-muted-foreground">Total mensual</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {metrics.activeCount}/{metrics.totalCount}
              </p>
              <p className="text-sm text-muted-foreground">Activas</p>
            </div>
          </div>
          
          {metrics.next30Days > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm">
                <span className="font-medium">{metrics.next30Days} cargos</span> en los próximos 30 días
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Templates List */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Suscripciones y Servicios
        </h3>
        
        <div className="space-y-3">
          {templates.map((template) => (
            <RecurringTemplateCard
              key={template.id}
              template={template}
              onToggleActive={handleToggleActive}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
