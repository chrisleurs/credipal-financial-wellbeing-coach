
import { useState, useCallback } from 'react'
import { useExpenses } from '@/domains/expenses/hooks/useExpenses'
import { useIncomes } from '@/domains/income/hooks/useIncomes'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useConsolidatedFinancialData } from './useConsolidatedFinancialData'
import { ExpenseCategoryType } from '@/domains/expenses/types/expense.types'

interface CoachMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  hasQuickActions?: boolean
  achievement?: string
}

export const useMotivationalCoach = () => {
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const { createExpense } = useExpenses()
  const { createIncome } = useIncomes()
  const { updateDebt } = useDebts()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { consolidatedData } = useConsolidatedFinancialData()

  const welcomeMessages = [
    "¡Hola! 👋 ¡Qué gusto verte! Vamos a dar un paso más en tu plan financiero.",
    "¡Buen día! 🌟 ¿Listos para hacer que tu dinero trabaje mejor hoy?",
    "¡Hola de nuevo! 🚀 Veo que estás comprometido con tu plan. ¡Me encanta!"
  ]

  const addMessage = useCallback((text: string, isUser: boolean, options?: { hasQuickActions?: boolean, achievement?: string }) => {
    const newMessage: CoachMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      hasQuickActions: options?.hasQuickActions,
      achievement: options?.achievement
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  const initializeCoach = useCallback(() => {
    if (hasInitialized) return
    
    const welcomeMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
    addMessage(welcomeMsg, false, { hasQuickActions: true })
    setHasInitialized(true)
  }, [hasInitialized, addMessage])

  const getQuickActions = useCallback(() => {
    const todayExpenses = consolidatedData?.expenses?.filter(
      exp => new Date(exp.date).toDateString() === new Date().toDateString()
    )?.length || 0

    const hasDebts = (consolidatedData?.debts?.length || 0) > 0

    if (todayExpenses === 0) {
      return [
        { label: "Registrar gasto 💸", action: "expense" },
        { label: "Ver mi progreso 📊", action: "progress" },
        { label: "Revisar próximos pagos ⏰", action: "payments" }
      ]
    }

    if (hasDebts) {
      return [
        { label: "Revisar próximos pagos ⏰", action: "payments" },
        { label: "Registrar pago de deuda 💳", action: "debt_payment" },
        { label: "Ver impacto en mi plan 📈", action: "plan_impact" }
      ]
    }

    return [
      { label: "Ver mi progreso 📊", action: "progress" },
      { label: "Añadir ingreso extra 💰", action: "income" },
      { label: "Recalcular mi plan 🎯", action: "recalculate" }
    ]
  }, [consolidatedData])

  const getCategoryFromDescription = (description: string): ExpenseCategoryType => {
    const desc = description.toLowerCase()
    if (desc.includes('comida') || desc.includes('food') || desc.includes('restaurante')) return 'Food & Dining'
    if (desc.includes('gas') || desc.includes('combustible') || desc.includes('uber') || desc.includes('transporte')) return 'Transportation'
    if (desc.includes('renta') || desc.includes('rent') || desc.includes('casa') || desc.includes('hogar')) return 'Housing & Utilities'
    if (desc.includes('gym') || desc.includes('netflix') || desc.includes('entretenimiento') || desc.includes('diversión')) return 'Entertainment'
    return 'Other'
  }

  const processMessage = useCallback(async (userMessage: string) => {
    setIsProcessing(true)
    addMessage(userMessage, true)

    try {
      const message = userMessage.toLowerCase()
      
      // Parse expense messages with motivational response
      const expenseMatch = message.match(/gast[eé]\s*\$?(\d+(?:\.\d{2})?)\s*(?:en|de)?\s*(.+)?/i)
      if (expenseMatch) {
        const amount = parseFloat(expenseMatch[1])
        const description = expenseMatch[2]?.trim() || 'Gasto registrado'
        const category = getCategoryFromDescription(description)
        
        await createExpense({
          amount,
          category,
          description,
          date: new Date().toISOString().split('T')[0]
        })
        
        const motivationalResponses = [
          `Perfecto 🚀, ya lo registré. Con este gasto, estás manteniendo un buen control de tu presupuesto.`,
          `¡Registrado! 📝 Me encanta que seas tan diligente con tus registros. Tu plan se actualiza automáticamente.`,
          `¡Excelente! 💪 Cada gasto registrado te acerca más a tu meta financiera.`
        ]
        
        const response = motivationalResponses[Math.floor(Math.random() * motivationalResponses.length)]
        addMessage(response, false, { hasQuickActions: true })
        
        queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
        
        toast({
          title: "Gasto registrado",
          description: `$${amount} en ${description}`,
        })
        
        setIsProcessing(false)
        return
      }

      // Parse income messages with celebration
      const incomeMatch = message.match(/recib[íi]\s*\$?(\d+(?:\.\d{2})?)\s*(?:de|por|extra)?/i)
      if (incomeMatch) {
        const amount = parseFloat(incomeMatch[1])
        
        await createIncome({
          source: 'Ingreso extra',
          amount,
          frequency: 'monthly',
          is_active: true
        })
        
        const celebrationResponses = [
          `¡Ingreso extra registrado! 💰 ¿Quieres asignarlo a tu meta de ahorro o plan de deudas?`,
          `¡Genial! 🌟 Este ingreso extra acelera tu plan. ¿Vemos el nuevo cálculo?`,
          `🎉 ¡Excelente! Tu capacidad de ahorro acaba de mejorar significativamente.`
        ]
        
        const response = celebrationResponses[Math.floor(Math.random() * celebrationResponses.length)]
        addMessage(response, false, { hasQuickActions: true })
        
        queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
        
        toast({
          title: "¡Ingreso registrado! 🎉",
          description: `$${amount} de ingreso extra`,
        })
        
        setIsProcessing(false)
        return
      }

      // Progress check
      if (message.includes('progreso') || message.includes('plan') || message.includes('cómo va')) {
        const progressResponses = [
          `📊 Tu progreso es sólido. Has registrado datos consistentemente y tu plan está funcionando.`,
          `¡Vas genial! 🚀 Tus números muestran disciplina y compromiso con tu meta financiera.`,
          `💪 Tu constancia está dando frutos. Los datos muestran una tendencia muy positiva.`
        ]
        
        const response = progressResponses[Math.floor(Math.random() * progressResponses.length)]
        addMessage(response, false, { hasQuickActions: true })
        
        setIsProcessing(false)
        return
      }

      // Default motivational response
      const defaultResponses = [
        `Estoy aquí para ayudarte 😊 Puedes decir "gasté $50 en comida" o usar los botones rápidos.`,
        `¡Perfecto! 🎯 Usa los botones de abajo para acciones rápidas o cuéntame qué movimiento hiciste.`,
        `¡Listo para ayudarte! 💪 Registra gastos, ingresos o pregúntame sobre tu progreso.`
      ]
      
      const response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
      addMessage(response, false, { hasQuickActions: true })
      
    } catch (error) {
      addMessage('Ups, algo salió mal 😅 ¿Puedes intentar de nuevo?', false)
      console.error('Error processing message:', error)
    }
    
    setIsProcessing(false)
  }, [createExpense, createIncome, updateDebt, addMessage, toast, queryClient, getCategoryFromDescription])

  const handleQuickAction = useCallback(async (action: string) => {
    switch (action) {
      case 'progress':
        addMessage('Ver mi progreso', true)
        await processMessage('progreso')
        break
      case 'recalculate':
        queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
        addMessage('🎯 ¡Listo! Tu plan se ha recalculado con todos tus datos actuales.', false, { hasQuickActions: true })
        toast({
          title: "Plan actualizado 🎯",
          description: "Todos tus datos han sido recalculados",
        })
        break
      default:
        addMessage(`Acción "${action}" en desarrollo 🚧 ¡Pronto estará disponible!`, false, { hasQuickActions: true })
    }
  }, [processMessage, queryClient, addMessage, toast])

  const clearMessages = useCallback(() => {
    setMessages([])
    setHasInitialized(false)
  }, [])

  return {
    messages,
    isProcessing,
    hasInitialized,
    processMessage,
    handleQuickAction,
    getQuickActions,
    initializeCoach,
    clearMessages
  }
}
