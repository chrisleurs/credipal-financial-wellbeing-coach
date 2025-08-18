
import React, { useState } from 'react'
import { useGoals } from '@/hooks/useGoals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Target, Trash2, Edit } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export const GoalsList = () => {
  const { goals, activeGoals, completedGoals, isLoading, createGoal, deleteGoal, isCreating } = useGoals()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    current_amount: '',
    deadline: '',
    priority: 'medium' as const,
    status: 'active' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.target_amount) return

    createGoal({
      title: formData.title,
      description: formData.description || undefined,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount) || 0,
      deadline: formData.deadline || undefined,
      priority: formData.priority,
      status: formData.status
    })

    setFormData({
      title: '',
      description: '',
      target_amount: '',
      current_amount: '',
      deadline: '',
      priority: 'medium',
      status: 'active'
    })
    setShowForm(false)
  }

  if (isLoading) {
    return <LoadingSpinner text="Cargando metas..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Metas Financieras</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Meta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Metas Activas</p>
                <p className="text-2xl font-bold text-blue-800">
                  {activeGoals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-green-600 font-medium">Metas Completadas</p>
                <p className="text-2xl font-bold text-green-800">
                  {completedGoals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Título de la Meta
                </label>
                <Input
                  placeholder="ej. Fondo de emergencia, Casa nueva, Vacaciones"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Descripción
                </label>
                <Input
                  placeholder="Descripción opcional de tu meta"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monto Objetivo
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monto Actual
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Fecha Límite
                  </label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Prioridad
                  </label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: any) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creando...' : 'Crear Meta'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 && !showForm ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay metas definidas</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primera meta financiera para comenzar a planificar tu futuro
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = goal.target_amount > 0 
              ? (goal.current_amount / goal.target_amount) * 100 
              : 0

            return (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{goal.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                          goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {goal.priority === 'high' ? 'Alta' :
                           goal.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {goal.status === 'active' ? 'Activa' :
                           goal.status === 'completed' ? 'Completada' : 'Pausada'}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {goal.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
                      </p>
                      {goal.deadline && (
                        <p className="text-sm text-muted-foreground">
                          Fecha límite: {new Date(goal.deadline).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className={`rounded-full h-3 transition-all duration-300 ${
                        goal.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {progress.toFixed(1)}% completado
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      Faltan {formatCurrency(Math.max(goal.target_amount - goal.current_amount, 0))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
