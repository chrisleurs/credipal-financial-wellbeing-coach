import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useFinancialStore } from '@/store/financialStore'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente financiero de Credipal. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { financialData } = useFinancialStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on user message and financial data
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const responses = {
      gastos: `Veo que tienes gastos por $${financialData.monthlyExpenses.toLocaleString()}. Te recomiendo revisar las categorías más altas y buscar oportunidades de ahorro.`,
      ahorros: `Tienes $${financialData.currentSavings.toLocaleString()} en ahorros. ¡Excelente! ¿Te gustaría que te ayude a optimizar tu estrategia de ahorro?`,
      deudas: financialData.debts.length > 0 
        ? `Veo que tienes ${financialData.debts.length} deuda(s). Te sugiero priorizar las de mayor interés para ahorrar dinero a largo plazo.`
        : `¡Felicidades! No tienes deudas registradas. Esto te da más flexibilidad para ahorrar e invertir.`,
      plan: `Basándome en tus ingresos de $${(financialData.monthlyIncome + financialData.extraIncome).toLocaleString()} y gastos de $${financialData.monthlyExpenses.toLocaleString()}, puedo ayudarte a crear un plan personalizado.`,
      default: `Entiendo tu consulta. Como tu asistente financiero, puedo ayudarte con análisis de gastos, planificación de ahorros, gestión de deudas y consejos personalizados. ¿Qué te interesa más?`
    }

    const userMessageLower = userMessage.toLowerCase()
    
    if (userMessageLower.includes('gasto')) return responses.gastos
    if (userMessageLower.includes('ahorro')) return responses.ahorros
    if (userMessageLower.includes('deuda')) return responses.deudas
    if (userMessageLower.includes('plan')) return responses.plan
    
    return responses.default
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(userMessage.text)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error. Por favor intenta nuevamente.',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
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

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 shadow-financial z-50 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>Asistente Credipal</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-3 gap-3">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-2 rounded-lg flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs text-muted-foreground">Escribiendo...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Pregúntame sobre finanzas..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button 
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-9 w-9"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-wellness z-50 ${
          isOpen ? 'bg-destructive hover:bg-destructive/90' : 'bg-gradient-primary'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </>
  )
}