
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AuthRedirect } from '@/components/auth/AuthRedirect'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Index from '@/pages/Index'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Expenses from '@/pages/Expenses'
import Debts from '@/pages/Debts'
import Plan from '@/pages/Plan'
import Profile from '@/pages/Profile'
import Calendar from '@/pages/Calendar'
import NotFound from '@/pages/NotFound'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Router>
            <div className="App">
              <AuthRedirect />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                
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
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Calendar />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
