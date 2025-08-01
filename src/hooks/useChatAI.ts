
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

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

      // Handle successful function execution
      if (response.functionExecuted) {
        // Invalidate relevant React Query caches
        await handleFunctionSuccess(response.functionExecuted, response.functionResult);
        
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
  }, [user, isLoading, toast, queryClient]);

  const handleFunctionSuccess = async (functionName: string, functionResult: any) => {
    console.log('Function executed successfully:', functionName, functionResult);
    
    switch (functionName) {
      case 'add_expense':
        // Invalidate expenses queries to trigger refetch
        await queryClient.invalidateQueries({ queryKey: ['expenses'] });
        // Also invalidate any financial data queries that might show totals
        await queryClient.invalidateQueries({ queryKey: ['financial-data'] });
        await queryClient.invalidateQueries({ queryKey: ['transactions'] });
        console.log('Invalidated expense-related queries after adding expense');
        break;
        
      case 'add_debt_payment':
        // Invalidate debt-related queries
        await queryClient.invalidateQueries({ queryKey: ['debts'] });
        await queryClient.invalidateQueries({ queryKey: ['debt-payments'] });
        await queryClient.invalidateQueries({ queryKey: ['financial-data'] });
        console.log('Invalidated debt-related queries after payment');
        break;
        
      case 'get_expenses_summary':
        // No need to invalidate for read operations
        console.log('Generated expenses summary, no invalidation needed');
        break;
        
      case 'analyze_spending_patterns':
        // No need to invalidate for analysis operations
        console.log('Completed spending analysis, no invalidation needed');
        break;
        
      default:
        // For unknown functions, invalidate common queries as a safety measure
        await queryClient.invalidateQueries({ queryKey: ['expenses'] });
        await queryClient.invalidateQueries({ queryKey: ['financial-data'] });
        console.log('Unknown function, invalidated common queries');
    }
  };

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
