
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useOnboardingStatus } from './useOnboardingStatus';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { onboardingCompleted, isLoading } = useOnboardingStatus();

  const navigateTo = (path: string) => {
    console.log('🔄 Navigating to:', path);
    
    if (!user) {
      console.log('❌ No user found, redirecting to auth');
      navigate('/auth');
      return;
    }
    
    // Don't navigate if still loading onboarding status
    if (isLoading) {
      console.log('⏳ Navigation blocked: onboarding status loading');
      return;
    }
    
    // If onboarding is not completed, redirect to onboarding
    if (onboardingCompleted === false) {
      console.log('❌ Navigation blocked: onboarding incomplete, redirecting to onboarding');
      navigate('/kueski-debt');
      return;
    }
    
    // Allow navigation for completed users
    console.log('✅ Navigation allowed to:', path);
    navigate(path);
  };

  const canNavigate = user && !isLoading && onboardingCompleted === true;

  return { 
    navigateTo,
    canNavigate,
    user,
    onboardingCompleted,
    isLoading
  };
};
