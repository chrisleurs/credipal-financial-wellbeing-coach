import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useFinancialStore } from '@/store/financialStore';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Target,
  Calendar,
  MessageCircle
} from 'lucide-react';

const Dashboard = () => {
  const { actionPlan, aiPlan, financialData } = useFinancialStore();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getCompletionPercentage = () => {
    if (!actionPlan?.tasks.length) return 0;
    return Math.round((completedTasks.length / actionPlan.tasks.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!actionPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p>No hay plan de acción disponible.</p>
            <Button className="mt-4">
              Generar Plan de Acción
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Financiero
          </h1>
          <p className="text-gray-600">
            Sigue tu progreso y completa las tareas para alcanzar tus metas
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                Balance Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ${aiPlan?.monthlyBalance.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                Progreso del Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {getCompletionPercentage()}%
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Próxima Revisión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-gray-700">
                {actionPlan.nextReviewDate}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de tareas */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Plan de Acción</CardTitle>
              {actionPlan.whatsappReminders && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  WhatsApp activo
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionPlan.tasks.map((task) => (
                <div 
                  key={task.id}
                  className={`border rounded-lg p-4 ${
                    completedTasks.includes(task.id) 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-semibold ${
                          completedTasks.includes(task.id) 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <Badge 
                          variant={getPriorityColor(task.priority)}
                          className="flex items-center gap-1"
                        >
                          {getPriorityIcon(task.priority)}
                          {task.priority}
                        </Badge>
                      </div>
                      <p className={`text-sm mb-3 ${
                        completedTasks.includes(task.id) 
                          ? 'text-gray-400' 
                          : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                      <div className="text-xs text-gray-500 mb-2">
                        Fecha límite: {task.dueDate}
                      </div>
                      {task.steps.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Pasos a seguir:
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {task.steps.map((step, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-emerald-600">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen del plan AI */}
        {aiPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Recomendaciones Principales</h4>
                  <ul className="space-y-2">
                    {aiPlan.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Mensaje Motivacional</h4>
                  <p className="text-sm text-gray-700 italic bg-emerald-50 p-3 rounded-lg">
                    "{aiPlan.motivationalMessage}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;