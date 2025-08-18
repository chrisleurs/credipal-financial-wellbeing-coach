
/**
 * Core User Types - User profile and onboarding
 */

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
}

export type OnboardingStep = 
  | 'income' 
  | 'expenses' 
  | 'debts' 
  | 'savings'
  | 'goals' 
  | 'whatsapp'
  | 'summary'
  | 'processing'
  | 'complete'

export interface OnboardingProgress {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  isComplete: boolean
  data?: Record<string, any>
}

export interface UserProfile {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  onboardingProgress: OnboardingProgress
  createdAt: string
  updatedAt: string
}
