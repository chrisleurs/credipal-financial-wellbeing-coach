
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  
  // Use the expenses hook with React Query
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
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-financial-pulse w-16 h-16 bg-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tu información financiera...</p>
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
  const emergencyFund = (financialData?.monthlySavingsCapacity || 0) * 6; // 6 months
  const monthlyBalance = (financialData?.monthlyIncome || 0) - totalExpensesThisMonth;
  const activeGoals = financialData?.financialGoals || [];

  // Get recent transactions from expenses
  const recentTransactions = expenses.slice(0, 5).map(expense => ({
    id: expense.id,
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
    transaction_type: 'expense',
    transaction_date: expense.expense_date
  }));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-financial">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola! Bienvenido a tu Dashboard Financiero
          </h1>
          <p className="text-primary-glow">
            Gestiona tu bienestar financiero de manera inteligente
          </p>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-financial transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(monthlyBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyBalance > 0 ? '+' : ''}
                {((monthlyBalance / (financialData?.monthlyIncome || 1)) * 100).toFixed(1)}% de tus ingresos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-wellness transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Este Mes</CardTitle>
              <CreditCard className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalExpensesThisMonth)}
              </div>
              <p className="text-xs text-muted-foreground">
                {expensesLoading ? 'Cargando...' : `${expenses.length} transacciones`}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-financial transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meta de Ahorro</CardTitle>
              <PiggyBank className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {formatCurrency(totalSavings)}
              </div>
              <p className="text-xs text-muted-foreground">
                Objetivo mensual
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-financial transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fondo de Emergencia</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {formatCurrency(emergencyFund)}
              </div>
              <p className="text-xs text-muted-foreground">
                {(emergencyFund / (totalExpensesThisMonth || 1)).toFixed(1)} meses cubiertos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Tus Metas Financieras
              </CardTitle>
              <Button size="sm" className="bg-secondary hover:bg-secondary-light">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Meta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3">
                {activeGoals.map((goal, index) => (
                  <div key={index} className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-800">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aún no tienes metas financieras. ¡Crea tu primera meta!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
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
                  <p className="text-muted-foreground mt-2">Cargando transacciones...</p>
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{transaction.description || 'Sin descripción'}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.transaction_type === 'income' ? 'text-secondary' : 'text-destructive'}`}>
                          {transaction.transaction_type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.transaction_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No hay transacciones registradas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2 bg-primary hover:bg-primary-light">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Nueva Meta</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2 bg-secondary hover:bg-secondary-light">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-sm">Registrar Ingreso</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2 bg-muted hover:bg-accent text-foreground">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Agregar Gasto</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2 bg-warning hover:bg-warning/90 text-warning-foreground">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Planificar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
