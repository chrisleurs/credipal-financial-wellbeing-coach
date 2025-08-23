
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignUpForm = ({ onSuccess, onSwitchToLogin }: SignUpFormProps) => {
  const { signUp, loading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Auth - attempting sign up for:', formData.email);
    const result = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
    
    if (result?.error) {
      console.log('SignUp error detected:', result.error);
      
      // Si el usuario ya existe, mostrar mensaje y opción de ir a login
      if (result.error.message?.includes('User already registered') || 
          result.error.message?.includes('already registered') ||
          result.error.code === 'user_already_exists') {
        
        toast({
          title: 'Este email ya está registrado',
          description: 'Puedes iniciar sesión con tu cuenta existente',
          action: {
            label: 'Ir a Login',
            onClick: () => onSwitchToLogin?.()
          }
        });
        return;
      }
      
      // Otros errores
      toast({
        title: 'Error al crear cuenta',
        description: result.error.message || 'Hubo un problema al crear tu cuenta'
      });
      return;
    }
    
    // Éxito en registro
    toast({
      title: 'Cuenta creada exitosamente',
      description: 'Bienvenido a CrediPal. Comencemos con tu onboarding.'
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-firstname" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nombre
          </Label>
          <Input
            id="signup-firstname"
            type="text"
            placeholder="Juan"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-lastname">Apellido</Label>
          <Input
            id="signup-lastname"
            type="text"
            placeholder="Pérez"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            disabled={loading}
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
          disabled={loading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
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
          disabled={loading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirmar Contraseña *</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-secondary hover:bg-secondary-light"
        disabled={loading}
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
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
