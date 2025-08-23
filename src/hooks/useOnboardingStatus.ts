
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
        .select('onboarding_completed, onboarding_step')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        // Si hay error, el perfil no existe, crear uno nuevo
        await createUserProfile();
        return;
      }

      if (!data) {
        console.log('No profile found, creating new one for user:', user.id);
        await createUserProfile();
        return;
      }

      // Usuario existente - usar su estado real
      const completed = data.onboarding_completed === true;
      console.log('User onboarding status:', completed);
      setOnboardingCompleted(completed);
    } catch (error) {
      console.error('Exception checking onboarding status:', error);
      setOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Creating new profile for user:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          user_id: user.id, 
          onboarding_completed: false,
          onboarding_step: 0,
          onboarding_data: {},
          email: user.email,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error creating profile:', error);
        setOnboardingCompleted(false);
        return;
      }

      setOnboardingCompleted(false); // Nuevo usuario = onboarding incompleto
      console.log('New profile created successfully for user:', user.id);
    } catch (error) {
      console.error('Exception creating profile:', error);
      setOnboardingCompleted(false);
    }
  };

  const updateOnboardingStatus = async (completed: boolean) => {
    if (!user) {
      console.error('No user found when updating onboarding status');
      throw new Error('No user found');
    }

    try {
      console.log('Updating onboarding status to:', completed, 'for user:', user.id);
      
      const updateData: any = { onboarding_completed: completed };
      
      if (completed) {
        updateData.onboarding_step = 0;
        updateData.onboarding_data = {};
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating onboarding status:', error);
        throw error;
      }

      setOnboardingCompleted(completed);
      console.log('Onboarding status updated successfully to:', completed);
      
    } catch (error) {
      console.error('Exception updating onboarding status:', error);
      throw error;
    }
  };

  return {
    isLoading,
    onboardingCompleted,
    updateOnboardingStatus
  };
};
