
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2, ArrowLeft, TrendingUp, Receipt, RotateCcw } from 'lucide-react'
import { useMotivationalCoach } from '@/hooks/useMotivationalCoach'
import { QuickActions } from '@/components/chat/QuickActions'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

export default function CoachPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const { 
    messages, 
    isProcessing, 
    hasInitialized,
    processMessage, 
    handleQuickAction,
    getQuickActions,
    initializeCoach
  } = useMotivationalCoach()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize coach when page loads
  useEffect(() => {
    if (!hasInitialized) {
      initializeCoach()
    }
  }, [hasInitialized, initializeCoach])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Focus input when page loads
  useEffect(() => {
    if (inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim() || isProcessing) return

    const messageToSend = message.trim()
    setMessage('')
    
    try {
      await processMessage(messageToSend)
    } catch (error) {
      console.error('Error sending message:', error)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing && message.trim()) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickActionClick = (action: string) => {
    switch (action) {
      case 'expense':
        navigate('/expenses')
        break
      case 'progress':
        navigate('/progress')
        break
      case 'payments':
        navigate('/progress')
        break
      default:
        handleQuickAction(action)
    }
  }

  // Enhanced quick actions with better navigation
  const getEnhancedQuickActions = () => [
    { label: "Registrar gasto 💸", action: "expense" },
    { label: "Ver próximos pagos ⏰", action: "payments" },
    { label: "Recalcular plan ♻️", action: "recalculate" }
  ]

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gradient-to-b from-primary/5 to-background pb-20">
        {/* Header */}
        <Card className="rounded-none border-0 border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Avatar className="h-10 w-10 bg-primary">
                <AvatarFallback className="bg-primary text-white">
                  🤖
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <CardTitle className="text-xl text-primary">Coach CrediPal</CardTitle>
                <p className="text-sm text-muted-foreground">Tu asistente financiero personal</p>
              </div>
              
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1 pr-3" ref={scrollAreaRef}>
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Welcome message if no messages yet */}
              {messages.length === 0 && !hasInitialized && (
                <div className="text-center py-8">
                  <Avatar className="h-16 w-16 bg-primary mx-auto mb-4">
                    <AvatarFallback className="bg-primary text-white text-2xl">
                      🤖
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mb-2">¡Bienvenido a CrediPal Coach!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Soy tu asistente financiero personal. Puedo ayudarte a registrar gastos, 
                    revisar tu progreso y mantener tu plan financiero al día.
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Prueba alguna de estas acciones:</p>
                    <QuickActions 
                      actions={getEnhancedQuickActions()}
                      onActionClick={handleQuickActionClick}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-start gap-3 max-w-[80%]">
                      {!msg.isUser && (
                        <Avatar className="h-8 w-8 bg-primary flex-shrink-0">
                          <AvatarFallback className="bg-primary text-white text-sm">
                            🤖
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`p-4 rounded-2xl text-sm shadow-sm ${
                          msg.isUser
                            ? 'bg-primary text-primary-foreground ml-auto rounded-br-md'
                            : 'bg-card text-card-foreground border rounded-bl-md'
                        }`}
                      >
                        {msg.text}
                        
                        {msg.achievement && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 font-medium">
                              🏆 {msg.achievement}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions for coach messages */}
                  {!msg.isUser && msg.hasQuickActions && (
                    <div className="ml-11 max-w-[80%]">
                      <QuickActions 
                        actions={getEnhancedQuickActions()}
                        onActionClick={handleQuickActionClick}
                        disabled={isProcessing}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback className="bg-primary text-white text-sm">
                        🤖
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-card border p-4 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Coach está escribiendo...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Cuéntame qué movimiento hiciste o pregúntame algo..."
                className="flex-1 bg-background"
                disabled={isProcessing}
                autoComplete="off"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isProcessing}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
