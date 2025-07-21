import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FinancialHero } from '@/components/financial/FinancialHero';
import { FinancialDashboard } from '@/components/dashboard/FinancialDashboard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-financial-pulse w-16 h-16 bg-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <>
        <div className="absolute top-4 right-4 z-50">
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            Cerrar Sesión
          </Button>
        </div>
        <FinancialDashboard />
      </>
    );
  }

  return <FinancialHero onGetStarted={handleGetStarted} />;
};

export default Index;
