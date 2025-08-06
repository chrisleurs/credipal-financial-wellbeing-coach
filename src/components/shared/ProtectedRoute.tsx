
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user?.email, 'session:', !!session, 'loading:', loading, 'path:', location.pathname);

  if (loading) {
    console.log('ProtectedRoute - showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Verificando autenticación..." />
      </div>
    );
  }

  // Si requiere autenticación y no hay usuario o sesión, redirigir al auth
  if (requireAuth && (!user || !session)) {
    console.log('ProtectedRoute - redirecting to auth, no user or session found');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si NO requiere autenticación pero hay usuario autenticado, permitir acceso
  if (!requireAuth && user && session) {
    console.log('ProtectedRoute - user authenticated, allowing access to non-protected route');
    return <>{children}</>;
  }

  console.log('ProtectedRoute - rendering children');
  return <>{children}</>;
};
