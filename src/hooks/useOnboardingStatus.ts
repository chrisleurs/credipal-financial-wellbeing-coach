
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface OnboardingStatus {
  isLoading: boolean;
  onboardingCompleted: boolean | null;
  updateOnboardingStatus: (completed: boolean) => Promise<void>;
}

export const useOnboardingStatus = (): OnboardingStatus => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setOnboardingCompleted(null);
      setIsLoading(false);
      return;
    }

    checkOnboardingStatus();
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Checking onboarding status for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingCompleted(false);
        return;
      }

      console.log('Onboarding status:', data?.onboarding_completed);
      setOnboardingCompleted(data?.onboarding_completed || false);
    } catch (error) {
      console.error('Exception checking onboarding status:', error);
      setOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOnboardingStatus = async (completed: boolean) => {
    if (!user) return;

    try {
      console.log('Updating onboarding status to:', completed);
      
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: completed })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating onboarding status:', error);
        return;
      }

      setOnboardingCompleted(completed);
      console.log('Onboarding status updated successfully');
    } catch (error) {
      console.error('Exception updating onboarding status:', error);
    }
  };

  return {
    isLoading,
    onboardingCompleted,
    updateOnboardingStatus
  };
};
