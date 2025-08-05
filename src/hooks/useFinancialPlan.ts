
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { generateFinancialPlan, saveFinancialPlan } from '@/services/openai';
import type { FinancialData, AIGeneratedPlan } from '@/types';

interface FinancialPlan {
  id: string;
  user_id: string;
  plan_data: AIGeneratedPlan;
  plan_type: string;
  status: string;
  goals: any[];
  recommendations: string[];
  monthly_balance: number;
  savings_suggestion: number;
  created_at: string;
  updated_at: string;
}

export const useFinancialPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch existing financial plan
  const {
    data: currentPlan,
    isLoading,
    error
  } = useQuery({
    queryKey: ['financial-plan', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as FinancialPlan | null;
    },
    enabled: !!user,
  });

  // Generate new financial plan
  const generatePlan = async (financialData: FinancialData): Promise<AIGeneratedPlan> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    setIsGenerating(true);
    try {
      console.log('Generating financial plan for user:', user.id);
      
      // Generate plan using OpenAI
      const generatedPlan = await generateFinancialPlan(financialData);
      
      // Save to database
      await saveFinancialPlan(generatedPlan, user.id);
      
      // Refresh the query
      queryClient.invalidateQueries({ queryKey: ['financial-plan', user.id] });
      
      toast({
        title: "Plan generado exitosamente",
        description: "Tu plan financiero personalizado está listo",
      });

      return generatedPlan;
    } catch (error: any) {
      toast({
        title: "Error al generar plan",
        description: error.message || "No se pudo generar el plan financiero",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Update goal progress
  const updateGoalProgress = useMutation({
    mutationFn: async ({ goalId, progress }: { goalId: string; progress: number }) => {
      if (!user || !currentPlan) return;

      const updatedGoals = currentPlan.goals.map(goal => 
        goal.id === goalId ? { ...goal, progress } : goal
      );

      const { error } = await supabase
        .from('financial_plans')
        .update({ goals: updatedGoals })
        .eq('id', currentPlan.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-plan', user?.id] });
      toast({
        title: "Progreso actualizado",
        description: "Tu avance ha sido guardado",
      });
    }
  });

  return {
    currentPlan: currentPlan?.plan_data || null,
    planMetadata: currentPlan,
    isLoading,
    isGenerating,
    error,
    generatePlan,
    updateGoalProgress: updateGoalProgress.mutate,
    hasPlan: !!currentPlan
  };
};
