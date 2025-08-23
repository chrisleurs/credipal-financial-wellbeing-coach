
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Limpiar localStorage y sessionStorage al entrar a auth
  useEffect(() => {
    console.log('Auth page - clearing storage');
    // Limpiar cualquier dato de sesión anterior
    localStorage.removeItem('sb-rvyvqgtwlwbaurcooypk-auth-token');
    sessionStorage.clear();
  }, []);

  const handleAuthSuccess = () => {
    console.log('Auth success, user should be redirected automatically');
  };

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
                    onSuccess={handleAuthSuccess}
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
                  <SignUpForm 
                    onSuccess={handleAuthSuccess} 
                    onSwitchToLogin={switchToLogin}
                  />
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
