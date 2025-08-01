
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
      console.log('Checking onboarding status in clean database for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed, onboarding_step')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        
        console.log('Profile does not exist in clean database, creating it...');
        await createUserProfile(false);
        return;
      }

      if (!data) {
        console.log('No profile found in clean database, creating fresh one...');
        await createUserProfile(false);
        return;
      }

      // Since database was cleaned, reset any previous completion status
      const completed = false; // All users start fresh after cleanup
      console.log('Setting fresh onboarding status after database cleanup:', completed);
      setOnboardingCompleted(completed);
    } catch (error) {
      console.error('Exception checking onboarding status:', error);
      setOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (completed: boolean) => {
    if (!user) return;

    try {
      console.log('Creating fresh user profile in clean database with onboarding_completed:', completed);
      
      const { error } = await supabase
        .from('profiles')
        .insert({ 
          user_id: user.id, 
          onboarding_completed: completed,
          onboarding_step: 0,
          onboarding_data: {},
          email: user.email,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null
        });

      if (error) {
        console.error('Error creating profile in clean database:', error);
        setOnboardingCompleted(false);
        return;
      }

      setOnboardingCompleted(completed);
      console.log('Fresh profile created successfully in clean database with onboarding_completed:', completed);
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
      console.log('Updating onboarding status in clean database to:', completed, 'for user:', user.id);
      
      const updateData: any = { onboarding_completed: completed };
      
      // If marking as completed, also reset the progress fields
      if (completed) {
        updateData.onboarding_step = 0;
        updateData.onboarding_data = {};
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) {
        console.log('Update failed, trying to insert fresh profile in clean database:', updateError);
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            user_id: user.id, 
            onboarding_completed: completed,
            onboarding_step: completed ? 0 : undefined,
            onboarding_data: completed ? {} : undefined,
            email: user.email,
            first_name: user.user_metadata?.first_name || null,
            last_name: user.user_metadata?.last_name || null
          });

        if (insertError) {
          console.error('Error inserting profile in clean database:', insertError);
          throw insertError;
        }
      }

      setOnboardingCompleted(completed);
      console.log('Onboarding status updated successfully in clean database to:', completed);
      
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
