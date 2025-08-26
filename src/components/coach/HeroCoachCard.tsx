
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimatedProgressRing } from '@/components/animations/AnimatedProgressRing'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { OptimizedFinancialData } from '@/hooks/useOptimizedFinancialData'
import { 
  Sparkles, 
  TrendingUp, 
  Target,
  Zap,
  Heart,
  RefreshCw
} from 'lucide-react'

interface HeroCoachCardProps {
  userData: OptimizedFinancialData
  onGeneratePlan?: (planData: any) => void
  onRefresh?: () => void
}

export const HeroCoachCard: React.FC<HeroCoachCardProps> = ({ 
  userData, 
  onGeneratePlan,
  onRefresh 
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState<string>('')
  const { toast } = useToast()

  // Calcular health score basado en situación financiera
  const calculateHealthScore = (): number => {
    let score = 0
    
    // Ingresos vs gastos (40 puntos)
    const incomeExpenseRatio = userData.monthlyExpenses / (userData.monthlyIncome || 1)
    if (incomeExpenseRatio < 0.5) score += 40
    else if (incomeExpenseRatio < 0.7) score += 30
    else if (incomeExpenseRatio < 0.9) score += 20
    else if (incomeExpenseRatio <= 1) score += 10
    
    // Capacidad de ahorro (30 puntos)
    const savingsRatio = userData.savingsCapacity / (userData.monthlyIncome || 1)
    if (savingsRatio > 0.3) score += 30
    else if (savingsRatio > 0.2) score += 25
    else if (savingsRatio > 0.1) score += 20
    else if (savingsRatio > 0) score += 10
    
    // Situación de deudas (20 puntos)
    if (userData.totalDebtBalance === 0) score += 20
    else if (userData.totalMonthlyDebtPayments < userData.monthlyIncome * 0.3) score += 15
    else if (userData.totalMonthlyDebtPayments < userData.monthlyIncome * 0.5) score += 10
    
    // Metas activas (10 puntos)
    if (userData.activeGoals.length > 0) score += 10
    
    return Math.min(score, 100)
  }

  // Generar mensaje dinámico del coach
  const generateCoachMessage = (): string => {
    if (generatedMessage) return generatedMessage
    
    const firstName = userData.user?.first_name || 'Usuario'
    const { savingsCapacity, totalDebtBalance, monthlyIncome } = userData
    
    // Situación: Excelente capacidad de ahorro
    if (savingsCapacity > monthlyIncome * 0.2) {
      return `¡Hola ${firstName}! Tienes una excelente capacidad de ahorro de ${formatCurrency(savingsCapacity)} mensual. ¡Vamos a maximizarla! 🚀`
    }
    
    // Situación: Deudas pero con margen
    if (totalDebtBalance > 0 && savingsCapacity > 0) {
      return `¡${firstName}, estás en buen camino! Con ${formatCurrency(savingsCapacity)} de margen mensual, eliminaremos esas deudas 💪`
    }
    
    // Situación: Sin deudas pero sin ahorro
    if (totalDebtBalance === 0 && savingsCapacity <= 0) {
      return `Hola ${firstName}, tienes finanzas sanas sin deudas. Vamos a crear tu primer fondo de ahorro ✨`
    }
    
    // Situación: Necesita organización urgente
    if (savingsCapacity < 0) {
      return `${firstName}, vamos a estabilizar tus finanzas paso a paso. Cada pequeño ajuste cuenta 🎯`
    }
    
    // Fallback motivacional
    return `¡Hola ${firstName}! Estás dando pasos importantes hacia tu libertad financiera 🌟`
  }

  // Determinar el mood del coach
  const getCoachMood = () => {
    const healthScore = calculateHealthScore()
    
    if (healthScore >= 80) return { emoji: '🎉', color: 'from-emerald-500 to-teal-600', level: 'celebration' }
    if (healthScore >= 60) return { emoji: '💪', color: 'from-blue-500 to-indigo-600', level: 'motivated' }
    if (healthScore >= 40) return { emoji: '📈', color: 'from-orange-500 to-amber-600', level: 'working' }
    return { emoji: '🎯', color: 'from-purple-500 to-pink-600', level: 'focused' }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-financial-plan', {
        body: {
          userId: userData.user?.id,
          financialData: {
            name: `${userData.user?.first_name} ${userData.user?.last_name}`,
            monthlyIncome: userData.monthlyIncome,
            monthlyExpenses: userData.monthlyExpenses,
            debts: userData.activeDebts.map(debt => ({
              name: debt.creditor,
              amount: debt.balance,
              monthlyPayment: debt.payment,
              interestRate: 18 // Default, you might want to get this from your data
            })),
            goals: userData.activeGoals,
            currentSavings: userData.currentSavings,
            savingsGoal: userData.totalGoalsTarget,
            expenseCategories: userData.expenseCategories,
            dataCompleteness: userData.hasRealData ? 80 : 30
          }
        }
      })

      if (error) throw error

      if (data?.motivationalMessage) {
        setGeneratedMessage(data.motivationalMessage)
      }

      onGeneratePlan?.(data)
      
      toast({
        title: '¡Plan generado! 🎉',
        description: 'Credi ha creado tu plan financiero personalizado',
      })

      // Refrescar datos después de generar plan
      onRefresh?.()
      
    } catch (error) {
      console.error('Error generando plan:', error)
      toast({
        title: 'Ups, algo salió mal',
        description: 'No pude generar tu plan, pero sigamos con lo básico',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const mood = getCoachMood()
  const healthScore = calculateHealthScore()
  const firstName = userData.user?.first_name || 'Usuario'

  return (
    <Card className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${mood.color} text-white`}>
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Coach Info & Message */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                  {mood.emoji}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">¡Hola {firstName}! 👋</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    <Heart className="w-3 h-3 mr-1" />
                    Tu Coach Credi
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    Score: {healthScore}/100
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-lg leading-relaxed">
                {generateCoachMessage()}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="bg-white text-gray-900 hover:bg-white/90 font-semibold"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generando Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Plan AI
                  </>
                )}
              </Button>
              
              <Button
                onClick={onRefresh}
                variant="ghost"
                className="text-white hover:bg-white/10 border border-white/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Health Score & Quick Stats */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <AnimatedProgressRing
                progress={healthScore}
                size={120}
                strokeWidth={8}
                color="#ffffff"
                backgroundColor="#ffffff30"
                showLabel={true}
                className="drop-shadow-lg"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  Salud Financiera
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-sm opacity-80">Balance</div>
                <div className="font-bold text-lg">
                  {formatCurrency(userData.monthlyBalance)}
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-sm opacity-80">Metas</div>
                <div className="font-bold text-lg">
                  {userData.activeGoals.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
