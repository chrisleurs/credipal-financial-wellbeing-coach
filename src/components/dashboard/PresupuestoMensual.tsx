
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PresupuestoData {
  necesidades: { porcentaje: number; cantidad: number };
  estiloVida: { porcentaje: number; cantidad: number };
  ahorro: { porcentaje: number; cantidad: number };
}

interface PresupuestoMensualProps {
  data: PresupuestoData;
}

const PresupuestoMensual: React.FC<PresupuestoMensualProps> = ({ data }) => {
  const chartData = [
    { 
      name: 'Necesidades', 
      value: data.necesidades.porcentaje, 
      amount: data.necesidades.cantidad,
      description: 'Gastos esenciales como vivienda, alimentación y servicios'
    },
    { 
      name: 'Estilo de Vida', 
      value: data.estiloVida.porcentaje, 
      amount: data.estiloVida.cantidad,
      description: 'Entretenimiento, comidas fuera y gastos personales'
    },
    { 
      name: 'Ahorro/Inversión', 
      value: data.ahorro.porcentaje, 
      amount: data.ahorro.cantidad,
      description: 'Fondos de emergencia, inversiones y metas financieras'
    }
  ];

  // Using semantic color tokens from the design system
  const COLORS = [
    'hsl(var(--destructive))', // Red for necessities (high priority)
    'hsl(var(--warning))', // Orange/amber for lifestyle 
    'hsl(var(--success))' // Green for savings/investment
  ];

  const ICONS = ['🏠', '🎯', '💰'];

  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">${data.payload.amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  // Center label component for the donut chart
  const CenterLabel = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Total mensual</div>
      </div>
    </div>
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💡</span>
          Presupuesto Mensual Sugerido
        </CardTitle>
        <CardDescription>
          Distribución recomendada de tus ingresos mensuales basada en tu situación financiera
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de dona */}
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <CenterLabel />
          </div>
          
          {/* Lista detallada */}
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground mb-4">
              Desglose por categoría
            </div>
            {chartData.map((item, index) => (
              <div 
                key={item.name} 
                className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{ICONS[index]}</span>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                    </div>
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">${item.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{item.value}%</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  {item.description}
                </p>
              </div>
            ))}
            
            {/* Insights adicionales */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span>💡</span>
                Recomendación
              </h4>
              <p className="text-sm text-muted-foreground">
                Esta distribución sigue la regla 50/30/20 adaptada a tu situación. 
                Prioriza siempre las necesidades básicas y mantén un mínimo del {data.ahorro.porcentaje}% para ahorro.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresupuestoMensual;
