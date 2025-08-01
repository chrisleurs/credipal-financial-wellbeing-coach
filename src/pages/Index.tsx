
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { Welcome } from './Welcome';
import { FinancialDashboard } from '@/components/dashboard/FinancialDashboard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading, logout } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
  };

  // Si hay un usuario autenticado, el AuthRedirect se encarga de la lógica de redirección
  // Este componente solo maneja el caso cuando NO hay usuario
  if (loading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    );
  }

  // Si hay usuario autenticado, AuthRedirect manejará la redirección
  // Pero si por alguna razón llegamos aquí con usuario, mostramos el dashboard
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

  // Si no hay usuario, mostrar Welcome
  return <Welcome />;
};

export default Index;
