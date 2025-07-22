
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Insight {
  id: string;
  type: 'alert' | 'celebration' | 'suggestion' | 'trend';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export function ProactiveInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      generateInsights();
    }
  }, [user]);

  const generateInsights = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: 'Genera insights proactivos sobre mis finanzas',
          userId: user.id
        }
      });

      if (error) throw error;

      // Simular insights mientras el AI no esté completamente integrado
      const mockInsights: Insight[] = [
        {
          id: '1',
          type: 'alert',
          title: 'Gastos en Comida Elevados',
          message: 'Has gastado 45% más en comida esta semana comparado con el mes pasado.',
          priority: 'medium',
          actionable: true
        },
        {
          id: '2',
          type: 'celebration',
          title: '¡Meta de Ahorro Alcanzada!',
          message: 'Excelente trabajo, has alcanzado el 80% de tu meta mensual de ahorro.',
          priority: 'high',
          actionable: false
        },
        {
          id: '3',
          type: 'suggestion',
          title: 'Optimización de Pagos',
          message: 'Considera consolidar tus pagos de deuda para ahorrar en intereses.',
          priority: 'medium',
          actionable: true
        }
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'celebration':
        return <Target className="h-4 w-4 text-success" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-primary" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-info" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights Financieros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights Financieros
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateInsights}>
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No hay insights disponibles en este momento.
          </p>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.message}
                    </p>
                    {insight.actionable && (
                      <Button variant="link" className="h-auto p-0 mt-1 text-xs">
                        Ver recomendaciones →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
