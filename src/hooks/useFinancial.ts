import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { FinancialData } from '@/types';

export const useFinancial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const saveFinancialData = async (data: FinancialData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para guardar datos",
        variant: "destructive"
      });
      return { success: false };
    }

    setIsLoading(true);
    try {
      console.log('Saving financial data:', data);
      
      toast({
        title: "Datos guardados",
        description: "Tu información financiera ha sido guardada exitosamente",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudieron guardar los datos",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveFinancialData,
    isLoading
  };
};