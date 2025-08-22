
import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatBot } from '@/hooks/useChatBot'
import { cn } from '@/lib/utils'

export const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const { messages, isProcessing, processMessage, clearMessages } = useChatBot()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return

    const messageToSend = inputMessage.trim()
    setInputMessage('')
    
    await processMessage(messageToSend)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing && inputMessage.trim()) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRecalculatePlan = () => {
    processMessage('Actualizar mi plan')
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          
          {/* Pulsing notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/30 opacity-75" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[380px] h-[600px] max-h-[80vh] max-w-[90vw]">
      <Card className="h-full flex flex-col shadow-2xl border-border bg-background/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                🤖
              </div>
              Asistente Credipal
              <div className="h-2 w-2 bg-green-300 rounded-full animate-pulse" />
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                title="Limpiar chat"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3 gap-3">
          <ScrollArea className="flex-1 pr-3" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-3 rounded-lg text-sm",
                      msg.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                      !msg.isUser && "border border-border"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm border border-border flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Prueba diciendo:</p>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setInputMessage('Gasté $50 en comida')}
                  disabled={isProcessing}
                >
                  Gasté $50 en comida
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setInputMessage('Recibí $200 extra')}
                  disabled={isProcessing}
                >
                  Recibí $200 extra
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2 w-full"
                onClick={handleRecalculatePlan}
                disabled={isProcessing}
              >
                ✨ Actualizar mi plan
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
              disabled={isProcessing}
              autoComplete="off"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              size="icon"
              className="bg-primary"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
