
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignUpForm = ({ onSuccess, onSwitchToLogin }: SignUpFormProps) => {
  const { signUp, loading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email || !formData.password || !formData.firstName) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);
    console.log('SignUpForm - attempting signup for:', formData.email);
    
    try {
      const result = await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      );
      
      if (result?.error) {
        console.error('Signup failed:', result.error);
        
        let errorMessage = 'Error al crear la cuenta';
        
        if (result.error.message?.includes('User already registered')) {
          errorMessage = 'Ya existe una cuenta con este email';
        } else if (result.error.message?.includes('Password should be at least')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        } else if (result.error.message?.includes('Invalid email')) {
          errorMessage = 'Email inválido';
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }
        
        setError(errorMessage);
        toast({
          title: "Error al crear cuenta",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        console.log('Signup successful - letting AuthRedirect handle navigation');
        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada exitosamente. Te estamos redirigiendo..."
        });
        
        // Don't call onSuccess immediately - let AuthRedirect handle the navigation
        // based on the user's onboarding status
      }
    } catch (error: any) {
      console.error('Signup exception:', error);
      const errorMessage = 'Error inesperado al crear la cuenta';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="signup-firstName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nombre *
          </Label>
          <Input
            id="signup-firstName"
            type="text"
            placeholder="Juan"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            required
            disabled={loading || isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-lastName">Apellido</Label>
          <Input
            id="signup-lastName"
            type="text"
            placeholder="Pérez"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            disabled={loading || isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email *
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange('email')}
          required
          disabled={loading || isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Contraseña *
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange('password')}
          required
          disabled={loading || isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirmPassword" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Confirmar Contraseña *
        </Label>
        <Input
          id="signup-confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
          disabled={loading || isSubmitting}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-light"
        disabled={loading || isSubmitting || !formData.email || !formData.password || !formData.firstName}
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <button 
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary hover:underline font-medium"
        >
          Inicia sesión aquí
        </button>
      </div>
    </form>
  );
};
