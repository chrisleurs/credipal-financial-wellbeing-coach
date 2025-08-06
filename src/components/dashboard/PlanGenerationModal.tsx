
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/helpers'
import { CheckCircle, Target, Clock, Sparkles } from 'lucide-react'
import type { FinancialGoal } from '@/types/financialPlan'

interface PlanGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  goals: FinancialGoal[]
  analysis: string
  motivationalMessage: string
  monthlyCapacity: number
  onConfirm: () => Promise<void>
  onAdjust: () => void
  isConfirming: boolean
}

export const PlanGenerationModal: React.FC<PlanGenerationModalProps> = ({
  isOpen,
  onClose,
  goals,
  analysis,
  motivationalMessage,
  monthlyCapacity,
  onConfirm,
  onAdjust,
  isConfirming
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'short': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'long': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'short': return 'Corto Plazo'
      case 'medium': return 'Mediano Plazo'
      case 'long': return 'Largo Plazo'
      default: return type
    }
  }

  const getTimeEstimate = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    
    if (diffMonths <= 3) return `${diffMonths} meses`
    if (diffMonths <= 12) return `${diffMonths} meses`
    return `${Math.ceil(diffMonths / 12)} año${diffMonths > 12 ? 's' : ''}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            ¡Tu Plan Financiero Está Listo!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Analysis Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Análisis de tu Situación</h3>
              <p className="text-muted-foreground">{analysis}</p>
              <div className="mt-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Capacidad mensual: {formatCurrency(monthlyCapacity)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Goals Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tus 3 Metas Personalizadas</h3>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
              {goals.map((goal, index) => (
                <Card key={goal.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{goal.emoji}</span>
                        <Badge className={getTypeColor(goal.type)}>
                          {getTypeLabel(goal.type)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Meta #{index + 1}
                      </div>
                    </div>

                    <h4 className="font-semibold text-lg mb-2">{goal.title}</h4>
                    
                    <div className="space-y-3">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{Math.round(goal.progress)}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      {/* Amount */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Objetivo:</span>
                        <span className="font-semibold">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Actual:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {getTimeEstimate(goal.deadline)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Motivational Message */}
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <h3 className="font-semibold mb-2">Mensaje de Credi</h3>
                  <p className="text-white/90">{motivationalMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onAdjust}
            disabled={isConfirming}
          >
            Quiero Ajustarlo
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isConfirming}
            className="bg-primary hover:bg-primary/90"
          >
            {isConfirming ? 'Guardando...' : 'Me Gusta Mi Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
