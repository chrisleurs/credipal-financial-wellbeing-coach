
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Zap, Target, TrendingUp } from 'lucide-react'

export default function Coach() {
  return (
    <AppLayout>
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Coach Financiero</h1>
            <p className="text-gray-600">Tu asistente personal para alcanzar tus metas</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Consejos Rápidos</h3>
                <p className="text-sm text-gray-600">Obtén recomendaciones personalizadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Revisar Metas</h3>
                <p className="text-sm text-gray-600">Analiza tu progreso actual</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Plan de Acción</h3>
                <p className="text-sm text-gray-600">Estrategias para mejorar</p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Chat con tu Coach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Coach:</strong> ¡Hola! He revisado tu situación financiera. 
                    Veo que tienes una deuda con Kueski de $500. Te ayudo a crear un plan para pagarla rápidamente.
                  </p>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Recomendación:</strong> Considera hacer pagos adicionales de $50 
                    para reducir el tiempo de pago y los intereses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="text-center text-sm text-gray-600">
            💡 Próximamente: Chat interactivo con IA para consejos personalizados
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
