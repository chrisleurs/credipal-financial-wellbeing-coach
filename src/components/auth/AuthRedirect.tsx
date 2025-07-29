
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export const AuthRedirect = ({ children }: AuthRedirectProps) => {
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

    // Routing inteligente después del login/registro
    const handleUserRouting = () => {
      const currentPath = location.pathname;
      
      // Si el usuario está en auth y ya está autenticado
      if (currentPath === '/auth') {
        if (onboardingCompleted === false) {
          console.log('AuthRedirect - Redirecting new user to onboarding');
          navigate('/onboarding', { replace: true });
        } else if (onboardingCompleted === true) {
          console.log('AuthRedirect - Redirecting existing user to dashboard');
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      // Si el usuario está en la página de inicio y ya está autenticado
      if (currentPath === '/') {
        if (onboardingCompleted === false) {
          console.log('AuthRedirect - Redirecting new user from home to onboarding');
          navigate('/onboarding', { replace: true });
        } else if (onboardingCompleted === true) {
          console.log('AuthRedirect - Redirecting existing user from home to dashboard');
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      // Si el usuario trata de acceder al dashboard sin completar onboarding
      if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/expenses') || 
          currentPath.startsWith('/debts') || currentPath.startsWith('/profile') || 
          currentPath.startsWith('/calendar') || currentPath.startsWith('/plan')) {
        if (onboardingCompleted === false) {
          console.log('AuthRedirect - User trying to access protected route without completing onboarding, redirecting to onboarding');
          navigate('/onboarding', { replace: true });
        }
        return;
      }

      // Si el usuario está en onboarding pero ya lo completó
      if (currentPath === '/onboarding' && onboardingCompleted === true) {
        console.log('AuthRedirect - User completed onboarding, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }
    };

    handleUserRouting();
  }, [user, onboardingCompleted, authLoading, onboardingLoading, navigate, location.pathname]);

  // Mostrar spinner mientras cargamos el estado de autenticación y onboarding
  if (authLoading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Verificando estado..." />
      </div>
    );
  }

  return <>{children}</>;
};
