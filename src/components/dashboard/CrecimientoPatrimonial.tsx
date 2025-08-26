
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, DollarSign, Target } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

interface CrecimientoPatrimonialData {
  año1: number
  año3: number
  año5: number
  inversionMensual: number
  rendimientoEsperado: number
}

interface CrecimientoPatrimonialProps {
  data: CrecimientoPatrimonialData
}

export const CrecimientoPatrimonial = ({ data }: CrecimientoPatrimonialProps) => {
  const chartData = [
    {
      periodo: '1 Año',
      valor: data.año1,
      inversion: data.inversionMensual * 12,
      rendimiento: data.año1 - (data.inversionMensual * 12)
    },
    {
      periodo: '3 Años',
      valor: data.año3,
      inversion: data.inversionMensual * 36,
      rendimiento: data.año3 - (data.inversionMensual * 36)
    },
    {
      periodo: '5 Años',
      valor: data.año5,
      inversion: data.inversionMensual * 60,
      rendimiento: data.año5 - (data.inversionMensual * 60)
    }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Total: {formatCurrency(data.valor)}
          </p>
          <p className="text-gray-600">
            Inversión: {formatCurrency(data.inversion)}
          </p>
          <p className="text-green-600">
            Rendimiento: {formatCurrency(data.rendimiento)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Crecimiento Patrimonial
        </CardTitle>
        <CardDescription>
          Proyección de tu patrimonio a través del tiempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Métricas destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(data.inversionMensual)}
            </div>
            <div className="text-sm text-blue-700">Inversión mensual</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {data.rendimientoEsperado}%
            </div>
            <div className="text-sm text-green-700">Rendimiento anual</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(data.año5)}
            </div>
            <div className="text-sm text-purple-700">Meta 5 años</div>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="periodo" 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="inversion" 
                fill="#3b82f6" 
                radius={[0, 0, 4, 4]}
                name="Inversión"
              />
              <Bar 
                dataKey="rendimiento" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Rendimiento"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight bottom */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-700">
            <strong>💡 Insight:</strong> Con una inversión constante de {formatCurrency(data.inversionMensual)} 
            mensuales y un rendimiento del {data.rendimientoEsperado}% anual, tu patrimonio crecerá a{' '}
            {formatCurrency(data.año5)} en 5 años, generando {formatCurrency(data.año5 - (data.inversionMensual * 60))}{' '}
            en rendimientos.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
