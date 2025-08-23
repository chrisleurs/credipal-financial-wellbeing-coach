
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor ingresa un email válido',
        variant: 'destructive'
      });
      return;
    }

    const result = await resetPassword(email);
    
    if (result?.error) {
      toast({
        title: 'Error al enviar email',
        description: result.error.message || 'Hubo un problema al enviar el email de recuperación',
        variant: 'destructive'
      });
      return;
    }
    
    setEmailSent(true);
    toast({
      title: 'Email enviado',
      description: 'Te hemos enviado un enlace para resetear tu contraseña. Revisa tu bandeja de entrada.'
    });
  };

  if (emailSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Email enviado</h3>
          <p className="text-muted-foreground">
            Te hemos enviado un enlace para resetear tu contraseña a <strong>{email}</strong>.
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            ¿No recibiste el email? Revisa tu carpeta de spam o intenta nuevamente.
          </p>
          <Button
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="w-full"
          >
            Enviar nuevamente
          </Button>
        </div>
        
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Recuperar contraseña</h3>
        <p className="text-muted-foreground">
          Ingresa tu email y te enviaremos un enlace para resetear tu contraseña
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-light"
        disabled={loading || !email}
      >
        {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full"
        disabled={loading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al login
      </Button>
    </form>
  );
};
