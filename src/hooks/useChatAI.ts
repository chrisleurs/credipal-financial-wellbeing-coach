
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  functionExecuted?: string;
  isLoading?: boolean;
}

interface ChatResponse {
  message: string;
  functionExecuted?: string;
  functionResult?: any;
}

export const useChatAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendMessage = useCallback(async (messageText: string): Promise<void> => {
    if (!messageText.trim() || !user || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: 'Procesando...',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageText,
          userId: user.id
        }
      });

      if (error) throw error;

      const response: ChatResponse = data;

      // Remove loading message and add AI response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          text: response.message,
          isUser: false,
          timestamp: new Date(),
          functionExecuted: response.functionExecuted
        };
        return [...withoutLoading, aiMessage];
      });

      // Show success toast for executed functions
      if (response.functionExecuted) {
        const functionMessages = {
          'add_expense': 'Gasto agregado exitosamente',
          'add_debt_payment': 'Pago registrado exitosamente',
          'get_expenses_summary': 'Resumen generado',
          'analyze_spending_patterns': 'Análisis completado'
        };
        
        toast({
          title: "Acción ejecutada",
          description: functionMessages[response.functionExecuted as keyof typeof functionMessages] || 'Acción completada',
          duration: 3000
        });
      }

    } catch (error: any) {
      console.error('Error in AI chat:', error);
      
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          text: 'Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.',
          isUser: false,
          timestamp: new Date()
        };
        return [...withoutLoading, errorMessage];
      });

      toast({
        title: "Error",
        description: "No se pudo procesar tu mensaje",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading, toast]);

  const addInitialMessage = useCallback((message: string) => {
    const initialMessage: ChatMessage = {
      id: '1',
      text: message,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    addInitialMessage,
    clearMessages
  };
};
