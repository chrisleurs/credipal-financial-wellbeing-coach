
import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { MobileFirstDashboard } from '@/components/dashboard/MobileFirstDashboard'
import { CoachBubble } from '@/components/dashboard/CoachBubble'
import { useChatAI } from '@/hooks/useChatAI'

export default function Dashboard() {
  const { addInitialMessage } = useChatAI()

  const handleOpenChat = () => {
    addInitialMessage("¡Hola! Soy CrediPal, tu coach financiero personal. ¿En qué puedo ayudarte hoy?")
    // Here you would open the chat interface
    console.log('Opening chat with CrediPal...')
  }

  return (
    <AppLayout>
      <div className="relative">
        <MobileFirstDashboard />
        <CoachBubble 
          message="¡Genial progreso esta semana! 🎉 ¿Quieres acelerar tu plan financiero?"
          onOpenChat={handleOpenChat}
        />
      </div>
    </AppLayout>
  )
}
