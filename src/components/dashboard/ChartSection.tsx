
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeFilter } from './TimeFilter';

// Sample data - in real app this would come from props
const sampleData = [
  { name: 'Ene', ingresos: 4000, gastos: 2400 },
  { name: 'Feb', ingresos: 3000, gastos: 1398 },
  { name: 'Mar', ingresos: 2000, gastos: 3800 },
  { name: 'Abr', ingresos: 2780, gastos: 3908 },
  { name: 'May', ingresos: 1890, gastos: 4800 },
  { name: 'Jun', ingresos: 2390, gastos: 3800 },
];

export const ChartSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('month');

  return (
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
            <LineChart data={sampleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
  );
};
