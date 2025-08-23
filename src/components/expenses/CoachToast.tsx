
import React, { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface CoachToastProps {
  type: 'expense' | 'income' | 'saving' | 'debt' | 'subscription'
  amount?: number
  goalProgress?: number
  debtReduction?: number
}

export const useCoachToast = () => {
  const { toast } = useToast()

  const showMotivationalToast = (params: CoachToastProps) => {
    const { type, amount, goalProgress, debtReduction } = params

    const messages = {
      expense: [
        "Listo, ¡movimiento guardado! 🚀",
        "Perfecto, ya lo registré 📝",
        "¡Excelente control! Movimiento guardado 💪"
      ],
      income: [
        "¡Ingreso registrado! 💰 Lo verás en Programados",
        "¡Genial! Ingreso añadido a tu plan 🌟",
        "¡Excelente! Tu capacidad de ahorro mejora 🎉"
      ],
      saving: [
        `Tu ahorro empuja tu meta un +${goalProgress?.toFixed(1)}% 🎯`,
        "¡Gran ahorro! Cada peso cuenta 💪",
        "¡Vas por buen camino hacia tu meta! 🚀"
      ],
      debt: [
        `¡Gran pago! Reduces tu deuda total en ${debtReduction?.toFixed(1)}% 💪`,
        "¡Excelente pago! Cada abono te acerca a la libertad 🎯",
        "¡Sigue así! Tu esfuerzo está dando frutos 🌟"
      ],
      subscription: [
        "Suscripción creada. Te avisamos 2 días antes ⏰",
        "¡Perfecto! Nunca olvidarás este pago 📅",
        "Suscripción añadida a tu calendario 🎯"
      ]
    }

    const typeMessages = messages[type]
    const randomMessage = typeMessages[Math.floor(Math.random() * typeMessages.length)]

    toast({
      title: randomMessage,
      duration: 3000,
    })
  }

  return { showMotivationalToast }
}
