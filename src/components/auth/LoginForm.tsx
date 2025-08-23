
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const { signIn, loading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    console.log('LoginForm - attempting login for:', formData.email);
    const result = await signIn(formData.email, formData.password);
    
    if (result?.error) {
      console.error('Login failed:', result.error);
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (result.error.message?.includes('Invalid login credentials') || 
          result.error.message?.includes('invalid_credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (result.error.message?.includes('Email not confirmed')) {
        errorMessage = 'Debes confirmar tu email antes de iniciar sesión';
      } else if (result.error.message?.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo';
      }
      
      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      console.log('Login successful');
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange('email')}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signin-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Contraseña
        </Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange('password')}
          required
          disabled={loading}
        />
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:underline"
          disabled={loading}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-light"
        disabled={loading || !formData.email || !formData.password}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
