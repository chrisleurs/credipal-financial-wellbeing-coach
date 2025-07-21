import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success && onSuccess) {
      onSuccess();
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