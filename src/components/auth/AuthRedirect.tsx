
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
    
    // Permitir acceso completo al dashboard y sus rutas relacionadas para usuarios autenticados
    const dashboardRoutes = ['/dashboard', '/expenses', '/debts', '/plan', '/profile', '/calendar'];
    const isDashboardRoute = dashboardRoutes.some(route => currentPath.startsWith(route));
    
    // Si el usuario está en una ruta del dashboard, permitir acceso
    if (isDashboardRoute && user) {
      console.log('AuthRedirect - User accessing dashboard area, allowing access');
      return;
    }
    
    // Si el usuario está en la página de onboarding, permitir acceso
    if (currentPath === '/onboarding' && user) {
      console.log('AuthRedirect - User accessing onboarding, allowing access');
      return;
    }
    
    // Solo redirigir desde auth y home si el usuario ya está autenticado
    if (currentPath === '/auth' && user) {
      if (onboardingCompleted === false) {
        console.log('AuthRedirect - Authenticated user in auth page, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else {
        console.log('AuthRedirect - Authenticated user in auth page, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    if (currentPath === '/' && user) {
      if (onboardingCompleted === false) {
        console.log('AuthRedirect - Authenticated user in home page, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else {
        console.log('AuthRedirect - Authenticated user in home page, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
      return;
    }
  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname]);

  // Mostrar spinner solo si estamos cargando y no hay usuario
  if (authLoading || (!user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Verificando estado..." />
      </div>
    );
  }

  return null;
};
