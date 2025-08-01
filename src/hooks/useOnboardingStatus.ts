
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
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors

      if (error) {
        console.error('Error checking onboarding status:', error);
        
        // If profile doesn't exist, create it with onboarding_completed = false
        console.log('Profile does not exist, creating it...');
        await createUserProfile(false);
        return;
      }

      if (!data) {
        // No profile found, create one
        console.log('No profile found, creating one...');
        await createUserProfile(false);
        return;
      }

      const completed = data.onboarding_completed || false;
      console.log('Onboarding status found:', completed);
      setOnboardingCompleted(completed);
    } catch (error) {
      console.error('Exception checking onboarding status:', error);
      // Default to false if there's any error
      setOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (completed: boolean) => {
    if (!user) return;

    try {
      console.log('Creating user profile with onboarding_completed:', completed);
      
      const { error } = await supabase
        .from('profiles')
        .insert({ 
          user_id: user.id, 
          onboarding_completed: completed,
          email: user.email,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null
        });

      if (error) {
        console.error('Error creating profile:', error);
        // Even if creation fails, set the state to prevent infinite loops
        setOnboardingCompleted(false);
        return;
      }

      setOnboardingCompleted(completed);
      console.log('Profile created successfully with onboarding_completed:', completed);
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
      
      // First, try to update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: completed })
        .eq('user_id', user.id);

      if (updateError) {
        console.log('Update failed, trying to insert profile:', updateError);
        
        // If update fails, try to insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            user_id: user.id, 
            onboarding_completed: completed,
            email: user.email,
            first_name: user.user_metadata?.first_name || null,
            last_name: user.user_metadata?.last_name || null
          });

        if (insertError) {
          console.error('Error inserting profile:', insertError);
          throw insertError;
        }
      }

      // Update local state immediately
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
