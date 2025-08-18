
import { useConsolidatedProfile } from './useConsolidatedProfile'

export const useFinancialPlanGenerator = () => {
  const { consolidatedProfile, hasCompleteData, isLoading } = useConsolidatedProfile()
  
  return {
    consolidatedProfile,
    hasCompleteData,
    isLoading,
    generatePlan: () => {
      // This will be implemented when we create the plan generation
      console.log('Generate plan with profile:', consolidatedProfile)
    }
  }
}
