import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/helpers'

interface PersonalizedPlanDocumentProps {
  financialData: any
}

export const PersonalizedPlanDocument = ({ financialData }: PersonalizedPlanDocumentProps) => {
  const monthlyBalance = financialData.monthlyIncome - financialData.monthlyExpenses
  const debtFreeDate = financialData.totalDebtBalance > 0 && monthlyBalance > 0 
    ? new Date(Date.now() + (financialData.totalDebtBalance / (monthlyBalance * 0.7)) * 30 * 24 * 60 * 60 * 1000)
    : null

  const emergencyFundTarget = financialData.monthlyExpenses * 6
  const emergencyFundMonths = monthlyBalance > 0 ? Math.ceil(emergencyFundTarget / (monthlyBalance * 0.3)) : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header del Plan */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader className="text-center pb-4">
          <div className="text-4xl mb-2">🎯</div>
          <CardTitle className="text-2xl text-emerald-800">
            Tu Plan Financiero Personalizado
          </CardTitle>
          <p className="text-emerald-600 text-lg">
            Diseñado especialmente para ti por CrediPal
          </p>
          <Badge variant="secondary" className="mx-auto mt-2">
            Plan Activo • {new Date().toLocaleDateString('es-MX', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </CardHeader>
      </Card>

      {/* Introducción Personal */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ¡Hola! 👋 Aquí está tu plan financiero
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              He revisado toda tu información financiera y tengo excelentes noticias para ti. 
              Con tus ingresos mensuales de <strong>{formatCurrency(financialData.monthlyIncome)}</strong> y 
              gastos de <strong>{formatCurrency(financialData.monthlyExpenses)}</strong>, tienes un 
              balance mensual de <strong className={monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(monthlyBalance)}
              </strong>.
            </p>
            
            {monthlyBalance > 0 ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
                <p className="text-green-800">
                  <strong>🎉 ¡Esto es fantástico!</strong> Tienes dinero disponible cada mes para mejorar 
                  tu situación financiera. Vamos a aprovecharlo al máximo.
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 my-4">
                <p className="text-orange-800">
                  <strong>⚠️ Necesitamos ajustar algunas cosas.</strong> Tus gastos están muy cerca de tus ingresos. 
                  Te voy a ayudar a encontrar oportunidades de ahorro.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Gastos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💸</span>
            Análisis de tus Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Actualmente gastas <strong>{formatCurrency(financialData.monthlyExpenses)}</strong> al mes. 
            Aquí te muestro cómo se distribuyen tus gastos:
          </p>
          
          <div className="space-y-3">
            {Object.entries(financialData.expenseCategories || {}).map(([category, amount]: [string, any]) => {
              const percentage = ((amount as number) / financialData.monthlyExpenses) * 100
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{category}</span>
                    <span className="font-medium">
                      {formatCurrency(amount as number)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>

          {monthlyBalance > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>💡 Mi recomendación:</strong> Tus gastos están bajo control. Mantén este ritmo 
                y podrás destinar {formatCurrency(monthlyBalance)} mensuales para tus metas financieras.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan de Deudas */}
      {financialData.totalDebtBalance > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💳</span>
              Tu Plan para Eliminar Deudas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Tienes <strong>{formatCurrency(financialData.totalDebtBalance)}</strong> en deudas totales. 
              ¡Pero no te preocupes! Tengo un plan sólido para ti.
            </p>

            {debtFreeDate && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-emerald-800 mb-2">🗓️ Fecha Proyectada: Libre de Deudas</h4>
                <p className="text-emerald-700">
                  Si destinas el 70% de tu dinero disponible ({formatCurrency(monthlyBalance * 0.7)}) 
                  mensualmente a pagar deudas, podrías estar <strong>completamente libre de deudas 
                  para {debtFreeDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</strong> 🎉
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Tus deudas actuales:</h4>
              {financialData.activeDebts.map((debt: any, index: number) => (
                <div key={debt.id || index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{debt.creditor}</p>
                      <p className="text-sm text-gray-600">Pago mensual: {formatCurrency(debt.payment)}</p>
                    </div>
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(debt.balance)}
                    </span>
                  </div>
                  
                  {monthlyBalance > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>⏱️ Con pagos extra, podrías liquidar esta deuda en ~
                        {Math.ceil(debt.balance / (debt.payment + (monthlyBalance * 0.7 / financialData.activeDebts.length)))} meses
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>🔥 Estrategia CrediPal:</strong> Enfócate primero en las deudas de mayor interés. 
                Cada peso extra que pagues ahora te ahorrará mucho dinero en intereses.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan de Ahorro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🛡️</span>
            Tu Fondo de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Todo plan financiero sólido necesita un fondo de emergencia. Te recomiendo ahorrar 
            <strong> {formatCurrency(emergencyFundTarget)}</strong> (6 meses de gastos).
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso actual</span>
                <span>{formatCurrency(financialData.currentSavings)} / {formatCurrency(emergencyFundTarget)}</span>
              </div>
              <Progress 
                value={(financialData.currentSavings / emergencyFundTarget) * 100} 
                className="h-3"
              />
            </div>

            {monthlyBalance > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📈 Plan de Ahorro</h4>
                <p className="text-blue-700 text-sm">
                  Destinando el 30% de tu dinero disponible ({formatCurrency(monthlyBalance * 0.3)}) 
                  mensualmente, completarías tu fondo de emergencia en aproximadamente 
                  <strong> {emergencyFundMonths} meses</strong>.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metas y Objetivos */}
      {financialData.activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎯</span>
              Tus Metas Financieras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Me encanta que tengas metas claras. Esto demuestra tu compromiso con tu futuro financiero:
            </p>
            
            <div className="space-y-3">
              {financialData.activeGoals.map((goal: any, index: number) => (
                <div key={goal.id || index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{goal.title}</h4>
                    <Badge variant="outline">
                      {formatCurrency(goal.target_amount)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress 
                      value={(goal.current_amount / goal.target_amount) * 100} 
                      className="h-2"
                    />
                    <p className="text-sm text-gray-600">
                      Progreso: {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos Pasos */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <span>🚀</span>
            Tus Próximos Pasos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h4 className="font-medium text-gray-800">Esta Semana</h4>
                <p className="text-gray-600 text-sm">
                  {financialData.totalDebtBalance > 0 
                    ? "Revisa tus deudas y haz un pago extra a la de mayor interés"
                    : "Transfiere dinero a tu fondo de emergencia"
                  }
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h4 className="font-medium text-gray-800">Este Mes</h4>
                <p className="text-gray-600 text-sm">
                  Mantén tus gastos bajo control y registra todos tus movimientos en CrediPal
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h4 className="font-medium text-gray-800">Los Próximos 3 Meses</h4>
                <p className="text-gray-600 text-sm">
                  {monthlyBalance > 0 
                    ? `Con ${formatCurrency(monthlyBalance)} mensuales disponibles, verás un progreso significativo en tus metas`
                    : "Identifica oportunidades para reducir gastos y aumentar tus ingresos"
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje Final Motivacional */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-4">💪</div>
          <h3 className="text-xl font-bold mb-2">¡Tienes Todo lo Necesario para Triunfar!</h3>
          <p className="text-emerald-100 leading-relaxed">
            Tu plan está diseñado específicamente para tu situación. Recuerda: cada peso cuenta, 
            cada decisión importa, y cada día te acerca más a tu libertad financiera. 
            ¡CrediPal está aquí para acompañarte en cada paso! 🌟
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
