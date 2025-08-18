
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useExpenses } from '@/hooks/useExpenses';
import { useConsolidatedFinancialData } from '@/hooks/useConsolidatedFinancialData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ChartSection = () => {
  const { expenses } = useExpenses();
  const { data: financialData } = useConsolidatedFinancialData();

  // Process expense data for charts
  const expensesByCategory = React.useMemo(() => {
    if (!financialData?.expenseCategories) return [];
    
    return Object.entries(financialData.expenseCategories).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [financialData?.expenseCategories]);

  // Get monthly trend data from actual expenses
  const monthlyTrend = React.useMemo(() => {
    const monthlyData = expenses.reduce((acc: Record<string, number>, expense) => {
      const month = new Date(expense.date).toLocaleDateString('es-ES', { 
        month: 'short', 
        year: 'numeric' 
      });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .slice(-6); // Last 6 months
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expense Categories Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Monto']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No hay datos de gastos disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia Mensual de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Gastos']} />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Gastos Mensuales" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Agrega gastos para ver la tendencia mensual
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
