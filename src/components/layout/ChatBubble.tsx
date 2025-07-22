
import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatAI } from '@/hooks/useChatAI'

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { messages, isLoading, sendMessage, addInitialMessage } = useChatAI()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addInitialMessage('¡Hola! Soy tu asistente financiero personal de Credipal 💰 Puedo ayudarte a agregar gastos, registrar pagos, analizar tus finanzas y mucho más. ¿En qué puedo ayudarte hoy?')
    }
  }, [messages.length, addInitialMessage])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Focus input when chat opens or after sending a message
  useEffect(() => {
    if (isOpen && inputRef.current && !isLoading) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isLoading])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const messageToSend = message.trim()
    setMessage('') // Clear input immediately
    
    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)

    await sendMessage(messageToSend)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const getSuggestions = () => {
    return [
      "Agrega un gasto de $150 en comida",
      "Muéstrame mis gastos de esta semana",
      "Analiza mis patrones de gasto",
      "¿Cómo van mis finanzas este mes?"
    ]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    inputRef.current?.focus()
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px]">
      <Card className="h-full flex flex-col shadow-2xl border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Credipal AI
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3 gap-3">
          <ScrollArea className="flex-1 pr-3" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      msg.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    } ${msg.functionExecuted ? 'border-l-4 border-green-500' : ''}`}
                  >
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {msg.text}
                      </div>
                    ) : (
                      <>
                        {msg.text}
                        {msg.functionExecuted && (
                          <div className="text-xs mt-1 opacity-75">
                            ✅ Acción ejecutada
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Suggestions - only show when conversation is short */}
          {messages.length <= 2 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Prueba preguntando:</p>
              <div className="flex flex-wrap gap-1">
                {getSuggestions().slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              size="icon"
              className="bg-gradient-primary"
            >
              {isLoading ? (
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
