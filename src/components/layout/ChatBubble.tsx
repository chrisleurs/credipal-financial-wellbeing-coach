
import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  functionExecuted?: string
  isLoading?: boolean
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente financiero personal de Credipal 💰 Puedo ayudarte a agregar gastos, registrar pagos, analizar tus finanzas y mucho más. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Procesando...',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: message,
          userId: user.id
        }
      })

      if (error) throw error

      // Remove loading message and add AI response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading)
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(),
          functionExecuted: data.functionExecuted
        }
        return [...withoutLoading, aiMessage]
      })

      // Show toast if a function was executed
      if (data.functionExecuted) {
        const functionNames = {
          'add_expense': 'Gasto agregado exitosamente',
          'add_debt_payment': 'Pago registrado exitosamente',
          'get_expenses_summary': 'Resumen generado',
          'analyze_spending_patterns': 'Análisis completado'
        }
        
        toast({
          title: "Acción ejecutada",
          description: functionNames[data.functionExecuted as keyof typeof functionNames] || 'Acción completada',
          duration: 3000
        })
      }

    } catch (error: any) {
      console.error('Error in chat:', error)
      
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading)
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.',
          isUser: false,
          timestamp: new Date()
        }
        return [...withoutLoading, errorMessage]
      })

      toast({
        title: "Error",
        description: "No se pudo procesar tu mensaje",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getSuggestions = () => {
    return [
      "Agrega un gasto de $150 en comida",
      "Muéstrame mis gastos de esta semana",
      "Analiza mis patrones de gasto",
      "¿Cómo van mis finanzas este mes?"
    ]
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

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Prueba preguntando:</p>
              <div className="flex flex-wrap gap-1">
                {getSuggestions().slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
              disabled={isLoading}
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
