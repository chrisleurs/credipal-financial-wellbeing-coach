import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut, getCurrentUser } from '@/services/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente",
      });

      return { success: true, data };
    } catch (error: any) {
      const errorMessage = error.message === 'Invalid login credentials' 
        ? "Credenciales inválidas. Verifica tu email y contraseña."
        : error.message;
      
      toast({
        title: "Error de autenticación",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    userData?: { first_name?: string; last_name?: string; }
  ) => {
    try {
      setLoading(true);
      const { data, error } = await signUp(email, password, userData);
      
      if (error) {
        throw error;
      }

      toast({
        title: "¡Cuenta creada!",
        description: "Por favor revisa tu email para confirmar tu cuenta.",
      });

      return { success: true, data };
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.message.includes('already registered')) {
        errorMessage = "Este email ya está registrado. Por favor inicia sesión.";
      }
      
      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive"
      });

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      return await getCurrentUser();
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };

  return {
    user,
    session,
    loading,
    login,
    register,
    logout,
    getUser,
    isAuthenticated: !!user
  };
};