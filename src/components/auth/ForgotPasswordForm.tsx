
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
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
    
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email",
        variant: "destructive"
      });
      return;
    }

    console.log('Attempting password reset for:', email);
    const result = await resetPassword(email);
    
    if (result.error) {
      console.error('Password reset failed:', result.error);
      toast({
        title: "Error al enviar email",
        description: result.error.message || "No se pudo enviar el email de recuperación",
        variant: "destructive"
      });
    } else {
      console.log('Password reset email sent successfully');
      setEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Te hemos enviado un enlace para resetear tu contraseña. Revisa tu bandeja de entrada.",
      });
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Email enviado</h3>
          <p className="text-sm text-muted-foreground">
            Te hemos enviado un enlace para resetear tu contraseña a <strong>{email}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Revisa tu bandeja de entrada y spam. El enlace expira en 1 hora.
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio de sesión
          </Button>
          
          <Button 
            onClick={() => {
              setEmailSent(false);
              setEmail('');
            }}
            variant="ghost"
            className="w-full text-sm"
          >
            Enviar a otro email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <p className="text-xs text-muted-foreground">
          Te enviaremos un enlace para crear una nueva contraseña
        </p>
      </div>

      <div className="space-y-2">
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-light"
          disabled={loading || !email}
        >
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>
        
        <Button 
          type="button"
          onClick={onBack}
          variant="ghost"
          className="w-full"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio de sesión
        </Button>
      </div>
    </form>
  );
};
