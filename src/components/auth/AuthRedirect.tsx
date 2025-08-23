
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

    // If no user and we're not on auth page, redirect to auth
    if (!user && location.pathname !== '/auth') {
      console.log('AuthRedirect - No user, redirecting to auth');
      navigate('/auth', { replace: true });
      return;
    }

    // If user exists but onboarding status is still loading, wait
    if (user && onboardingLoading) {
      console.log('AuthRedirect - User found, onboarding status loading');
      return;
    }

    // If user is authenticated, handle navigation based on onboarding status
    if (user) {
      const currentPath = location.pathname;
      
      // If on auth page and authenticated, redirect based on onboarding status
      if (currentPath === '/auth') {
        if (onboardingCompleted === false) {
          console.log('AuthRedirect - Authenticated user needs onboarding');
          navigate('/onboarding', { replace: true });
        } else if (onboardingCompleted === true) {
          console.log('AuthRedirect - Authenticated user with completed onboarding');
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      // Handle root path
      if (currentPath === '/') {
        if (onboardingCompleted === false) {
          console.log('AuthRedirect - Root redirect to onboarding');
          navigate('/onboarding', { replace: true });
        } else if (onboardingCompleted === true) {
          console.log('AuthRedirect - Root redirect to dashboard');
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      // Protected routes that require completed onboarding
      const protectedRoutes = ['/dashboard', '/expenses', '/debts', '/plan', '/profile'];
      const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
      
      if (isProtectedRoute && onboardingCompleted === false) {
        console.log('AuthRedirect - Protected route but onboarding incomplete');
        navigate('/onboarding', { replace: true });
        return;
      }
      
      // Prevent access to onboarding if already completed
      if (currentPath === '/onboarding' && onboardingCompleted === true) {
        console.log('AuthRedirect - Onboarding completed, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }
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
