
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Calendar, DollarSign, PiggyBank, CreditCard } from 'lucide-react';
import { GoalCard } from './GoalCard';
import { MetricCard } from './MetricCard';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { useFinancial } from '@/hooks/useFinancial';
import type { AIGeneratedPlan } from '@/types';

interface FinancialPlanViewProps {
  plan: AIGeneratedPlan;
  className?: string;
}

export const FinancialPlanView: React.FC<FinancialPlanViewProps> = ({ 
  plan, 
  className 
}) => {
  const { data: financialData } = useFinancial();
  const { updateGoalProgress } = useFinancialPlan();

  // Calculate metrics from financial data
  const totalIncome = financialData?.monthly_income || 0;
  const totalExpenses = financialData?.monthly_expenses || 0;
  const currentSavings = financialData?.current_savings || 0;
  const balance = totalIncome - totalExpenses;

  // FIXED: Proper progress update handler
  const handleGoalProgressUpdate = (goalId: string, progress: number) => {
    updateGoalProgress({ goalId, progress });
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with motivational message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Brain className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              ¡Tu Plan Financiero Está Listo!
            </h1>
            <p className="text-green-700 text-lg leading-relaxed">
              {plan.motivationalMessage}
            </p>
            <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-200">
              Plan Activo
            </Badge>
          </div>
        </div>
      </div>

      {/* Compact Dashboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Ingresos"
          value={`$${totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          variant="positive"
          trend={{ direction: 'up', percentage: '+5%' }}
        />
        <MetricCard
          title="Gastos"
          value={`$${totalExpenses.toLocaleString()}`}
          icon={CreditCard}
          variant="warning"
          trend={{ direction: 'down', percentage: '-3%' }}
        />
        <MetricCard
          title="Balance"
          value={`$${balance.toLocaleString()}`}
          icon={DollarSign}
          variant={balance >= 0 ? 'positive' : 'warning'}
          trend={{ direction: balance >= 0 ? 'up' : 'down', percentage: '8%' }}
        />
        <MetricCard
          title="Ahorros"
          value={`$${currentSavings.toLocaleString()}`}
          icon={PiggyBank}
          variant="positive"
          trend={{ direction: 'up', percentage: '+12%' }}
        />
      </div>

      {/* Short Term Goals - 3 columns */}
      {plan.shortTermGoals && plan.shortTermGoals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Metas a Corto Plazo</h2>
            <Badge variant="secondary">1-3 meses</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plan.shortTermGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleGoalProgressUpdate}
                variant="short"
              />
            ))}
          </div>
        </div>
      )}

      {/* Medium Term Goals - 2 columns */}
      {plan.mediumTermGoals && plan.mediumTermGoals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Metas a Mediano Plazo</h2>
            <Badge variant="secondary">3-12 meses</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.mediumTermGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleGoalProgressUpdate}
                variant="medium"
              />
            ))}
          </div>
        </div>
      )}

      {/* Long Term Goal - Prominent single card */}
      {plan.longTermGoals && plan.longTermGoals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Meta a Largo Plazo</h2>
            <Badge variant="secondary">12+ meses</Badge>
          </div>
          <div className="max-w-2xl">
            {plan.longTermGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleGoalProgressUpdate}
                variant="long"
                prominent
              />
            ))}
          </div>
        </div>
      )}

      {/* Budget Breakdown Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-green-600" />
            Resumen del Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Balance Mensual</h4>
              <p className={`text-2xl font-bold ${plan.monthlyBalance >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                ${plan.monthlyBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ahorro Sugerido</h4>
              <p className="text-2xl font-bold text-green-600">
                ${plan.savingsSuggestion.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
