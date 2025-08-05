
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useFinancialPlan } from '@/hooks/useFinancialPlan';
import { useFinancial } from '@/hooks/useFinancial';

interface PlanGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanGenerated?: () => void;
}

const MOTIVATIONAL_MESSAGES = [
  "Analizando tu situación financiera...",
  "Credi está creando tu plan personalizado...",
  "Identificando las mejores oportunidades para ti...",
  "Calculando metas alcanzables...",
  "Generando recomendaciones específicas...",
  "Finalizando tu plan financiero personalizado..."
];

const LOADING_STEPS = [
  { icon: Brain, label: "Análisis Inteligente", description: "Revisando tus ingresos y gastos" },
  { icon: Target, label: "Definiendo Metas", description: "Creando objetivos alcanzables" },
  { icon: TrendingUp, label: "Optimizando Estrategia", description: "Maximizando tu potencial de ahorro" },
  { icon: Sparkles, label: "Personalizando Plan", description: "Adaptando todo a tu perfil único" }
];

export const PlanGenerationModal: React.FC<PlanGenerationModalProps> = ({
  open,
  onOpenChange,
  onPlanGenerated
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { generatePlan, isGenerating: hookIsGenerating } = useFinancialPlan();
  const { getFinancialDataForPlan } = useFinancial();

  // Auto-advance steps and messages during generation
  useEffect(() => {
    if (!isGenerating && !hookIsGenerating) return;

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 2000);

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    }, 1500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(messageInterval);
    };
  }, [isGenerating, hookIsGenerating]);

  const progress = isGenerating || hookIsGenerating 
    ? Math.min(((currentStep + 1) / LOADING_STEPS.length) * 100, 95)
    : 0;

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);
    setCurrentStep(0);
    setCurrentMessage(0);

    try {
      const financialData = getFinancialDataForPlan();
      await generatePlan(financialData);
      
      // Success state
      setCurrentStep(LOADING_STEPS.length - 1);
      setTimeout(() => {
        onPlanGenerated?.();
        onOpenChange(false);
        setIsGenerating(false);
      }, 1000);
      
    } catch (error: any) {
      setError(error.message || 'No se pudo generar el plan financiero');
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating && !hookIsGenerating) {
      onOpenChange(false);
      setError(null);
      setCurrentStep(0);
    }
  };

  const activeStep = LOADING_STEPS[currentStep];
  const ActiveIcon = activeStep.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-green-600" />
            Creando Tu Plan Financiero
          </DialogTitle>
          <DialogDescription>
            Credi está analizando tu información para crear un plan personalizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isGenerating && !hookIsGenerating && !error ? (
            // Initial state
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">¡Vamos a crear tu plan!</h3>
                <p className="text-gray-600 text-sm">
                  Credi utilizará tu información financiera para generar un plan personalizado 
                  con metas específicas y alcanzables.
                </p>
              </div>
              <Button 
                onClick={handleGeneratePlan}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Mi Plan Financiero
              </Button>
            </div>
          ) : error ? (
            // Error state
            <div className="text-center space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button 
                  onClick={handleGeneratePlan}
                  variant="outline"
                  className="flex-1"
                >
                  Reintentar
                </Button>
                <Button 
                  onClick={handleClose}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            // Loading state
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Current step indicator */}
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ActiveIcon className="h-6 w-6 text-green-600 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">{activeStep.label}</h4>
                  <p className="text-sm text-green-600">{activeStep.description}</p>
                </div>
              </div>

              {/* Motivational message */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-medium animate-fade-in">
                  {MOTIVATIONAL_MESSAGES[currentMessage]}
                </p>
              </div>

              {/* Steps overview */}
              <div className="grid grid-cols-2 gap-2">
                {LOADING_STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded text-xs transition-colors ${
                        isActive 
                          ? 'bg-green-100 text-green-700' 
                          : isCompleted 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <StepIcon className={`h-3 w-3 ${isActive ? 'animate-pulse' : ''}`} />
                      )}
                      <span className="font-medium">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
