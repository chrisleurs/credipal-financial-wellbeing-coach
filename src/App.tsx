
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Dashboard from '@/pages/Dashboard'
import Expenses from '@/pages/Expenses'
import Debts from '@/pages/Debts'
import Plan from '@/pages/Plan'
import Profile from '@/pages/Profile'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import PostOnboarding from '@/pages/PostOnboarding'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { AuthFlowDebugger } from '@/components/debug/AuthFlowDebugger'

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthRedirect />
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/debts" element={<ProtectedRoute><Debts /></ProtectedRoute>} />
              <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute requireAuth={true}><Onboarding /></ProtectedRoute>} />
              <Route path="/post-onboarding" element={<ProtectedRoute requireAuth={true}><PostOnboarding /></ProtectedRoute>} />
            </Routes>
          </div>
          
          {/* Debug component - only show in development */}
          {process.env.NODE_ENV === 'development' && <AuthFlowDebugger />}
          
          <Toaster />
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
