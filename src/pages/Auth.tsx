import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

const Auth = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/');
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
              <LoginForm onSuccess={handleAuthSuccess} />
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <SignUpForm onSuccess={handleAuthSuccess} />
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