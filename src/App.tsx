
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Pages
import Index from '@/pages/Index'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import Expenses from '@/pages/Expenses'
import Debts from '@/pages/Debts'
import Plan from '@/pages/Plan'
import Progress from '@/pages/Progress'
import Profile from '@/pages/Profile'
import Onboarding from '@/pages/Onboarding'
import PostOnboarding from '@/pages/PostOnboarding'
import Welcome from '@/pages/Welcome'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <AuthRedirect />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/welcome" element={<Welcome />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/expenses" element={
              <ProtectedRoute>
                <AppLayout>
                  <Expenses />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/debts" element={
              <ProtectedRoute>
                <AppLayout>
                  <Debts />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/plan" element={
              <ProtectedRoute>
                <AppLayout>
                  <Plan />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/progress" element={
              <ProtectedRoute>
                <AppLayout>
                  <Progress />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Onboarding Routes */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            <Route path="/post-onboarding" element={
              <ProtectedRoute>
                <PostOnboarding />
              </ProtectedRoute>
            } />
            
            {/* Fallback Routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App
