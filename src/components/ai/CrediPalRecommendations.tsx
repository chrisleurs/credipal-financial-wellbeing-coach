
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { useConsolidatedProfile } from '@/hooks/useConsolidatedProfile';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const CrediPalRecommendations = () => {
  const { consolidatedProfile, isLoading, error } = useConsolidatedProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Recomendaciones CrediPal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner size="sm" text="Generando recomendaciones..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !consolidatedProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Recomendaciones CrediPal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No se pudieron cargar las recomendaciones en este momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Generate recommendations based on financial data
  const recommendations = generateRecommendations(consolidatedProfile);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Recomendaciones CrediPal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">¡Excelente trabajo!</h3>
            <p className="text-muted-foreground">
              Tus finanzas están en buen estado. Sigue así.
            </p>
          </div>
        ) : (
          recommendations.map((recommendation, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {recommendation.icon}
                  <h4 className="font-medium">{recommendation.title}</h4>
                </div>
                <Badge variant={recommendation.priority === 'high' ? 'destructive' : 
                              recommendation.priority === 'medium' ? 'default' : 'secondary'}>
                  {recommendation.priority === 'high' ? 'Alta' : 
                   recommendation.priority === 'medium' ? 'Media' : 'Baja'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {recommendation.description}
              </p>
              <Button size="sm" variant="outline">
                Ver detalles
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

function generateRecommendations(profile: any) {
  const recommendations = [];

  // High debt-to-income ratio
  if (profile.totalDebtBalance > 0 && profile.monthlyIncome > 0) {
    const debtToIncomeRatio = (profile.totalMonthlyDebtPayments / profile.monthlyIncome) * 100;
    if (debtToIncomeRatio > 40) {
      recommendations.push({
        title: 'Reducir carga de deudas',
        description: `Tu ratio deuda-ingreso es del ${debtToIncomeRatio.toFixed(1)}%. Se recomienda mantenerlo por debajo del 30%.`,
        priority: 'high',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    }
  }

  // Low savings capacity
  if (profile.monthlyBalance < profile.monthlyIncome * 0.2) {
    recommendations.push({
      title: 'Aumentar capacidad de ahorro',
      description: 'Intenta ahorrar al menos el 20% de tus ingresos mensuales.',
      priority: 'medium',
      icon: <Target className="h-4 w-4 text-blue-500" />
    });
  }

  // No emergency fund
  if (profile.currentSavings < profile.monthlyExpenses * 3) {
    recommendations.push({
      title: 'Crear fondo de emergencia',
      description: 'Se recomienda tener entre 3-6 meses de gastos como fondo de emergencia.',
      priority: 'high',
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />
    });
  }

  return recommendations;
}
