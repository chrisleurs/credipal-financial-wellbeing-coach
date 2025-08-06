
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
    // No hacer nada si aún estamos cargando
    if (authLoading || onboardingLoading) {
      return;
    }

    // Si no hay usuario, no hacer redirect automático
    if (!user) {
      return;
    }

    console.log('AuthRedirect - User:', user.email, 'Onboarding completed:', onboardingCompleted, 'Current path:', location.pathname);

    const currentPath = location.pathname;
    
    // CRITICAL FIX: If user is trying to access dashboard, let them through
    // This prevents the infinite redirect loop
    if (currentPath === '/dashboard') {
      console.log('AuthRedirect - User trying to access dashboard, allowing access');
      return;
    }
    
    // Si el usuario está autenticado pero NO ha completado el onboarding
    if (onboardingCompleted === false) {
      // Solo redirigir si NO está ya en onboarding
      if (currentPath !== '/onboarding') {
        console.log('AuthRedirect - User has not completed onboarding, redirecting to /onboarding');
        navigate('/onboarding', { replace: true });
        return;
      }
    }

    // Si el usuario YA completó el onboarding pero está en onboarding, redirigir al dashboard
    if (onboardingCompleted === true && currentPath === '/onboarding') {
      console.log('AuthRedirect - User completed onboarding but is in onboarding page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Si el usuario está en auth y ya está autenticado, redirigir según onboarding status
    if (currentPath === '/auth' && user) {
      if (onboardingCompleted === false) {
        console.log('AuthRedirect - Authenticated user in auth page, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else if (onboardingCompleted === true) {
        console.log('AuthRedirect - Authenticated user in auth page, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    // Si el usuario está en la página de inicio y ya está autenticado
    if (currentPath === '/' && user) {
      if (onboardingCompleted === false) {
        console.log('AuthRedirect - Authenticated user in home page, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else if (onboardingCompleted === true) {
        console.log('AuthRedirect - Authenticated user in home page, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    // Proteger rutas que requieren onboarding completado
    const protectedRoutes = ['/expenses', '/debts', '/profile', '/calendar', '/plan'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    
    if (isProtectedRoute && onboardingCompleted === false) {
      console.log('AuthRedirect - User trying to access protected route without completing onboarding, redirecting to onboarding');
      navigate('/onboarding', { replace: true });
      return;
    }
  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname]);

  // Mostrar spinner mientras cargamos el estado de autenticación y onboarding
  if (authLoading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Verificando estado..." />
      </div>
    );
  }

  return null;
};
