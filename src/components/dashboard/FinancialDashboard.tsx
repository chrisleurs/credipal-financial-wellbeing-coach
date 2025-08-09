
import React, { useState } from 'react';
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { useAuth } from '@/hooks/useAuth';
import { MetricCard } from './MetricCard';
import { ChartSection } from './ChartSection';
import { GoalCard } from './GoalCard';
import { LoanCard } from './LoanCard';
import { CrediAssistant } from './CrediAssistant';
import { DataSourceIndicator } from './DataSourceIndicator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Target, CreditCard, AlertCircle } from 'lucide-react';

export const FinancialDashboard = () => {
  const { user } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const { data: financialData, isLoading: dataLoading, error } = useConsolidatedFinancialData();
  const [timeFilter, setTimeFilter] = useState('month');
  const navigate = useNavigate();

  console.log('FinancialDashboard - User:', user?.email, 'Onboarding completed:', onboardingCompleted, 'Financial data:', financialData);

  if (onboardingLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando tu información financiera..." />
      </div>
    );
  }

  if (error) {
    console.error('Error loading financial data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los datos financieros. Por favor, intenta recargar la página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Si el onboarding no está completado, mostrar mensaje de bienvenida
  if (onboardingCompleted === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">¡Bienvenido a CrediPal!</h1>
          <p className="text-muted-foreground">
            Para comenzar a usar tu dashboard financiero, necesitas completar el proceso de configuración inicial.
          </p>
          <Button 
            onClick={() => navigate('/onboarding')}
            className="w-full"
          >
            Completar configuración inicial
          </Button>
        </div>
      </div>
    );
  }

  // Usar datos por defecto si no hay información
  const safeData = financialData || {
    monthlyIncome: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    totalDebts: 0,
    monthlyDebtPayments: 0,
    financialGoals: [],
    expenseCategories: {},
    debts: []
  };

  const monthlyBalance = safeData.monthlyIncome - safeData.monthlyExpenses - safeData.monthlyDebtPayments;
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Financiero</h1>
          <p className="text-muted-foreground">
            Resumen de tu situación financiera actual
          </p>
        </div>
        <DataSourceIndicator />
      </div>

      {/* Mostrar mensaje si no hay datos */}
      {safeData.monthlyIncome === 0 && safeData.monthlyExpenses === 0 && safeData.totalDebts === 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Parece que aún no tienes datos financieros registrados. 
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal"
              onClick={() => navigate('/onboarding')}
            >
              Completa tu perfil financiero
            </Button> para ver tu dashboard completo.
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ingresos Mensuales"
          value={`$${safeData.monthlyIncome.toLocaleString()}`}
          icon={DollarSign}
          trend={safeData.monthlyIncome > 0 ? "up" : "neutral"}
          trendValue="0%"
        />
        <MetricCard
          title="Balance Mensual"
          value={`$${monthlyBalance.toLocaleString()}`}
          icon={TrendingUp}
          trend={monthlyBalance > 0 ? "up" : monthlyBalance < 0 ? "down" : "neutral"}
          trendValue="0%"
        />
        <MetricCard
          title="Ahorros Actuales"
          value={`$${safeData.currentSavings.toLocaleString()}`}
          icon={Target}
          trend={safeData.currentSavings > 0 ? "up" : "neutral"}
          trendValue="0%"
        />
        <MetricCard
          title="Deudas Totales"
          value={`$${safeData.totalDebts.toLocaleString()}`}
          icon={CreditCard}
          trend={safeData.totalDebts > 0 ? "down" : "neutral"}
          trendValue="0%"
        />
      </div>

      {/* Sección de gráficos */}
      <ChartSection 
        data={safeData} 
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      {/* Metas y préstamos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalCard goals={safeData.financialGoals} />
        <LoanCard />
      </div>

      {/* Asistente de CrediPal */}
      <CrediAssistant />
    </div>
  );
};
