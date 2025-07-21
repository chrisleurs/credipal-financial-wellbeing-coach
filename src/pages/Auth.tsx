import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Lock, User, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: signInData.email,
      password: signInData.password
    });

    if (error) {
      toast({
        title: "Error de autenticación",
        description: error.message === 'Invalid login credentials' 
          ? "Credenciales inválidas. Verifica tu email y contraseña."
          : error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente",
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }

    if (signUpData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: signUpData.firstName,
          last_name: signUpData.lastName
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: "Usuario existente",
          description: "Este email ya está registrado. Por favor inicia sesión.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error de registro",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "¡Cuenta creada!",
        description: "Por favor revisa tu email para confirmar tu cuenta.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-wellness flex items-center justify-center p-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-wellness-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-light/20 rounded-full blur-xl animate-wellness-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back Button */}
      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        className="absolute top-4 left-4 text-white hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al inicio
      </Button>

      {/* Auth Card */}
      <Card className="w-full max-w-md shadow-financial backdrop-blur-sm bg-white/95 relative z-10">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Credipal</CardTitle>
          <CardDescription>Tu coach de bienestar financiero</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    required
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
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-light"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
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
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Apellido</Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      placeholder="Pérez"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
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
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    required
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
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmar Contraseña *</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-secondary hover:bg-secondary-light"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Trust Indicators */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% Seguro y Confidencial</span>
            </div>
            <p>Tus datos financieros están protegidos con encriptación de nivel bancario</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;