
import React from 'react'
import { MobileFirstDashboard } from '@/components/dashboard/MobileFirstDashboard'
import { CoachBubble } from '@/components/dashboard/CoachBubble'
import { useChatAI } from '@/hooks/useChatAI'

export default function Dashboard() {
  const { addInitialMessage } = useChatAI()

  const handleOpenChat = () => {
    addInitialMessage("¡Hola! Soy CrediPal, tu coach financiero personal. ¿En qué puedo ayudarte hoy?")
    console.log('Opening chat with CrediPal...')
  }

  return (
    <div className="relative min-h-screen">
      <MobileFirstDashboard />
      <CoachBubble 
        message="¡Genial progreso esta semana! 🎉 ¿Quieres acelerar tu plan financiero?"
        onOpenChat={handleOpenChat}
      />
    </div>
  )
}
