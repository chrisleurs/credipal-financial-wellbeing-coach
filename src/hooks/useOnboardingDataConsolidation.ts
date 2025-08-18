
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'

export const useOnboardingDataConsolidation = () => {
  const { user } = useAuth()

  const onboardingData = useQuery({
    queryKey: ['onboarding-data', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_completed')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  const consolidateOnboardingData = async (data: any) => {
    console.log('Consolidating onboarding data:', data)
    // Implementation would go here
  }

  return {
    onboardingData: onboardingData.data?.onboarding_data || {},
    isCompleted: onboardingData.data?.onboarding_completed || false,
    isLoading: onboardingData.isLoading,
    error: onboardingData.error,
    consolidateOnboardingData
  }
}
