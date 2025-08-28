
import React, { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/LanguageContext'

interface CoachToastProps {
  type: 'expense' | 'income' | 'saving' | 'debt' | 'subscription'
  amount?: number
  goalProgress?: number
  debtReduction?: number
}

export const useCoachToast = () => {
  const { toast } = useToast()
  const { t } = useLanguage()

  const showMotivationalToast = (params: CoachToastProps) => {
    const { type, amount, goalProgress, debtReduction } = params

    const messages = {
      expense: [
        "Done, movement saved! 🚀",
        "Perfect, I've recorded it 📝",
        "Excellent control! Movement saved 💪"
      ],
      income: [
        "Income registered! 💰 You'll see it in Scheduled",
        "Great! Income added to your plan 🌟",
        "Excellent! Your saving capacity improves 🎉"
      ],
      saving: [
        `Your saving pushes your goal +${goalProgress?.toFixed(1)}% 🎯`,
        "Great saving! Every dollar counts 💪",
        "You're on the right track towards your goal! 🚀"
      ],
      debt: [
        `Great payment! You reduce your total debt by ${debtReduction?.toFixed(1)}% 💪`,
        "Excellent payment! Every payment brings you closer to freedom 🎯",
        "Keep it up! Your effort is paying off 🌟"
      ],
      subscription: [
        "Subscription created. We'll remind you 2 days before ⏰",
        "Perfect! You'll never forget this payment 📅",
        "Subscription added to your calendar 🎯"
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
