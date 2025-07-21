
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
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user, 'loading:', loading, 'path:', location.pathname);

  if (loading) {
    console.log('ProtectedRoute - showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Verificando autenticación..." />
      </div>
    );
  }

  if (requireAuth && !user) {
    console.log('ProtectedRoute - redirecting to auth, no user found');
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    console.log('ProtectedRoute - user authenticated but route does not require auth');
    // If user is authenticated but route doesn't require auth (like login page)
    // redirect to dashboard or home
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  console.log('ProtectedRoute - rendering children');
  return <>{children}</>;
};
