
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
  MessageCircle,
  Brain,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { 
    actionTasks, 
    aiPlan, 
    financialData, 
    generateAIPlan, 
    generateActionTasks, 
    isLoading 
  } = useFinancialStore();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getCompletionPercentage = () => {
    if (!actionTasks.length) return 0;
    return Math.round((completedTasks.length / actionTasks.length) * 100);
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

  const handleGeneratePlan = async () => {
    await generateAIPlan();
    await generateActionTasks();
  };

  // Si no hay plan generado, mostrar botón para generar
  if (!aiPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Financiero
            </h1>
            <p className="text-gray-600">
              ¡Bienvenido! Ahora vamos a generar tu plan financiero personalizado
            </p>
          </div>

          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <div className="bg-emerald-100 p-6 rounded-full w-20 h-20 mx-auto mb-4">
                <Brain className="h-8 w-8 text-emerald-600 mx-auto mt-2" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Genera tu Plan Financiero
              </h3>
              <p className="text-gray-600 mb-6">
                Basado en la información que proporcionaste, crearemos un plan 
                personalizado con recomendaciones y tareas específicas.
              </p>
              <Button 
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando plan...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar mi Plan Financiero
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
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
                ${aiPlan.monthlyBalance.toLocaleString()}
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
                <Target className="h-4 w-4" />
                Metas Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {financialData.financialGoals.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de tareas */}
        {actionTasks.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Plan de Acción</CardTitle>
                {financialData.whatsappOptin && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    WhatsApp activo
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actionTasks.map((task) => (
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen del plan AI */}
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

        {/* Metas financieras */}
        {financialData.financialGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tus Metas Financieras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {financialData.financialGoals.map((goal, index) => (
                  <div key={index} className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-800">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
