
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
    
    // Lista de rutas protegidas que requieren autenticación pero NO onboarding completado
    const protectedRoutes = ['/dashboard', '/expenses', '/debts', '/profile', '/calendar', '/plan'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    
    // Si el usuario está autenticado y está en una ruta protegida, permitir acceso
    if (user && isProtectedRoute) {
      console.log('AuthRedirect - User authenticated and in protected route, allowing access');
      return;
    }
    
    // Si el usuario está en auth y ya está autenticado, redirigir al dashboard
    if (currentPath === '/auth' && user) {
      console.log('AuthRedirect - Authenticated user in auth page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Si el usuario está en la página de inicio y ya está autenticado, redirigir al dashboard
    if (currentPath === '/' && user) {
      console.log('AuthRedirect - Authenticated user in home page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Solo forzar onboarding si explícitamente está en la ruta de onboarding
    // y no ha completado el onboarding
    if (currentPath === '/onboarding' && onboardingCompleted === true) {
      console.log('AuthRedirect - User completed onboarding but is in onboarding page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname]);

  // Mostrar spinner solo mientras cargamos el estado inicial de autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Verificando estado..." />
      </div>
    );
  }

  return null;
};
