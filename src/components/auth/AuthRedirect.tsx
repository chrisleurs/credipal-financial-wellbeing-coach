
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const AuthRedirect = () => {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('AuthRedirect - Current state:', {
      user: user?.email,
      authLoading,
      onboardingCompleted,
      onboardingLoading,
      currentPath: location.pathname,
      hasRedirected
    });

    // Prevent multiple redirections
    if (hasRedirected) return;

    // Don't do anything if still loading authentication
    if (authLoading) {
      console.log('AuthRedirect - Auth still loading');
      return;
    }

    // If no user and we're not on auth page, redirect to auth
    if (!user && location.pathname !== '/auth') {
      console.log('AuthRedirect - No user, redirecting to auth');
      setHasRedirected(true);
      navigate('/auth', { replace: true });
      return;
    }

    // If user exists but onboarding status is still loading, wait
    if (user && onboardingLoading) {
      console.log('AuthRedirect - User found, onboarding status loading');
      return;
    }

    // If user is authenticated, handle navigation based on onboarding status
    if (user && onboardingCompleted !== null) {
      const currentPath = location.pathname;
      
      // Handle auth page redirections
      if (currentPath === '/auth') {
        if (onboardingCompleted === false) {
          console.log('AuthRedirect - New user from auth, redirecting to onboarding');
          setHasRedirected(true);
          navigate('/onboarding', { replace: true });
          return;
        } else if (onboardingCompleted === true) {
          console.log('AuthRedirect - Existing user from auth, redirecting to dashboard');
          setHasRedirected(true);
          navigate('/dashboard', { replace: true });
          return;
        }
      }

      // Handle root path
      if (currentPath === '/') {
        if (onboardingCompleted === false) {
          console.log('AuthRedirect - Root redirect to onboarding');
          setHasRedirected(true);
          navigate('/onboarding', { replace: true });
          return;
        } else if (onboardingCompleted === true) {
          console.log('AuthRedirect - Root redirect to dashboard');
          setHasRedirected(true);
          navigate('/dashboard', { replace: true });
          return;
        }
      }

      // Protected routes that require completed onboarding
      const protectedRoutes = ['/dashboard', '/expenses', '/debts', '/plan', '/profile'];
      const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
      
      if (isProtectedRoute && onboardingCompleted === false) {
        console.log('AuthRedirect - Protected route but onboarding incomplete');
        setHasRedirected(true);
        navigate('/onboarding', { replace: true });
        return;
      }
      
      // Prevent access to onboarding if already completed
      if (currentPath === '/onboarding' && onboardingCompleted === true) {
        console.log('AuthRedirect - Onboarding completed, redirecting to dashboard');
        setHasRedirected(true);
        navigate('/dashboard', { replace: true });
        return;
      }
    }
  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname, hasRedirected]);

  // Reset redirect flag when location changes
  useEffect(() => {
    setHasRedirected(false);
  }, [location.pathname]);

  // Only show spinner on auth page while determining where to redirect
  if (user && location.pathname === '/auth' && (authLoading || onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <LoadingSpinner size="lg" text="Configurando tu experiencia..." />
        </div>
      </div>
    );
  }

  return null;
};
