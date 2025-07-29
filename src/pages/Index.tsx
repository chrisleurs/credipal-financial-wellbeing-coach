
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { Welcome } from './Welcome';
import { FinancialDashboard } from '@/components/dashboard/FinancialDashboard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading, logout } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
  };

  // Redirect based on onboarding status
  useEffect(() => {
    if (user && !loading && !onboardingLoading) {
      console.log('Index - User:', user.email, 'Onboarding completed:', onboardingCompleted);
      
      if (onboardingCompleted === false) {
        console.log('Index - Redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else if (onboardingCompleted === true) {
        console.log('Index - Redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, onboardingCompleted, onboardingLoading, navigate]);

  if (loading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Cargando..." />
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

  return <Welcome />;
};

export default Index;
