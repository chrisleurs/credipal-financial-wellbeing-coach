
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TimeFilter } from './TimeFilter';
import { useExpenses } from '@/hooks/useExpenses';
import { useDebts } from '@/hooks/useDebts';
import { useFinancial } from '@/hooks/useFinancial';

export const ChartSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('month');
  const { expenses } = useExpenses();
  const { debts } = useDebts();
  const { data: financialData } = useFinancial();

  // Generate chart data based on real expenses and financial data
  const chartData = useMemo(() => {
    if (!expenses.length && !financialData.monthly_income) {
      // Fallback to sample data if no real data available
      return [
        { name: 'Ene', ingresos: 4000, gastos: 2400 },
        { name: 'Feb', ingresos: 3000, gastos: 1398 },
        { name: 'Mar', ingresos: 2000, gastos: 3800 },
        { name: 'Abr', ingresos: 2780, gastos: 3908 },
        { name: 'May', ingresos: 1890, gastos: 4800 },
        { name: 'Jun', ingresos: 2390, gastos: 3800 },
      ];
    }

    // Group expenses by month for the last 6 months
    const monthlyData: Record<string, { ingresos: number; gastos: number }> = {};
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize with income data
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = monthNames[date.getMonth()];
      monthlyData[monthKey] = {
        ingresos: financialData.monthly_income || 0,
        gastos: 0
      };
    }

    // Add expense data
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.expense_date);
      const monthKey = monthNames[expenseDate.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].gastos += Number(expense.amount);
      }
    });

    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      ...data
    }));
  }, [expenses, financialData]);

  // Generate category data for expenses
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Otros';
      categories[category] = (categories[category] || 0) + Number(expense.amount);
    });

    return Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Top 6 categories
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Income vs Expenses Trend */}
      <Card className="shadow-clean border border-gray-100 bg-white">
        <CardHeader className="border-b border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-bold text-slate-900">
              Tendencia Financiera
            </CardTitle>
            <TimeFilter 
              activeFilter={activeFilter} 
              onFilterChange={setActiveFilter}
            />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'ingresos' ? 'Ingresos' : 'Gastos']}
                />
                <Line 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="gastos" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-credipal-green rounded-full"></div>
              <span className="text-sm font-medium text-slate-600">Ingresos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-600">Gastos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses by Category */}
      {categoryData.length > 0 && (
        <Card className="shadow-clean border border-gray-100 bg-white">
          <CardHeader className="border-b border-gray-50">
            <CardTitle className="text-xl font-bold text-slate-900">
              Gastos por Categoría
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Gasto Total']}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
