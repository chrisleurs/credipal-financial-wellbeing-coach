
import { useState, useEffect } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthState {
  user: SupabaseUser | null
  session: Session | null
  loading: boolean
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    console.log('useAuth: Setting up auth state listener')
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session:', session?.user?.email || 'No session')
        setState({
          session,
          user: session?.user ?? null,
          loading: false
        })
      } catch (error) {
        console.error('Error getting initial session:', error)
        setState(prev => ({ ...prev, loading: false }))
      }
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No session')
        setState({
          session,
          user: session?.user ?? null,
          loading: false
        })
      }
    )

    getInitialSession()

    return () => {
      console.log('useAuth: Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }

      console.log('Sign in successful:', data.user?.email)
      return { data, error: null }
    } catch (error: any) {
      console.error('Sign in exception:', error)
      return { error: { message: error.message } }
    }
  }

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    console.log('Attempting sign up for:', email)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }

      console.log('Sign up result:', data)
      return { data, error: null }
    } catch (error: any) {
      console.error('Sign up exception:', error)
      return { error: { message: error.message } }
    }
  }

  const signOut = async () => {
    console.log('Attempting sign out')
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        return { error }
      }
      
      console.log('Sign out successful')
      return { error: null }
    } catch (error: any) {
      console.error('Sign out exception:', error)
      return { error: { message: error.message } }
    }
  }

  const resetPassword = async (email: string) => {
    console.log('Attempting password reset for:', email)
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      })
      
      if (error) {
        console.error('Reset password error:', error)
        return { error }
      }

      console.log('Password reset email sent successfully')
      return { data, error: null }
    } catch (error: any) {
      console.error('Reset password exception:', error)
      return { error: { message: error.message } }
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    // Aliases for backward compatibility
    login: signIn,
    register: signUp,
    logout: signOut
  }
}
