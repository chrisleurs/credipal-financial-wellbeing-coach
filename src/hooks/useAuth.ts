import { useState, useEffect } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, getCurrentUser } from '@/services/supabase'

interface AuthState {
  user: SupabaseUser | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Check current session
    getCurrentUser()
      .then((user) => {
        setState(prev => ({ ...prev, user: user as SupabaseUser, loading: false }))
      })
      .catch((error) => {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
      })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user ?? null
        setState(prev => ({ ...prev, user, loading: false }))
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
    }
  }

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })
      
      if (error) throw error
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setState({ user: null, loading: false, error: null })
    } catch (error: any) {
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