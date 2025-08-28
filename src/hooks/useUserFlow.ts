
import { useAuth } from './useAuth';
import { useOnboardingStatus } from './useOnboardingStatus';
import { useLocation } from 'react-router-dom';

export type UserFlowState = 
  | 'loading'
  | 'unauthenticated'
  | 'needs_kueski_review'
  | 'needs_onboarding'
  | 'onboarding_in_progress'
  | 'ready_for_dashboard'
  | 'in_dashboard';

export const useUserFlow = () => {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const location = useLocation();

  const getFlowState = (): UserFlowState => {
    // Still loading auth
    if (authLoading) return 'loading';
    
    // Not authenticated
    if (!user) return 'unauthenticated';
    
    // Loading onboarding status
    if (onboardingLoading) return 'loading';
    
    // Determine state based on onboarding completion
    if (onboardingCompleted === false) {
      // User needs to go through the flow
      if (location.pathname === '/kueski-debt') return 'needs_kueski_review';
      if (location.pathname === '/onboarding') return 'onboarding_in_progress';
      return 'needs_kueski_review'; // Default for incomplete onboarding
    }
    
    if (onboardingCompleted === true) {
      if (location.pathname.startsWith('/dashboard') || 
          location.pathname.startsWith('/expenses') ||
          location.pathname.startsWith('/debts') ||
          location.pathname.startsWith('/plan') ||
          location.pathname.startsWith('/progress') ||
          location.pathname.startsWith('/profile')) {
        return 'in_dashboard';
      }
      return 'ready_for_dashboard';
    }
    
    // Default fallback
    return 'loading';
  };

  const flowState = getFlowState();
  
  const isLoading = flowState === 'loading';
  const canAccessDashboard = flowState === 'ready_for_dashboard' || flowState === 'in_dashboard';
  const needsOnboarding = flowState === 'needs_kueski_review' || flowState === 'needs_onboarding' || flowState === 'onboarding_in_progress';

  return {
    flowState,
    isLoading,
    canAccessDashboard,
    needsOnboarding,
    user,
    onboardingCompleted
  };
};
