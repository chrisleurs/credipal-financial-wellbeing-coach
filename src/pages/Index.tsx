
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Welcome } from './Welcome';
import { FinancialDashboard } from '@/components/dashboard/FinancialDashboard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
  };

  // Redirect authenticated users directly to dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    );
  }

  if (user) {
    return (
      <>
        <div className="absolute top-4 right-4 z-50">
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            Cerrar Sesión
          </Button>
        </div>
        <FinancialDashboard />
      </>
    );
  }

  return <Welcome />;
};

export default Index;
