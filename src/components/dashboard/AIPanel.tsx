
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

interface AIPanelProps {
  hasAIPlan?: boolean;
  onGeneratePlan?: () => void;
  isLoading?: boolean;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  hasAIPlan = false,
  onGeneratePlan,
  isLoading = false
}) => {
  return (
    <div className="space-y-4">
      {/* AI Insights Panel */}
      <Card className="bg-gradient-to-br from-primary to-secondary text-white shadow-xl border-0">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">IA Financiera</h3>
            <p className="text-sm text-blue-100 mb-4">
              {hasAIPlan 
                ? 'Tu plan personalizado está listo'
                : 'Genera tu plan financiero personalizado'
              }
            </p>
            <Button 
              onClick={onGeneratePlan}
              disabled={isLoading}
              className="bg-white text-primary hover:bg-blue-50 font-medium"
              size="sm"
            >
              {isLoading ? 'Generando...' : hasAIPlan ? 'Ver Plan' : 'Crear Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="shadow-lg border border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Insights Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-emerald-800">Buen progreso</p>
                <p className="text-xs text-emerald-600">Tus ahorros aumentaron 12% este mes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Atención</p>
                <p className="text-xs text-amber-600">Gastos de entretenimiento +15%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximos Pagos */}
      <Card className="shadow-lg border border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Próximos Pagos</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Netflix</span>
              <span className="text-sm font-medium">$15</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Gym</span>
              <span className="text-sm font-medium">$50</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t pt-2">
              <span className="text-sm font-medium text-slate-900">Total</span>
              <span className="text-sm font-bold text-primary">$65</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
