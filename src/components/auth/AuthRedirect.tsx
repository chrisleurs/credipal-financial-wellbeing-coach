
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
    if (authLoading) {
      console.log('AuthRedirect - Auth still loading');
      return;
    }

    // Si no hay usuario, no hacer redirect automático
    if (!user) {
      console.log('AuthRedirect - No user found');
      return;
    }

    // Si estamos cargando el estado de onboarding, esperar
    if (onboardingLoading) {
      console.log('AuthRedirect - Onboarding status loading');
      return;
    }

    console.log('AuthRedirect - User:', user.email, 'Onboarding completed:', onboardingCompleted, 'Current path:', location.pathname);

    const currentPath = location.pathname;
    
    // Rutas que requieren onboarding completado
    const protectedRoutes = ['/dashboard', '/expenses', '/debts', '/plan', '/profile', '/calendar'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    
    // Si el usuario está en una ruta protegida pero no ha completado onboarding
    if (isProtectedRoute && onboardingCompleted === false) {
      console.log('AuthRedirect - User in protected route but onboarding incomplete, redirecting to onboarding');
      navigate('/onboarding', { replace: true });
      return;
    }
    
    // Si el usuario está en onboarding pero ya completó el proceso
    if (currentPath === '/onboarding' && onboardingCompleted === true) {
      console.log('AuthRedirect - User in onboarding but already completed, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Redirección desde páginas de entrada para usuarios autenticados
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

  // Mostrar spinner mientras se cargan los estados críticos
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
