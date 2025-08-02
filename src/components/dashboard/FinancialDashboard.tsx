
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  PiggyBank, 
  AlertCircle,
  Plus,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useFinancialStore } from '@/store/financialStore';
import { useExpenses } from '@/hooks/useExpenses';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/helpers';
import { MetricCard } from './MetricCard';
import { ChartSection } from './ChartSection';
import { AIPanel } from './AIPanel';

export const FinancialDashboard = () => {
  const { 
    financialData, 
    aiPlan,
    actionTasks,
    isLoading, 
    setCurrentStep,
    generateAIPlan,
    loadFromSupabase
  } = useFinancialStore();
  
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        loadFromSupabase();
      }
    };
    
    initializeUser();
  }, [loadFromSupabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando tu información financiera...</p>
        </div>
      </div>
    );
  }

  // Calculate totals from actual expenses data
  const totalExpensesThisMonth = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.expense_date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const totalSavings = financialData?.currentSavings || 0;
  const emergencyFund = (financialData?.monthlySavingsCapacity || 0) * 6;
  const monthlyBalance = (financialData?.monthlyIncome || 0) - totalExpensesThisMonth;
  const activeGoals = financialData?.financialGoals || [];

  const recentTransactions = expenses.slice(0, 5).map(expense => ({
    id: expense.id,
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
    transaction_type: 'expense',
    transaction_date: expense.expense_date
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola! Bienvenido a tu Dashboard Financiero
          </h1>
          <p className="text-blue-100">
            Gestiona tu bienestar financiero de manera inteligente
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 -mt-4">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Balance Mensual"
            value={formatCurrency(monthlyBalance)}
            icon={DollarSign}
            variant={monthlyBalance > 0 ? 'positive' : 'warning'}
            trend={{ 
              direction: monthlyBalance > 0 ? 'up' : 'down', 
              percentage: `${((monthlyBalance / (financialData?.monthlyIncome || 1)) * 100).toFixed(1)}%`
            }}
          />

          <MetricCard
            title="Gastos Este Mes"
            value={formatCurrency(totalExpensesThisMonth)}
            icon={CreditCard}
            variant="warning"
          />

          <MetricCard
            title="Meta de Ahorro"
            value={formatCurrency(totalSavings)}
            icon={PiggyBank}
            variant="positive"
          />

          <MetricCard
            title="Fondo de Emergencia"
            value={formatCurrency(emergencyFund)}
            icon={AlertCircle}
            variant="neutral"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <ChartSection />
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-1">
            <AIPanel 
              hasAIPlan={!!aiPlan}
              onGeneratePlan={generateAIPlan}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Goals and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Goals Progress */}
          <Card className="shadow-xl border border-gray-100 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Tus Metas Financieras
                </CardTitle>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Meta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeGoals.length > 0 ? (
                <div className="space-y-3">
                  {activeGoals.map((goal, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="font-medium text-primary">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">
                    Aún no tienes metas financieras. ¡Crea tu primera meta!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-xl border border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Transacciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expensesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-slate-500 mt-2">Cargando transacciones...</p>
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{transaction.description || 'Sin descripción'}</p>
                        <p className="text-sm text-slate-500">{transaction.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-amber-500">
                          -{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-slate-500">{transaction.transaction_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">
                    No hay transacciones registradas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
