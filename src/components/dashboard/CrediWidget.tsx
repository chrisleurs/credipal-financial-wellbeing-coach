
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PlanGenerationModal } from './PlanGenerationModal';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';

interface CrediWidgetProps {
  totalIncome: number;
  totalExpenses: number;
  totalDebts: number;
  kueskiLoan?: any;
  className?: string;
}

export const CrediWidget: React.FC<CrediWidgetProps> = ({
  totalIncome,
  totalExpenses,
  totalDebts,
  kueskiLoan,
  className
}) => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { currentPlan, hasPlan, isLoading } = useFinancialPlan();

  // Calculate some quick insights
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
  
  const getInsightMessage = () => {
    if (savingsRate < 10) {
      return "💡 Tip: Intenta ahorrar al menos 10% de tus ingresos";
    } else if (savingsRate > 20) {
      return "🎉 ¡Excelente! Tienes una tasa de ahorro muy buena";
    } else {
      return "👍 Vas por buen camino con tus ahorros";
    }
  };

  const getPlanProgress = () => {
    if (!currentPlan) return 0;
    
    // Calculate overall progress based on goals (simplified)
    const allGoals = [
      ...(currentPlan.shortTermGoals || []),
      ...(currentPlan.mediumTermGoals || []),
      ...(currentPlan.longTermGoals || [])
    ];
    
    if (allGoals.length === 0) return 0;
    
    const totalProgress = allGoals.reduce((sum, goal) => {
      const progress = goal.currentAmount && goal.targetAmount 
        ? (goal.currentAmount / goal.targetAmount) * 100
        : 0;
      return sum + Math.min(progress, 100);
    }, 0);
    
    return Math.round(totalProgress / allGoals.length);
  };

  if (isLoading) {
    return (
      <Card className={`bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-green-200 rounded w-3/4"></div>
            <div className="h-4 bg-green-200 rounded w-1/2"></div>
            <div className="h-8 bg-green-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-green-800 font-semibold">Credi</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="text-green-600 hover:text-green-700 hover:bg-green-100"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasPlan ? (
            // No plan state
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-green-800 mb-2">
                  ¡Hola! Soy tu asesor financiero personal
                </h3>
                <p className="text-sm text-green-600 mb-4">
                  Puedo ayudarte a crear un plan personalizado para alcanzar tus metas financieras
                </p>
                
                {/* Quick insight */}
                <div className="bg-white/70 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-700 font-medium">
                    {getInsightMessage()}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setShowPlanModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Crear Mi Plan Financiero
              </Button>
            </div>
          ) : (
            // Plan exists state
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Plan Activo
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 p-0 h-auto"
                >
                  Ver Detalles
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              <div>
                <h4 className="font-medium text-green-800 mb-2 text-sm">
                  Progreso General
                </h4>
                <Progress 
                  value={getPlanProgress()} 
                  className="mb-2 h-2" 
                />
                <div className="flex justify-between text-xs text-green-600">
                  <span>{getPlanProgress()}% completado</span>
                  <span>
                    {currentPlan.shortTermGoals?.length || 0 + 
                     currentPlan.mediumTermGoals?.length || 0 + 
                     currentPlan.longTermGoals?.length || 0} metas
                  </span>
                </div>
              </div>

              {/* Quick insights */}
              <div className="bg-white/70 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">
                    {getInsightMessage()}
                  </p>
                </div>
              </div>

              {/* Next steps */}
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-green-800">
                  Próximos Pasos:
                </h5>
                <div className="space-y-1">
                  {currentPlan.shortTermGoals?.slice(0, 2).map((goal, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {goal.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-amber-500" />
                      )}
                      <span className="text-green-700 truncate">
                        {goal.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat bubble */}
          {showChat && (
            <div className="bg-white rounded-lg p-3 border border-green-200 animate-fade-in">
              <p className="text-xs text-gray-700 mb-2">
                💬 ¿En qué puedo ayudarte hoy?
              </p>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                  Ver progreso
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                  Consejos
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <PlanGenerationModal
        open={showPlanModal}
        onOpenChange={setShowPlanModal}
        onPlanGenerated={() => {
          // Handle plan generation success
          console.log('Plan generated successfully');
        }}
      />
    </>
  );
};
