
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Brain, Sparkles } from 'lucide-react'
import type { CrediMessage } from '@/types/financialPlan'

interface CrediAssistantProps {
  message: CrediMessage
  onChat: () => void
}

export const CrediAssistant: React.FC<CrediAssistantProps> = ({ message, onChat }) => {
  const getMessageIcon = () => {
    switch (message.type) {
      case 'celebration':
        return <Sparkles className="h-4 w-4 text-yellow-500" />
      case 'suggestion':
        return <Brain className="h-4 w-4 text-blue-500" />
      case 'reminder':
        return <MessageCircle className="h-4 w-4 text-orange-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-primary" />
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar de Credi */}
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src="" alt="Credi" className="bg-white/10" />
              <AvatarFallback className="bg-white/10 text-white text-2xl">
                🤖
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-400 h-4 w-4 rounded-full border-2 border-white animate-pulse" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">Credi</h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Tu asistente financiero
              </span>
              {getMessageIcon()}
            </div>
            
            <p className="text-white/90 mb-4 text-sm leading-relaxed">
              {message.text}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={onChat}
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Hablar con Credi
              </Button>
              <Button
                size="sm"
                variant="ghost" 
                className="text-white hover:bg-white/10"
              >
                Ver historial
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
