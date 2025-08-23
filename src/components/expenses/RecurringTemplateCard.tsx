
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { MoreVertical, Edit, Trash2, BarChart3 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/utils/helpers'

interface RecurringTemplate {
  id: string
  name: string
  amount: number
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  nextDate: string
  category: string
  isActive: boolean
}

interface RecurringTemplateCardProps {
  template: RecurringTemplate
  onToggleActive: (id: string, isActive: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onViewHistory: (id: string) => void
}

export const RecurringTemplateCard: React.FC<RecurringTemplateCardProps> = ({
  template,
  onToggleActive,
  onEdit,
  onDelete,
  onViewHistory
}) => {
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Semanal'
      case 'biweekly': return 'Quincenal'
      case 'monthly': return 'Mensual'
      case 'yearly': return 'Anual'
      default: return frequency
    }
  }

  return (
    <Card className={`border transition-colors ${template.isActive ? 'bg-background' : 'bg-muted/20'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{template.name}</h3>
              <Badge variant="outline">{template.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {getFrequencyText(template.frequency)} • Próximo: {new Date(template.nextDate).toLocaleDateString('es-ES')}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewHistory(template.id)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver historial
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(template.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold">{formatCurrency(template.amount)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {template.isActive ? 'Activo' : 'Pausado'}
            </span>
            <Switch
              checked={template.isActive}
              onCheckedChange={(checked) => onToggleActive(template.id, checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
