
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Sparkles, ListTodo, Calendar, Target, DollarSign, AlertTriangle } from 'lucide-react'
import { useFinancialPlanManager } from '@/hooks/useFinancialPlanManager'
import { formatCurrency } from '@/utils/helpers'

interface ActionTask {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'debt' | 'savings' | 'budget' | 'goal'
  targetDate: string
  targetAmount?: number
  completed: boolean
  impact: string
}

export const ActionPlanSection = () => {
  const { activePlan, updateGoalProgress, isUpdatingProgress } = useFinancialPlanManager()

  // Generar tareas accionables basadas en el plan real
  const generateActionTasks = (): ActionTask[] => {
    if (!activePlan) return []

    const tasks: ActionTask[] = []

    // Tareas del roadmap de acción
    if (activePlan.actionRoadmap && Array.isArray(activePlan.actionRoadmap)) {
      activePlan.actionRoadmap.forEach((action, index) => {
        if (action && !action.completed) {
          tasks.push({
            id: `roadmap-${action.step}`,
            title: action.title,
            description: action.description || 'Paso importante en tu camino financiero',
            priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
            category: 'goal',
            targetDate: action.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
            impact: 'Progreso general del plan'
          })
        }
      })
    }

    // Tareas de pago de deudas
    if (activePlan.debtPayoffPlan && Array.isArray(activePlan.debtPayoffPlan)) {
      activePlan.debtPayoffPlan.forEach((debt, index) => {
        tasks.push({
          id: `debt-${index}`,
          title: `Pagar ${debt.debtName}`,
          description: `Realiza el pago mensual de ${formatCurrency(debt.monthlyPayment)}`,
          priority: 'high',
          category: 'debt',
          targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          targetAmount: debt.monthlyPayment,
          completed: false,
          impact: `Eliminar deuda para ${debt.payoffDate}`
        })
      })
    }

    // Tarea de fondo de emergencia
    if (activePlan.emergencyFund && activePlan.emergencyFund.targetAmount > activePlan.emergencyFund.currentAmount) {
      const monthlySaving = activePlan.emergencyFund.monthlySaving || 500
      tasks.push({
        id: 'emergency-fund',
        title: 'Ahorrar para fondo de emergencia',
        description: `Destina ${formatCurrency(monthlySaving)} este mes a tu fondo de emergencia`,
        priority: 'high',
        category: 'savings',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        targetAmount: monthlySaving,
        completed: false,
        impact: 'Protección financiera'
      })
    }

    // Tareas de presupuesto
    if (activePlan.recommendedBudget) {
      tasks.push({
        id: 'budget-review',
        title: 'Revisar gastos del mes',
        description: 'Asegúrate de cumplir con el presupuesto 50/30/20',
        priority: 'medium',
        category: 'budget',
        targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        impact: 'Mantener disciplina financiera'
      })
    }

    return tasks.slice(0, 6) // Limitar a 6 tareas
  }

  const actionTasks = generateActionTasks()

  const getPriorityColor = (priority: ActionTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getCategoryIcon = (category: ActionTask['category']) => {
    switch (category) {
      case 'debt': return <DollarSign className="h-4 w-4" />
      case 'savings': return <Target className="h-4 w-4" />
      case 'budget': return <ListTodo className="h-4 w-4" />
      case 'goal': return <Sparkles className="h-4 w-4" />
    }
  }

  const handleCompleteTask = (taskId: string) => {
    updateGoalProgress({ goalId: taskId, progress: 100 })
  }

  if (!activePlan) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Plan de Acción</h2>
          <Sparkles className="h-5 w-5 text-[#F59E0B]" />
        </div>
        
        <Card className="border-[#F59E0B]/20 bg-[#F59E0B]/5">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-[#F59E0B]" />
              <div>
                <p className="font-medium text-gray-900 mb-1">No hay plan financiero</p>
                <p className="text-sm text-gray-500">
                  Genera tu plan para obtener tareas específicas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (actionTasks.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Plan de Acción</h2>
          <Sparkles className="h-5 w-5 text-[#F59E0B]" />
        </div>
        
        <Card className="border-[#10B981]/20 bg-[#10B981]/5">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
              <div>
                <p className="font-medium text-gray-900 mb-1">¡Todas las tareas completadas!</p>
                <p className="text-sm text-gray-500">
                  Excelente trabajo, sigue así
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Plan de Acción</h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {actionTasks.length} tareas
        </Badge>
      </div>
      
      <div className="space-y-3">
        {actionTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto mt-1"
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={isUpdatingProgress || task.completed}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-green-600" />
                  )}
                </Button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(task.category)}
                      <span className="capitalize">{task.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(task.targetDate).toLocaleDateString()}</span>
                    </div>

                    {task.targetAmount && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(task.targetAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    💡 {task.impact}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
