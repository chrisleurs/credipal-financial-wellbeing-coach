
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
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [lastRedirectPath, setLastRedirectPath] = useState<string | null>(null);

  // Enhanced logging function
  const logRedirectDecision = (decision: string, data: any = {}) => {
    console.log(`🚦 AuthRedirect - ${decision}:`, {
      currentPath: location.pathname,
      hasRedirected,
      redirectAttempts,
      user: user?.email,
      authLoading,
      onboardingCompleted,
      onboardingLoading,
      timestamp: new Date().toISOString(),
      ...data
    });
  };

  useEffect(() => {
    logRedirectDecision('State Change', {
      user: user?.email || 'none',
      authLoading,
      onboardingCompleted,
      onboardingLoading,
      currentPath: location.pathname,
      hasRedirected,
      redirectAttempts
    });

    // Prevent infinite redirects
    if (redirectAttempts > 3) {
      logRedirectDecision('Max Redirects Reached - Stopping', { redirectAttempts });
      return;
    }

    // Prevent multiple redirections in quick succession
    if (hasRedirected && lastRedirectPath === location.pathname) {
      logRedirectDecision('Same Path Redirect Prevented');
      return;
    }

    // Wait for auth to load
    if (authLoading) {
      logRedirectDecision('Auth Loading - Waiting');
      return;
    }

    // Handle unauthenticated users
    if (!user && location.pathname !== '/auth') {
      logRedirectDecision('No User - Redirecting to Auth');
      setHasRedirected(true);
      setRedirectAttempts(prev => prev + 1);
      setLastRedirectPath('/auth');
      navigate('/auth', { replace: true });
      return;
    }

    // Handle authenticated users
    if (user) {
      // Wait for onboarding status if still loading
      if (onboardingLoading) {
        logRedirectDecision('User Found - Onboarding Status Loading');
        return;
      }

      // If onboarding status is determined
      if (onboardingCompleted !== null) {
        const currentPath = location.pathname;
        
        // Handle auth page redirections
        if (currentPath === '/auth') {
          if (onboardingCompleted === false) {
            logRedirectDecision('Authenticated User from Auth - Redirecting to Onboarding');
            setHasRedirected(true);
            setRedirectAttempts(prev => prev + 1);
            setLastRedirectPath('/onboarding');
            navigate('/onboarding', { replace: true });
            return;
          } else if (onboardingCompleted === true) {
            logRedirectDecision('Authenticated User from Auth - Redirecting to Dashboard');
            setHasRedirected(true);
            setRedirectAttempts(prev => prev + 1);
            setLastRedirectPath('/dashboard');
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        // Handle root path
        if (currentPath === '/') {
          if (onboardingCompleted === false) {
            logRedirectDecision('Root Path - Redirecting to Onboarding');
            setHasRedirected(true);
            setRedirectAttempts(prev => prev + 1);
            setLastRedirectPath('/onboarding');
            navigate('/onboarding', { replace: true });
            return;
          } else if (onboardingCompleted === true) {
            logRedirectDecision('Root Path - Redirecting to Dashboard');
            setHasRedirected(true);
            setRedirectAttempts(prev => prev + 1);
            setLastRedirectPath('/dashboard');
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        // Protected routes that require completed onboarding
        const protectedRoutes = ['/dashboard', '/expenses', '/debts', '/plan', '/profile'];
        const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
        
        if (isProtectedRoute && onboardingCompleted === false) {
          logRedirectDecision('Protected Route - Onboarding Incomplete');
          setHasRedirected(true);
          setRedirectAttempts(prev => prev + 1);
          setLastRedirectPath('/onboarding');
          navigate('/onboarding', { replace: true });
          return;
        }
        
        // Prevent access to onboarding if already completed
        if (currentPath === '/onboarding' && onboardingCompleted === true) {
          logRedirectDecision('Onboarding Already Completed - Redirecting to Dashboard');
          setHasRedirected(true);
          setRedirectAttempts(prev => prev + 1);
          setLastRedirectPath('/dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }

        // Handle post-onboarding flow
        if (currentPath === '/post-onboarding' && onboardingCompleted === true) {
          logRedirectDecision('Post-onboarding Already Completed - Redirecting to Dashboard');
          setHasRedirected(true);
          setRedirectAttempts(prev => prev + 1);
          setLastRedirectPath('/dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }
      } else {
        logRedirectDecision('User Found - Onboarding Status Unknown', {
          onboardingCompleted,
          onboardingLoading
        });
      }
    }
  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname, hasRedirected, redirectAttempts, lastRedirectPath]);

  // Reset redirect tracking when location changes significantly
  useEffect(() => {
    // Only reset if we've successfully navigated to a different path
    if (location.pathname !== lastRedirectPath) {
      setHasRedirected(false);
      setRedirectAttempts(0);
      logRedirectDecision('Location Changed - Reset Redirect Tracking', {
        newPath: location.pathname,
        previousPath: lastRedirectPath
      });
    }
  }, [location.pathname, lastRedirectPath]);

  // Show loading spinner with more context
  if (user && location.pathname === '/auth' && (authLoading || onboardingLoading)) {
    logRedirectDecision('Showing Loading Spinner on Auth Page');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <LoadingSpinner size="lg" text="Configurando tu experiencia..." />
          <div className="mt-4 text-sm text-muted-foreground">
            {authLoading && 'Verificando autenticación...'}
            {onboardingLoading && 'Verificando progreso...'}
          </div>
        </div>
      </div>
    );
  }

  // Show error state if too many redirect attempts
  if (redirectAttempts > 3) {
    logRedirectDecision('Error State - Too Many Redirects');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.394-1.787 1.581-3.032l-6.928-10.592a2.121 2.121 0 00-3.618 0l-6.928 10.592C1.374 18.213 2.228 20 3.768 20z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de navegación</h2>
          <p className="text-gray-600 mb-6">
            Hubo un problema con la navegación. Por favor, intenta recargar la página.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return null;
};
