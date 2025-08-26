
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Don't redirect here - let AuthRedirect handle it based on onboarding status
  useEffect(() => {
    if (!loading && user) {
      console.log('Auth - User authenticated, AuthRedirect will handle navigation');
    }
  }, [user, loading]);

  const switchToLogin = () => {
    setActiveTab('login');
    setShowForgotPassword(false);
  };

  const switchToSignUp = () => {
    setActiveTab('signup');
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
  };

  // Don't render if loading or user is authenticated (let AuthRedirect handle it)
  if (loading || user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verificando estado de usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CrediPal
          </h1>
          <p className="text-muted-foreground">
            Tu compañero inteligente para el control financiero
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-background/80 border-white/20">
          {showForgotPassword ? (
            <>
              <CardHeader>
                <CardTitle>Recuperar contraseña</CardTitle>
                <CardDescription>
                  Te ayudaremos a recuperar el acceso a tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ForgotPasswordForm onBack={handleBackFromForgotPassword} />
              </CardContent>
            </>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardHeader>
                  <CardTitle>Bienvenido de vuelta</CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para acceder a tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm 
                    onForgotPassword={handleForgotPassword}
                  />
                  
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    ¿No tienes cuenta?{' '}
                    <button 
                      onClick={switchToSignUp}
                      className="text-primary hover:underline font-medium"
                    >
                      Regístrate aquí
                    </button>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardHeader>
                  <CardTitle>Crear tu cuenta</CardTitle>
                  <CardDescription>
                    Completa el formulario para comenzar tu journey financiero
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignUpForm onSwitchToLogin={switchToLogin} />
                </CardContent>
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Auth;
