
import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useMotivationalCoach } from '@/hooks/useMotivationalCoach'
import { QuickActions } from '@/components/chat/QuickActions'

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
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

  // Initialize coach when chat opens
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      initializeCoach()
    }
  }, [isOpen, hasInitialized, initializeCoach])

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

  // Re-focus input after loading state changes
  useEffect(() => {
    if (!isProcessing && isOpen && inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [isProcessing, isOpen])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          size="icon"
        >
          <div className="relative z-10">
            <MessageCircle className="h-6 w-6" />
          </div>
          
          {/* Sparkle indicator */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-2 w-2 text-yellow-800" />
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/30 opacity-75 group-hover:opacity-0 transition-opacity"></div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[380px] h-[600px] max-h-[80vh] max-w-[90vw]">
      <Card className="h-full flex flex-col shadow-2xl border-border bg-background/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback className="bg-primary text-white text-sm">
                  🤖
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-primary">Coach CrediPal</div>
                <div className="text-xs text-muted-foreground font-normal">Tu asistente financiero</div>
              </div>
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
        
        <CardContent className="flex-1 flex flex-col p-4 gap-3">
          <ScrollArea className="flex-1 pr-3" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {!msg.isUser && (
                        <Avatar className="h-6 w-6 bg-primary flex-shrink-0">
                          <AvatarFallback className="bg-primary text-white text-xs">
                            🤖
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          msg.isUser
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-primary/10 text-foreground'
                        }`}
                      >
                        {msg.text}
                        
                        {msg.achievement && (
                          <div className="mt-2 p-2 bg-yellow-100 rounded-md border-l-4 border-yellow-400">
                            <p className="text-xs text-yellow-800 font-medium">
                              🏆 {msg.achievement}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions for coach messages */}
                  {!msg.isUser && msg.hasQuickActions && (
                    <div className="ml-8">
                      <QuickActions 
                        actions={getQuickActions()}
                        onActionClick={handleQuickAction}
                        disabled={isProcessing}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6 bg-primary">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        🤖
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-primary/10 p-3 rounded-lg">
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
          
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Cuéntame qué movimiento hiciste..."
              className="flex-1"
              disabled={isProcessing}
              autoComplete="off"
              autoFocus={false}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isProcessing}
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
