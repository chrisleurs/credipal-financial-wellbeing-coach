
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFinancialStore } from '@/store/financialStore';
import { CheckCircle, Clock, TrendingUp, Target } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

const Plan = () => {
  const navigate = useNavigate();
  const { aiPlan, generateActionPlan, isLoading } = useFinancialStore();

  const handleGenerateActionPlan = async () => {
    await generateActionPlan();
    navigate('/dashboard');
  };

  if (!aiPlan) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tu Plan Financiero Personalizado
          </h1>
          <p className="text-muted-foreground">
            Aún no tienes un plan generado. Ve al dashboard para crear uno.
          </p>
        </div>
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <p className="mb-4">No hay plan generado. Regresa al dashboard para crear tu plan personalizado.</p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-primary"
            >
              Ir al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tu Plan Financiero Personalizado
        </h1>
        <p className="text-muted-foreground">
          Basado en tu información, hemos creado un plan para alcanzar tus metas
        </p>
      </div>

      {/* Balance mensual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Balance Mensual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary mb-2">
            {formatCurrency(aiPlan.monthlyBalance)}
          </div>
          <p className="text-muted-foreground">Dinero disponible cada mes</p>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Principales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiPlan.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Desglose del presupuesto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Distribución Recomendada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Gastos Fijos</span>
                <span>{formatCurrency(aiPlan.budgetBreakdown.fixedExpenses)}</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Gastos Variables</span>
                <span>{formatCurrency(aiPlan.budgetBreakdown.variableExpenses)}</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Ahorros</span>
                <span>{formatCurrency(aiPlan.budgetBreakdown.savings)}</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Emergencias</span>
                <span>{formatCurrency(aiPlan.budgetBreakdown.emergency)}</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tiempo estimado y mensaje motivacional */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tiempo Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-2">
              {aiPlan.timeEstimate}
            </div>
            <p className="text-muted-foreground">Para alcanzar tus principales metas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensaje Motivacional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">
              "{aiPlan.motivationalMessage}"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botón para generar plan de acción */}
      <div className="text-center">
        <Button
          onClick={handleGenerateActionPlan}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-primary"
        >
          {isLoading ? 'Generando Plan de Acción...' : 'Crear Plan de Acción'}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Te ayudaremos a crear tareas específicas para implementar tu plan
        </p>
      </div>
    </div>
  );
};

export default Plan;
