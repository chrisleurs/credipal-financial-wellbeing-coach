
import { useState, useEffect } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthState {
  user: SupabaseUser | null
  session: Session | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    console.log('useAuth: Setting up auth state listener')
    
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          error: null
        }))
      }
    )

    // Then check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          setState(prev => ({ ...prev, error: error.message, loading: false }))
          return
        }
        
        console.log('Initial session:', session?.user?.email)
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          error: null
        }))
      } catch (error: any) {
        console.error('Error in getInitialSession:', error)
        setState(prev => ({ ...prev, error: error.message, loading: false }))
      }
    }

    getInitialSession()

    return () => {
      console.log('useAuth: Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email)
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error }
      }

      console.log('Sign in successful:', data.user?.email)
      return { data, error: null }
    } catch (error: any) {
      console.error('Sign in exception:', error)
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      return { error }
    }
  }

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    console.log('Attempting sign up for:', email)
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const redirectUrl = `${window.location.origin}/`
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error }
      }

      console.log('Sign up successful:', data.user?.email)
      return { data, error: null }
    } catch (error: any) {
      console.error('Sign up exception:', error)
      setState(prev => ({ ...prev, error: error.message, loading: false }))
      return { error }
    }
  }

  const signOut = async () => {
    console.log('Attempting sign out')
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return
      }
      
      console.log('Sign out successful')
      setState({ user: null, session: null, loading: false, error: null })
    } catch (error: any) {
      console.error('Sign out exception:', error)
      setState(prev => ({ ...prev, error: error.message, loading: false }))
    }
  }

  // Add backward compatibility aliases
  const login = signIn
  const register = signUp
  const logout = signOut

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    login,
    register,
    logout
  }
}
