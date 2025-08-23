
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useOnboardingStatus } from './useOnboardingStatus';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { onboardingCompleted, isLoading } = useOnboardingStatus();

  const navigateTo = (path: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Don't navigate if still loading onboarding status
    if (isLoading) {
      console.log('Navigation blocked: onboarding status loading');
      return;
    }
    
    // If onboarding is not completed, redirect to onboarding
    if (onboardingCompleted === false) {
      console.log('Navigation blocked: onboarding incomplete, redirecting to onboarding');
      navigate('/onboarding');
      return;
    }
    
    // Allow navigation for completed users
    navigate(path);
  };

  return { navigateTo };
};
