
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const SimplifiedAuthRedirect = () => {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔄 SimplifiedAuthRedirect:', {
    currentPath: location.pathname,
    user: user?.email || 'none',
    authLoading,
    onboardingCompleted,
    onboardingLoading
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Handle unauthenticated users
    if (!user) {
      if (location.pathname !== '/auth') {
        console.log('🔄 No user - redirecting to /auth');
        navigate('/auth', { replace: true });
      }
      return;
    }

    // User is authenticated - wait for onboarding status
    if (onboardingLoading) return;

    // Redirect based on current location and onboarding status
    const currentPath = location.pathname;

    // From auth page - redirect based on onboarding status
    if (currentPath === '/auth') {
      if (onboardingCompleted === false) {
        console.log('🔄 From auth - needs onboarding, redirecting to /kueski-debt');
        navigate('/kueski-debt', { replace: true });
      } else if (onboardingCompleted === true) {
        console.log('🔄 From auth - onboarding complete, redirecting to /dashboard');
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    // From root - redirect appropriately
    if (currentPath === '/') {
      if (onboardingCompleted === false) {
        console.log('🔄 From root - needs onboarding, redirecting to /kueski-debt');
        navigate('/kueski-debt', { replace: true });
      } else if (onboardingCompleted === true) {
        console.log('🔄 From root - onboarding complete, redirecting to /dashboard');
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    // Block access to onboarding if already completed
    if (currentPath === '/onboarding' && onboardingCompleted === true) {
      console.log('🔄 Onboarding already completed - redirecting to /dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Block access to kueski-debt if onboarding completed
    if (currentPath === '/kueski-debt' && onboardingCompleted === true) {
      console.log('🔄 Kueski debt already handled - redirecting to /dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Protect dashboard and other routes
    const protectedRoutes = ['/dashboard', '/expenses', '/debts', '/plan', '/progress', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    
    if (isProtectedRoute && onboardingCompleted === false) {
      console.log('🔄 Protected route but onboarding incomplete - redirecting to /kueski-debt');
      navigate('/kueski-debt', { replace: true });
      return;
    }

  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname]);

  // Show loading only when necessary
  if (authLoading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Verificando autenticación..." />
      </div>
    );
  }

  return null;
};
