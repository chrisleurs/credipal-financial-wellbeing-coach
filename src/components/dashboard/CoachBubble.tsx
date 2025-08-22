
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CoachBubbleProps {
  message?: string
  onOpenChat?: () => void
}

export const CoachBubble: React.FC<CoachBubbleProps> = ({ 
  message = "¡Hola! 👋 ¿Necesitas ayuda con tus finanzas?",
  onOpenChat 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Expanded Message */}
      {isExpanded && (
        <Card className="mb-3 max-w-xs shadow-lg animate-scale-in border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 bg-primary flex-shrink-0">
                <AvatarFallback className="bg-primary text-white text-sm">
                  🤖
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-primary/10 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{message}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={onOpenChat}
                    className="h-8 text-xs"
                  >
                    Hablar con CrediPal
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setIsExpanded(false)}
                    className="h-8 text-xs"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coach Avatar Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-primary hover:bg-primary/90",
          "relative overflow-hidden",
          isExpanded && "scale-110"
        )}
      >
        <div className="relative">
          <Avatar className="h-10 w-10 bg-white/20">
            <AvatarFallback className="bg-transparent text-white text-lg">
              🤖
            </AvatarFallback>
          </Avatar>
          
          {/* Pulsing notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
            <Sparkles className="h-2 w-2 text-yellow-800 absolute inset-0 m-auto" />
          </div>
        </div>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full animate-ping bg-primary/30 opacity-75"></div>
      </Button>
    </div>
  )
}
