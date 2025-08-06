
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateTo = (path: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Permitir navegación directa sin validar onboarding para usuarios autenticados
    navigate(path);
  };

  return { navigateTo };
};
