
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import Welcome from './Welcome';
import { FinancialDashboard } from '@/components/dashboard/FinancialDashboard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading, logout } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const navigate = useNavigate();

  console.log('Index page - Current state:', {
    user: user?.email,
    loading,
    onboardingCompleted,
    onboardingLoading
  });

  const handleSignOut = async () => {
    await logout();
  };

  // Show loading while authentication is being determined
  if (loading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    );
  }

  // If user is authenticated, AuthRedirect will handle navigation
  // But if we're still here with a user, show appropriate content
  if (user) {
    // If onboarding is completed, show dashboard
    if (onboardingCompleted === true) {
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
    
    // If onboarding is not completed, AuthRedirect should handle this
    // But if we're still here, redirect manually
    if (onboardingCompleted === false) {
      navigate('/onboarding', { replace: true });
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
          <LoadingSpinner size="lg" text="Redirigiendo..." />
        </div>
      );
    }
  }

  // If no user, show Welcome page
  return <Welcome />;
};

export default Index;
