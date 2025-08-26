
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useOnboardingStatus } from './useOnboardingStatus'
import { supabase } from '@/integrations/supabase/client'

interface AuthFlowStep {
  step: string
  timestamp: number
  status: 'pending' | 'success' | 'error'
  data?: any
  error?: string
}

interface AuthFlowAudit {
  userId?: string
  email?: string
  steps: AuthFlowStep[]
  currentStep: string
  errors: string[]
  isComplete: boolean
}

export const useAuthFlowAudit = () => {
  const { user, session, loading: authLoading } = useAuth()
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus()
  const [audit, setAudit] = useState<AuthFlowAudit>({
    steps: [],
    currentStep: 'initializing',
    errors: [],
    isComplete: false
  })

  const addStep = (step: string, status: 'pending' | 'success' | 'error', data?: any, error?: string) => {
    console.log(`🔍 AUTH AUDIT - ${step}:`, { status, data, error })
    
    setAudit(prev => ({
      ...prev,
      steps: [
        ...prev.steps.filter(s => s.step !== step), // Remove duplicate steps
        {
          step,
          timestamp: Date.now(),
          status,
          data,
          error
        }
      ],
      currentStep: step,
      errors: error ? [...prev.errors, `${step}: ${error}`] : prev.errors
    }))
  }

  // Monitor authentication state
  useEffect(() => {
    addStep('auth_loading_check', authLoading ? 'pending' : 'success', { authLoading })
  }, [authLoading])

  useEffect(() => {
    if (user) {
      addStep('user_authenticated', 'success', { 
        userId: user.id, 
        email: user.email,
        createdAt: user.created_at,
        emailConfirmed: user.email_confirmed_at
      })
      
      setAudit(prev => ({
        ...prev,
        userId: user.id,
        email: user.email
      }))
      
      // Check if profile exists
      checkProfileExists(user.id)
    } else if (!authLoading) {
      addStep('no_user_found', 'success', { message: 'No authenticated user' })
    }
  }, [user, authLoading])

  useEffect(() => {
    if (session) {
      addStep('session_established', 'success', {
        accessToken: session.access_token ? 'present' : 'missing',
        refreshToken: session.refresh_token ? 'present' : 'missing',
        expiresAt: session.expires_at
      })
    } else if (!authLoading) {
      addStep('no_session_found', 'success', { message: 'No active session' })
    }
  }, [session, authLoading])

  // Monitor onboarding status
  useEffect(() => {
    addStep('onboarding_loading_check', onboardingLoading ? 'pending' : 'success', { onboardingLoading })
  }, [onboardingLoading])

  useEffect(() => {
    if (onboardingCompleted !== null) {
      addStep('onboarding_status_determined', 'success', { 
        onboardingCompleted,
        shouldGoToOnboarding: onboardingCompleted === false,
        shouldGoToDashboard: onboardingCompleted === true
      })
    }
  }, [onboardingCompleted])

  const checkProfileExists = async (userId: string) => {
    try {
      addStep('checking_profile', 'pending')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        addStep('checking_profile', 'error', null, error.message)
        return
      }

      if (data) {
        addStep('profile_found', 'success', {
          profileId: data.id,
          onboardingCompleted: data.onboarding_completed,
          onboardingStep: data.onboarding_step,
          firstName: data.first_name,
          lastName: data.last_name
        })
      } else {
        addStep('profile_not_found', 'success', { message: 'Profile needs to be created' })
      }
    } catch (error) {
      addStep('checking_profile', 'error', null, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const checkFinancialData = async (userId: string) => {
    try {
      addStep('checking_financial_data', 'pending')
      
      const [expensesResult, incomesResult, goalsResult] = await Promise.all([
        supabase.from('expenses').select('count').eq('user_id', userId),
        supabase.from('income_sources').select('count').eq('user_id', userId),
        supabase.from('goals').select('count').eq('user_id', userId)
      ])

      addStep('financial_data_checked', 'success', {
        expensesCount: expensesResult.count || 0,
        incomesCount: incomesResult.count || 0,
        goalsCount: goalsResult.count || 0,
        hasFinancialData: (expensesResult.count || 0) > 0 || (incomesResult.count || 0) > 0
      })
    } catch (error) {
      addStep('checking_financial_data', 'error', null, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const runFullAudit = async () => {
    console.log('🔍 Starting full auth flow audit...')
    
    if (user) {
      await checkProfileExists(user.id)
      await checkFinancialData(user.id)
    }
    
    setAudit(prev => ({ ...prev, isComplete: true }))
    console.log('🔍 Full audit completed')
  }

  const getAuditSummary = () => {
    const errors = audit.steps.filter(step => step.status === 'error')
    const pending = audit.steps.filter(step => step.status === 'pending')
    const success = audit.steps.filter(step => step.status === 'success')

    return {
      totalSteps: audit.steps.length,
      successCount: success.length,
      errorCount: errors.length,
      pendingCount: pending.length,
      hasErrors: errors.length > 0,
      hasPending: pending.length > 0,
      errors: errors.map(e => ({ step: e.step, error: e.error })),
      currentStatus: getFlowStatus()
    }
  }

  const getFlowStatus = () => {
    if (authLoading || onboardingLoading) return 'loading'
    if (audit.errors.length > 0) return 'error'
    if (!user) return 'unauthenticated'
    if (onboardingCompleted === null) return 'determining_onboarding'
    if (onboardingCompleted === false) return 'needs_onboarding'
    if (onboardingCompleted === true) return 'ready_for_dashboard'
    return 'unknown'
  }

  const exportAuditLog = () => {
    const auditData = {
      ...audit,
      summary: getAuditSummary(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.log('📊 FULL AUTH AUDIT REPORT:', auditData)
    return auditData
  }

  return {
    audit,
    addStep,
    runFullAudit,
    getAuditSummary,
    getFlowStatus,
    exportAuditLog,
    // Computed states for easy access
    isLoading: authLoading || onboardingLoading,
    hasErrors: audit.errors.length > 0,
    flowStatus: getFlowStatus()
  }
}
