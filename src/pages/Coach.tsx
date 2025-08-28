
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress as ProgressBar } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useConsolidatedData } from '@/hooks/useConsolidatedData'
import { 
  MessageCircle, 
  Target, 
  TrendingUp, 
  DollarSign,
  PiggyBank,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Heart,
  Zap,
  Shield,
  Rocket,
  Star
} from 'lucide-react'

export default function Coach() {
  const { data: consolidatedData, isLoading } = useConsolidatedData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text="CrediPal está preparando tu plan financiero personalizado..." />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!consolidatedData) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">¡Hola! Soy CrediPal 👋</h2>
              <p className="text-gray-600">
                Necesito conocer mejor tu situación financiera para crear tu plan personalizado.
                Completa tu información en el onboarding y regresa aquí.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const monthlyBalance = consolidatedData.monthlyIncome - consolidatedData.monthlyExpenses - consolidatedData.totalMonthlyDebtPayments
  const emergencyFundTarget = consolidatedData.monthlyExpenses * 6
  const debtFreeMonths = consolidatedData.totalDebtBalance > 0 && monthlyBalance > 0 ? 
    Math.ceil(consolidatedData.totalDebtBalance / Math.max(consolidatedData.totalMonthlyDebtPayments, monthlyBalance * 0.7)) : 0

  const getPersonalizedGreeting = () => {
    if (consolidatedData.totalDebtBalance > consolidatedData.monthlyIncome * 2) {
      return "¡Hola! Sé que las finanzas pueden sentirse abrumadoras, pero estoy aquí para ayudarte 💪"
    } else if (monthlyBalance > 0) {
      return "¡Qué bueno verte! Me da mucho gusto ver que tienes control sobre tus finanzas 🌟"
    } else {
      return "¡Hola! Veo que estás listo para tomar el control de tu dinero. ¡Vamos a hacerlo juntos! 🚀"
    }
  }

  const getMotivationalMessage = () => {
    if (consolidatedData.totalDebtBalance === 0 && monthlyBalance > 0) {
      return "¡Increíble! No tienes deudas y tienes dinero disponible cada mes. Estás en una posición fantástica para hacer crecer tu patrimonio."
    } else if (consolidatedData.totalDebtBalance > 0 && monthlyBalance > 0) {
      return "Tienes un gran potencial. Con disciplina y el plan correcto, puedes liberarte de las deudas y construir un futuro financiero sólido."
    } else {
      return "Entiendo que puede ser difícil, pero cada gran cambio comienza con un primer paso. Vamos a encontrar oportunidades juntos."
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4 pb-20 max-w-4xl">
        <div className="space-y-6">
          {/* Header Personalizado de CrediPal */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-3">
                Tu Plan Financiero Personalizado
              </h1>
              <p className="text-lg text-center text-gray-700 mb-4">
                {getPersonalizedGreeting()}
              </p>
              <div className="text-center">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <Star className="h-4 w-4 mr-1" />
                  Creado especialmente para ti por CrediPal
                </Badge>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-10">
              <Zap className="h-32 w-32 text-primary" />
            </div>
          </div>

          {/* Mensaje Motivacional Personalizado */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Un mensaje personal de CrediPal</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {getMotivationalMessage()}
                  </p>
                  <p className="text-primary font-medium">
                    He analizado tu situación y tengo un plan que te va a encantar. ¡Vamos paso a paso! 🎯
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Snapshot Financiero Actual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Tu Situación Actual (Foto del Momento)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-sm text-green-700 mb-1">💰 Ingresos</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(consolidatedData.monthlyIncome)}
                  </p>
                  <p className="text-xs text-green-600">por mes</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-sm text-orange-700 mb-1">🏠 Gastos</p>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(consolidatedData.monthlyExpenses)}
                  </p>
                  <p className="text-xs text-orange-600">por mes</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm text-red-700 mb-1">💳 Deudas</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(consolidatedData.totalDebtBalance)}
                  </p>
                  <p className="text-xs text-red-600">total</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700 mb-1">💎 Disponible</p>
                  <p className={`text-xl font-bold ${monthlyBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(monthlyBalance)}
                  </p>
                  <p className="text-xs text-blue-600">por mes</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Lo que esto significa
                </h4>
                <p className="text-gray-700 text-sm">
                  {monthlyBalance > 0 
                    ? `¡Excelente! Tienes ${formatCurrency(monthlyBalance)} disponibles cada mes. Esto significa que puedes invertir en tu futuro financiero.`
                    : monthlyBalance === 0 
                      ? "Estás equilibrado, pero necesitamos crear un colchón financiero. Te voy a mostrar cómo."
                      : `Necesitamos ajustar algunas cosas para que tengas más dinero disponible. Te voy a ayudar a encontrar oportunidades.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan de Acción de CrediPal */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Tu Plan de Acción CrediPal
              </CardTitle>
              <p className="text-gray-600">Un camino claro hacia tu libertad financiera</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fase 1: Control de Deudas */}
              {consolidatedData.totalDebtBalance > 0 && (
                <div className="relative">
                  <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-xl">
                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-red-800 text-lg">Liberarte de las Deudas</h3>
                        <Badge variant="destructive">Prioridad Alta</Badge>
                      </div>
                      <p className="text-red-700 mb-4">
                        Tienes {formatCurrency(consolidatedData.totalDebtBalance)} en deudas. Mi estrategia te ayudará a eliminarlas de manera inteligente.
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        {consolidatedData.debts.map((debt, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-red-100">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800">{debt.creditor}</span>
                              <span className="text-red-600 font-bold">{formatCurrency(debt.balance)}</span>
                            </div>
                            <p className="text-sm text-gray-600">Pago mensual: {formatCurrency(debt.payment)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Mi Estrategia para Ti</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          {debtFreeMonths > 0 
                            ? `Con tus pagos actuales y optimizaciones que te voy a enseñar, podrías estar libre de deudas en aproximadamente ${debtFreeMonths} meses. ¡Imagínate esa libertad!`
                            : "Vamos a revisar juntos tus gastos para encontrar dinero extra que puedas destinar a eliminar estas deudas más rápido."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fase 2: Fondo de Emergencia */}
              <div className="relative">
                <div className="flex items-start gap-4 p-5 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {consolidatedData.totalDebtBalance > 0 ? '2' : '1'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-blue-800 text-lg">Tu Escudo Protector (Fondo de Emergencia)</h3>
                      <Badge variant="secondary">
                        <Shield className="h-4 w-4 mr-1" />
                        Protección
                      </Badge>
                    </div>
                    <p className="text-blue-700 mb-4">
                      Necesitas {formatCurrency(emergencyFundTarget)} (6 meses de gastos) para estar completamente protegido ante cualquier imprevisto.
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-blue-700">Progreso actual</span>
                          <span className="font-medium">{formatCurrency(consolidatedData.currentSavings)} / {formatCurrency(emergencyFundTarget)}</span>
                        </div>
                        <ProgressBar 
                          value={Math.min((consolidatedData.currentSavings / emergencyFundTarget) * 100, 100)} 
                          className="h-3"
                        />
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm">
                          <strong>💡 Mi Recomendación:</strong> {monthlyBalance > 0 
                            ? `Comienza ahorrando ${formatCurrency(monthlyBalance * 0.3)} mensualmente. En ${Math.ceil(emergencyFundTarget / (monthlyBalance * 0.3))} meses tendrás tu escudo completo.`
                            : "Una vez que optimices tus gastos, destina el 30% de lo que liberes para construir este fondo."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fase 3: Crecimiento */}
              <div className="relative">
                <div className="flex items-start gap-4 p-5 bg-green-50 border border-green-200 rounded-xl">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {consolidatedData.totalDebtBalance > 0 ? '3' : '2'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-green-800 text-lg">Hacer Crecer tu Dinero</h3>
                      <Badge variant="outline">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Crecimiento
                      </Badge>
                    </div>
                    <p className="text-green-700 mb-4">
                      Una vez que tengas control sobre tus deudas y tu fondo de emergencia, es momento de hacer que tu dinero trabaje para ti.
                    </p>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-purple-800 text-sm">
                        <strong>🚀 Tu Potencial:</strong> {monthlyBalance > 0 
                          ? `Una vez libre de deudas, podrías tener hasta ${formatCurrency(monthlyBalance + consolidatedData.totalMonthlyDebtPayments)} mensuales para invertir y hacer crecer tu patrimonio.`
                          : "Con las optimizaciones correctas, podrás liberar dinero para inversiones que te generen ingresos pasivos."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consejos Personalizados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Mis Consejos Personalizados para Ti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyBalance < 0 && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800">🚨 Atención Inmediata Requerida</h4>
                        <p className="text-red-700 text-sm mt-1">
                          Tus gastos superan tus ingresos por {formatCurrency(Math.abs(monthlyBalance))}. 
                          Esto es muy importante de resolver. Te voy a ayudar a identificar dónde puedes ajustar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-primary">💬 Mi Mensaje Personal</h4>
                      <p className="text-gray-700 text-sm mt-1">
                        {consolidatedData.totalDebtBalance > 0 
                          ? `Veo que tienes ${formatCurrency(consolidatedData.totalDebtBalance)} en deudas, pero no te preocupes. He ayudado a miles de personas en situaciones similares. Con el plan correcto y un poco de disciplina, vas a salir adelante. ¡Confía en el proceso!`
                          : `¡Me encanta tu situación! Sin deudas y con ingresos estables, estás en una posición privilegiada. Vamos a aprovechar esta oportunidad para construir algo increíble.`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">🎯 Tu Próximo Logro</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        {consolidatedData.totalDebtBalance > 0 
                          ? `Elimina tu primera deuda completamente. Te recomiendo empezar con la más pequeña para ganar confianza y momentum.`
                          : `Construye tu primer ${formatCurrency(10000)} en tu fondo de emergencia. ¡Cada peso cuenta y te acerca más a la tranquilidad!`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline y Siguientes Pasos */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Calendar className="h-5 w-5" />
                Tu Cronograma de Éxito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Esta Semana</h4>
                    <p className="text-gray-600 text-sm">
                      Revisa todos tus gastos y identifica al menos {formatCurrency(500)} que puedas optimizar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">1M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Primer Mes</h4>
                    <p className="text-gray-600 text-sm">
                      {consolidatedData.totalDebtBalance > 0 
                        ? "Implementa la estrategia de pago de deudas y haz tu primer pago extra"
                        : "Establece tu rutina de ahorro automático"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">3M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Primeros 3 Meses</h4>
                    <p className="text-gray-600 text-sm">
                      Verás resultados tangibles. Tu confianza financiera habrá mejorado notablemente
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action Final */}
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-3">¡Estoy Aquí Para Acompañarte!</h3>
              <p className="text-lg text-primary-100 mb-6 leading-relaxed">
                Tu plan está listo, pero recuerda: no estás solo en este camino. 
                Cada pequeño paso cuenta, cada peso ahorrado te acerca a tu libertad financiera.
              </p>
              <p className="text-primary-100 font-medium">
                ¡Vamos a hacer realidad tus sueños financieros juntos! 💪✨
              </p>
            </div>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4">
              <CheckCircle className="h-5 w-5 mr-2" />
              Ver Mi Progreso Detallado
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
