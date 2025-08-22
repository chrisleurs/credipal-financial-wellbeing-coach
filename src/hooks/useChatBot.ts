
import { useState, useCallback } from 'react'
import { useExpenses } from '@/domains/expenses/hooks/useExpenses'
import { useIncomes } from '@/domains/income/hooks/useIncomes'
import { useDebts } from '@/domains/debts/hooks/useDebts'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { ExpenseCategoryType } from '@/types/domains/expenses/expense'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Soy tu asistente financiero. Puedo ayudarte a registrar gastos, ingresos o pagos de deudas. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  const { createExpense } = useExpenses()
  const { createIncome } = useIncomes()
  const { updateDebt } = useDebts()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const addMessage = useCallback((text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  const processMessage = useCallback(async (userMessage: string) => {
    setIsProcessing(true)
    addMessage(userMessage, true)

    try {
      const message = userMessage.toLowerCase()
      
      // Parse expense messages
      const expenseMatch = message.match(/gast[eé]\s*\$?(\d+(?:\.\d{2})?)\s*(?:en|de)?\s*(.+)?/i)
      if (expenseMatch) {
        const amount = parseFloat(expenseMatch[1])
        const description = expenseMatch[2]?.trim() || 'Gasto registrado'
        const category = getCategoryFromDescription(description)
        
        createExpense({
          amount,
          category,
          description,
          date: new Date().toISOString().split('T')[0]
        })
        
        addMessage(`¡Registrado! Gasto de $${amount} en ${description}. Tu plan se actualizará automáticamente 💰`, false)
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
        
        toast({
          title: "Gasto registrado",
          description: `$${amount} en ${description}`,
        })
        
        setIsProcessing(false)
        return
      }

      // Parse income messages
      const incomeMatch = message.match(/recib[íi]\s*\$?(\d+(?:\.\d{2})?)\s*(?:de|por|extra)?/i)
      if (incomeMatch) {
        const amount = parseFloat(incomeMatch[1])
        
        createIncome({
          source: 'Ingreso extra',
          amount,
          frequency: 'monthly',
          is_active: true
        })
        
        addMessage(`¡Excelente! Ingreso extra de $${amount} registrado. ¿Quieres asignarlo a tu meta de ahorro? 🎉`, false)
        
        queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
        
        toast({
          title: "Ingreso registrado",
          description: `$${amount} de ingreso extra`,
        })
        
        setIsProcessing(false)
        return
      }

      // Parse debt payment messages
      const debtMatch = message.match(/pagu[eé]\s*\$?(\d+(?:\.\d{2})?)\s*(?:de|a)?\s*(.+)?/i)
      if (debtMatch) {
        const amount = parseFloat(debtMatch[1])
        const creditor = debtMatch[2]?.trim() || 'deuda'
        
        addMessage(`¡Excelente pago! Registré $${amount} de pago de ${creditor}. ¡Vas por buen camino! 💪`, false)
        
        queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
        
        toast({
          title: "Pago registrado",
          description: `$${amount} de pago de ${creditor}`,
        })
        
        setIsProcessing(false)
        return
      }

      // Plan recalculation
      if (message.includes('plan') || message.includes('actualizar') || message.includes('recalcular')) {
        queryClient.invalidateQueries({ queryKey: ['consolidated-financial-data'] })
        queryClient.invalidateQueries({ queryKey: ['mini-goals'] })
        queryClient.invalidateQueries({ queryKey: ['plan-321'] })
        
        addMessage('¡Plan actualizado! He recalculado todas tus metas y próximos pagos con tus datos más recientes 📊', false)
        
        toast({
          title: "Plan actualizado",
          description: "Tus datos y metas han sido recalculados",
        })
        
        setIsProcessing(false)
        return
      }

      // Default response
      addMessage('Te puedo ayudar con:\n• "Gasté $50 en comida"\n• "Recibí $200 extra"\n• "Pagué $100 de tarjeta"\n• "Actualizar mi plan"', false)
      
    } catch (error) {
      addMessage('Hubo un error procesando tu mensaje. ¿Puedes intentar de nuevo?', false)
      console.error('Error processing message:', error)
    }
    
    setIsProcessing(false)
  }, [createExpense, createIncome, updateDebt, addMessage, toast, queryClient])

  const getCategoryFromDescription = (description: string): ExpenseCategoryType => {
    const desc = description.toLowerCase()
    if (desc.includes('comida') || desc.includes('food') || desc.includes('restaurante')) return 'food'
    if (desc.includes('gas') || desc.includes('combustible') || desc.includes('uber')) return 'transport'
    if (desc.includes('renta') || desc.includes('rent') || desc.includes('casa')) return 'housing'
    if (desc.includes('gym') || desc.includes('netflix') || desc.includes('entretenimiento')) return 'entertainment'
    return 'other'
  }

  const clearMessages = useCallback(() => {
    setMessages([{
      id: '1',
      text: '¡Hola! 👋 Soy tu asistente financiero. Puedo ayudarte a registrar gastos, ingresos o pagos de deudas. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date()
    }])
  }, [])

  return {
    messages,
    isProcessing,
    processMessage,
    clearMessages
  }
}
