import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useFinancialStore } from '@/store/financialStore';
import { Loader2 } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    financialData,
    isLoading,
    setCurrentStep, 
    updateFinancialData, 
    generateAIPlan,
    completeOnboarding 
  } = useFinancialStore();

  const [localData, setLocalData] = useState(financialData);

  const handleNext = () => {
    updateFinancialData(localData);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await generateAIPlan();
    await completeOnboarding();
    navigate('/plan');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="monthlyIncome">Ingresos mensuales</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={localData.monthlyIncome}
                onChange={(e) => setLocalData({
                  ...localData,
                  monthlyIncome: Number(e.target.value)
                })}
                placeholder="Ej: 50000"
              />
            </div>
            <div>
              <Label htmlFor="extraIncome">Ingresos extra (opcional)</Label>
              <Input
                id="extraIncome"
                type="number"
                value={localData.extraIncome}
                onChange={(e) => setLocalData({
                  ...localData,
                  extraIncome: Number(e.target.value)
                })}
                placeholder="Ej: 10000"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="monthlyExpenses">Gastos mensuales totales</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={localData.monthlyExpenses}
                onChange={(e) => setLocalData({
                  ...localData,
                  monthlyExpenses: Number(e.target.value)
                })}
                placeholder="Ej: 35000"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentSavings">Ahorros actuales</Label>
              <Input
                id="currentSavings"
                type="number"
                value={localData.currentSavings}
                onChange={(e) => setLocalData({
                  ...localData,
                  currentSavings: Number(e.target.value)
                })}
                placeholder="Ej: 20000"
              />
            </div>
            <div>
              <Label htmlFor="monthlySavingsCapacity">Capacidad de ahorro mensual</Label>
              <Input
                id="monthlySavingsCapacity"
                type="number"
                value={localData.monthlySavingsCapacity}
                onChange={(e) => setLocalData({
                  ...localData,
                  monthlySavingsCapacity: Number(e.target.value)
                })}
                placeholder="Ej: 5000"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="goals">Metas financieras (una por línea)</Label>
              <Textarea
                id="goals"
                value={localData.financialGoals.join('\n')}
                onChange={(e) => setLocalData({
                  ...localData,
                  financialGoals: e.target.value.split('\n').filter(goal => goal.trim())
                })}
                placeholder="Ej: Comprar casa&#10;Fondo de emergencia&#10;Vacaciones"
                rows={4}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="whatsapp"
                checked={localData.whatsappOptin}
                onCheckedChange={(checked) => setLocalData({
                  ...localData,
                  whatsappOptin: checked
                })}
              />
              <Label htmlFor="whatsapp">Recibir recordatorios por WhatsApp</Label>
            </div>
            <p className="text-sm text-gray-600">
              Te enviaremos recordatorios útiles para mantener tus finanzas en orden.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Ingresos',
    'Gastos',
    'Ahorros',
    'Metas',
    'Notificaciones'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {stepTitles[currentStep]} ({currentStep + 1}/5)
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : currentStep === 4 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;