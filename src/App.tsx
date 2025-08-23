
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Debts from './pages/Debts'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import PostOnboarding from './pages/PostOnboarding'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AuthRedirect } from '@/components/auth/AuthRedirect'
import Plan from './pages/Plan'
import Progress from './pages/Progress'
import Coach from './pages/Coach'

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthRedirect />
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Auth />} />
            
            {/* Onboarding Routes */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute requireAuth>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/post-onboarding"
              element={
                <ProtectedRoute requireAuth>
                  <PostOnboarding />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAuth>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/expenses"
              element={
                <ProtectedRoute requireAuth>
                  <Expenses />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/debts"
              element={
                <ProtectedRoute requireAuth>
                  <Debts />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plan"
              element={
                <ProtectedRoute requireAuth>
                  <Plan />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/progress"
              element={
                <ProtectedRoute requireAuth>
                  <Progress />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/coach"
              element={
                <ProtectedRoute requireAuth>
                  <Coach />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Route - Redirect to Auth */}
            <Route path="*" element={<Auth />} />
          </Routes>
          <Toaster />
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
