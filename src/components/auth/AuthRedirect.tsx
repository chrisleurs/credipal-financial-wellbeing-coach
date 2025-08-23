
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const AuthRedirect = () => {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('AuthRedirect - Current state:', {
      user: user?.email,
      authLoading,
      onboardingCompleted,
      onboardingLoading,
      currentPath: location.pathname
    });

    // Don't do anything if still loading authentication
    if (authLoading) {
      console.log('AuthRedirect - Auth still loading');
      return;
    }

    // If no user, don't auto redirect
    if (!user) {
      console.log('AuthRedirect - No user found');
      return;
    }

    // If user exists but onboarding status is still loading, wait
    if (onboardingLoading) {
      console.log('AuthRedirect - Onboarding status loading');
      return;
    }

    const currentPath = location.pathname;
    
    // Routes that require completed onboarding
    const protectedRoutes = ['/dashboard', '/expenses', '/debts', '/plan', '/profile', '/calendar'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    
    // If user completed onboarding, never allow returning to /onboarding
    if (onboardingCompleted === true && currentPath === '/onboarding') {
      console.log('AuthRedirect - User completed onboarding but trying to access /onboarding, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // If user is on protected route but hasn't completed onboarding
    if (isProtectedRoute && onboardingCompleted === false) {
      console.log('AuthRedirect - User in protected route but onboarding incomplete, redirecting to onboarding');
      navigate('/onboarding', { replace: true });
      return;
    }
    
    // Redirect from entry pages for authenticated users
    if (currentPath === '/auth' || currentPath === '/') {
      if (onboardingCompleted === false) {
        console.log('AuthRedirect - Authenticated user needs onboarding, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else if (onboardingCompleted === true) {
        console.log('AuthRedirect - Authenticated user with completed onboarding, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
      return;
    }
  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname]);

  // Show spinner while loading critical states
  if (authLoading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <LoadingSpinner size="lg" text="Verificando estado de usuario..." />
        </div>
      </div>
    );
  }

  return null;
};
