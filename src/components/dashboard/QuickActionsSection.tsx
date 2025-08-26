
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { 
  PlusCircle, 
  TrendingUp, 
  CheckCircle2, 
  Target,
  ChevronRight
} from 'lucide-react'

interface QuickActionsSectionProps {
  userId: string
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ userId }) => {
  const { toast } = useToast()

  const quickActions = [
    {
      id: 'add-expense',
      title: 'Registrar Gasto',
      description: 'Anota un gasto rápidamente',
      icon: PlusCircle,
      variant: 'primary',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Registro rápido de gastos estará disponible pronto",
        })
      }
    },
    {
      id: 'add-income',
      title: 'Registrar Ingreso',
      description: 'Añade un nuevo ingreso',
      icon: TrendingUp,
      variant: 'success',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Registro rápido de ingresos estará disponible pronto",
        })
      }
    },
    {
      id: 'pay-debt',
      title: 'Pagar Deuda',
      description: 'Registra un pago de deuda',
      icon: CheckCircle2,
      variant: 'warning',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Registro de pagos estará disponible pronto",
        })
      }
    },
    {
      id: 'update-goal',
      title: 'Actualizar Meta',
      description: 'Modifica tus objetivos',
      icon: Target,
      variant: 'secondary',
      action: () => {
        toast({
          title: "Función próximamente",
          description: "Actualización de metas estará disponible pronto",
        })
      }
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Acciones Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map(action => (
          <Card 
            key={action.id} 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            onClick={action.action}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
