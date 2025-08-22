
import React from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Sparkles } from 'lucide-react'
import { useChatAI } from '@/hooks/useChatAI'

export const FloatingChatbot = () => {
  const { addInitialMessage } = useChatAI()

  const handleOpenChat = () => {
    addInitialMessage("¡Hola! Soy CrediPal, tu coach financiero personal. ¿En qué puedo ayudarte hoy?")
    console.log('Opening chat with CrediPal...')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleOpenChat}
        className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-[#10B981] hover:bg-[#059669] relative overflow-hidden"
      >
        <div className="relative">
          <MessageCircle className="h-7 w-7 text-white" />
          
          {/* Pulsing notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F59E0B] rounded-full animate-pulse">
            <Sparkles className="h-2 w-2 text-white absolute inset-0 m-auto" />
          </div>
        </div>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full animate-ping bg-[#10B981]/30 opacity-75"></div>
      </Button>
    </div>
  )
}
